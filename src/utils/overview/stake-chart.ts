import { PosOverview, PosOverviewSlice, PosOverviewData, Guardian } from '@orbs-network/pos-analytics-lib';
import { ChartUnit } from '../../global/enums';
import { DATE_FORMAT, OVERVIEW_CHART_LIMIT } from '../../global/variables';
import { sortByNumber } from '../array';
import { returnDateNumber, converFromNumberToDate, generateMonths, generateDays, generateWeeks } from '../dates';
import { getGuardiansOrder } from './overview';
import moment from 'moment';
export const generateDataset = (arr: any) => {
    const result = Object.keys(arr).map((key) => {
        return arr[key];
    });
    return result;
};

const filledEmptyData = (data: any) => {
    let previousEffectiveStake = 0;
    return data.map((elem: any) => {
        const { y } = elem;
        if (y === 0) {
            return {
                ...elem,
                y: previousEffectiveStake
            };
        } else {
            previousEffectiveStake = y;
            return {
                ...elem
            };
        }
    });
};

const insertGuardiansByDate = (slices: PosOverviewSlice[], unit: ChartUnit, dates: any, order: any) => {
    const datesInUse: any = [];
    slices.forEach(({ block_time, data }: PosOverviewSlice) => {
        const sliceDate = returnDateNumber(block_time, unit);
        if (!sliceDate) return;
        if (!dates.hasOwnProperty(sliceDate)) return;
        if (datesInUse.includes(sliceDate)) return;
        datesInUse.push(sliceDate);
        const dateInString = converFromNumberToDate(sliceDate, unit, DATE_FORMAT);
        data.forEach(({ effective_stake, address }: PosOverviewData, i: number) => {
            const guardianObject = {
                x: dateInString,
                y: effective_stake
            };
            const index = order[address].data.findIndex((i: any) => i.x === dateInString);

            if (index < 0) return;
            order[address].data.splice(index, 1, guardianObject);
            order[address].data = filledEmptyData(order[address].data);
        });
    });
    return order;
};

const getNewestSlice = (slices: PosOverviewSlice[]) => {
    const sorted = sortByNumber(slices, 'block_time');
    return sorted[0];
};
// export const getOverviewChartData = (
//     minDate: Date,
//     guardians: Guardian[],
//     dates: any,
//     unit: ChartUnit,
//     overviewData: PosOverview
// ) => {
//     const { slices } = overviewData;
//     const NewestSlice = getNewestSlice(slices);
//     let order = getGuardiansOrder(guardians, NewestSlice, 'effective_stake', unit, dates);
//     order = insertGuardiansByDate(slices, unit, dates, order);
//     const obj = {
//         data: generateDataset(order),
//         unit
//     };
//     return obj;
// };

export const getOverviewChartData = (
    minDate: Date,
    guardians: Guardian[],
    dates: any,
    unit: ChartUnit,
    { slices }: PosOverview
) => {
    const moMinDate = moment(minDate);
    const filteredSlices = slices.filter((s) => moment.unix(s.block_time) >= moMinDate);

    const NewestSlice = getNewestSlice(filteredSlices);
    let order = getGuardiansOrder(guardians, NewestSlice, 'effective_stake', unit, dates);
    order = insertGuardiansByDate(slices, unit, dates, order);
    const obj = {
        data: generateDataset(order),
        unit
    };
    return obj;
};

export const getStakeChartData = (guardians: Guardian[], unit: ChartUnit, overviewData?: PosOverview): any => {
    if (!overviewData) return;
    let dates, minDate;
    switch (unit) {
        case ChartUnit.WEEK:
            minDate = moment().subtract(OVERVIEW_CHART_LIMIT, 'weeks');
            dates = generateWeeks(OVERVIEW_CHART_LIMIT);
            break;
        case ChartUnit.DAY:
            minDate = moment().subtract(OVERVIEW_CHART_LIMIT, 'days');
            dates = generateDays(OVERVIEW_CHART_LIMIT);
            break;
        default:
            minDate = moment().subtract(OVERVIEW_CHART_LIMIT, 'week');
            dates = generateWeeks(OVERVIEW_CHART_LIMIT);
            break;
    }
    if (!dates) return;
    return getOverviewChartData(minDate.toDate(), guardians, dates, unit, overviewData);
};
