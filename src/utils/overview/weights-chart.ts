import { PosOverview, PosOverviewSlice, PosOverviewData, Guardian } from '@orbs-network/pos-analytics-lib';
import { OverviewGuardianDataset, GuardiansChartDatasetObject } from 'global/types';
import moment from 'moment';
import { ChartUnit } from '../../global/enums';
import { DATE_FORMAT, OVERVIEW_CHART_LIMIT } from '../../global/variables';
import { generateWeeks, generateDays, getDateFormatByUnit } from '../dates';
import { createGuardianDatasets, filledEmptyData, getLastSlice } from './overview';

export const generateDataset = (arr: any) => {
    const result = Object.keys(arr).map((key) => {
        return arr[key];
    });
    return result;
};

const calculateTotalWeight = (data: PosOverviewData[]) => {
    return data
        .map((m) => m.weight)
        .reduce(function (total, g1) {
            return total + g1;
        }, 0);
};

const insertGuardiansByDate = (
    slices: PosOverviewSlice[],
    unit: ChartUnit,
    dates: Date[],
    guardianDatasets: { [id: string]: OverviewGuardianDataset }
) => {
    const latestSlices = dates
        .map((d) => {
            let mDate = moment(d);
            let slicesForDate = slices.filter(({ block_time }: PosOverviewSlice) => {
                const blockTimeDate = moment.unix(block_time);
                return mDate.format(DATE_FORMAT) === blockTimeDate.format(DATE_FORMAT);
            });

            return slicesForDate[slicesForDate.length - 1];
        })
        .filter((s) => s && s.block_time);

    latestSlices.forEach(({ block_time, data }: PosOverviewSlice) => {
        const blockTimeDate = moment.unix(block_time);
        const blockTimeByUnit = getDateFormatByUnit(blockTimeDate, unit);
        const totalWeight = calculateTotalWeight(data);

        data.forEach(({ address, weight }: PosOverviewData) => {
            const percent = (weight / totalWeight) * 100;
            const currDataset = guardianDatasets[address];
            const index = currDataset.data.findIndex((i) => {
                return blockTimeDate.format(DATE_FORMAT) === i.x;
            });

            if (index < 0) return;
            const point: GuardiansChartDatasetObject = {
                group: blockTimeByUnit,
                x: blockTimeDate.format(DATE_FORMAT),
                y: percent
            };
            currDataset.data.splice(index, 1, point);
            currDataset.data = filledEmptyData(currDataset.data);
        });
    });

    return guardianDatasets;
};

export const getOverviewChartData = (
    minDate: Date,
    dates: any,
    unit: ChartUnit,
    { slices }: PosOverview,
    guardiansColors?: { [id: string]: string }
) => {
    const moMinDate = moment(minDate);
    const filteredSlices = slices.filter((s) => moment.unix(s.block_time) >= moMinDate);
    const lastSlice = getLastSlice(filteredSlices);
    if (!lastSlice) return;
    const sortedGuardians = lastSlice.data.sort((s1, s2) => s2.weight - s1.weight);
    let guardianDatasets = createGuardianDatasets(sortedGuardians, dates, unit, guardiansColors);
    insertGuardiansByDate(filteredSlices, unit, dates, guardianDatasets);
    const obj = {
        data: generateDataset(guardianDatasets),
        unit,
        guardianDatasets
    };
    return obj;
};
export const getWeightsChartData = (
    unit: ChartUnit,
    overviewData?: PosOverview,
    guardiansColors?: { [id: string]: string }
): any => {
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
    return getOverviewChartData(minDate.toDate(), dates, unit, overviewData, guardiansColors);
};
