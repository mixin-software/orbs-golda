import { Guardian, PosOverview, PosOverviewData, PosOverviewSlice } from '@orbs-network/pos-analytics-lib';
import { TFunction } from 'i18next';
import { ChartUnit, OverviewSections } from '../global/enums';
import { ChartDatasetObject, MenuOption } from '../global/types';
import { routes } from '../routes/routes';
import moment from 'moment';
import { converFromNumberToDate, generateDays, generateMonths, generateWeeks, returnDateNumber } from './dates';
import { sortByDate, sortByNumber } from './array';
import { overviewguardiansColors } from '../ui/colors';
import { api } from '../services/api';
import { DATE_FORMAT, STACK_GRAPH_MONTHS_LIMIT } from '../global/variables';
export const getGuardiantsAndCandidates = (guardians: Guardian[]) => {
    console.log(guardians);
};

export const generateOverviewRoutes = (t: TFunction): MenuOption[] => {
    return [
        {
            name: t('main.stake'),
            route: routes.overview.stake,
            key: OverviewSections.STAKE
        },
        {
            name: t('main.weights'),
            route: routes.overview.weights,
            key: OverviewSections.WEIGHTS
        }
    ];
};

export const getGuardianColor = (amount: number) => {
    let arr: string[] = [];
    let count = 0;
    const limit = overviewguardiansColors.length - 1;
    for (let i = 0; i < amount; i++) {
        const color = overviewguardiansColors[count];
        arr.push(color);
        if (count === limit) {
            count = 0;
        } else {
            count += 1;
        }
    }
    return arr;
};

const getSortedGuardiansOrder = (slices: PosOverviewSlice[]) => {
    const sorted = sortByDate(slices);
    const latest: PosOverviewSlice = sorted[0];
    const { data } = latest;
    const sortedGuardians = sortByNumber(data, 'effectiveStake');
    const guardiansObject: any = {};
    sortedGuardians.forEach((guardian: Guardian, index: number) => {
        const obj: any = {
            order: index
        };
        guardiansObject[guardian.address] = obj;
    });
    return guardiansObject;
};

const orderArr = (data: PosOverviewData[], orderObject: any) => {
    return data.sort((a: PosOverviewData, b: PosOverviewData) => {
        return orderObject[a.address] - orderObject[b.address];
    });
};

export const getOverviewChartData = (dates: any, unit: ChartUnit, overviewData: PosOverview) => {
    const { slices } = overviewData;
    const order = getSortedGuardiansOrder(slices);
    const datesInUse: any = [];
    slices.forEach((slice: PosOverviewSlice) => {
        const { block_time, data } = slice;
        const date = returnDateNumber(block_time, unit);
        if (!date) return;
        if (!dates.hasOwnProperty(date)) return;
        if (datesInUse.includes(date)) return;
        datesInUse.push(date);
        dates[date] = orderArr(data, order);
    });
    const filled = checkIfEmptyDate(dates, unit);
    return {
        data: filled,
        unit
    };
};

export const checkIfEmptyDate = (dates: any, unit: ChartUnit) => {
    let previousData: any = [];
    const data = Object.keys(dates).map(function (key, index) {
        const data = dates[key];
        const date = converFromNumberToDate(Number(key), unit, DATE_FORMAT);
        if (data.length === 0) {
            return {
                date,
                data: previousData
            };
        } else {
            previousData = data;
            return {
                date,
                data: dates[key]
            };
        }
    });
    return data;
};

export const generateOverviewChartData = (type: ChartUnit, overviewData?: PosOverview) => {
    if (!overviewData) return;
    let data;
    switch (type) {
        case ChartUnit.MONTH:
            const months = generateMonths(STACK_GRAPH_MONTHS_LIMIT);
            data = getOverviewChartData(months, ChartUnit.MONTH, overviewData);
            break;
        case ChartUnit.WEEK:
            const weeks = generateWeeks(STACK_GRAPH_MONTHS_LIMIT);
            data = getOverviewChartData(weeks, ChartUnit.WEEK, overviewData);
            break;
        case ChartUnit.DAY:
            const days = generateDays(STACK_GRAPH_MONTHS_LIMIT);
            data = getOverviewChartData(days, ChartUnit.DAY, overviewData);
            break;
        default:
            break;
    }
    return data;
};
