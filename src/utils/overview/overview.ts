import { Guardian, PosOverview, PosOverviewData, PosOverviewSlice } from '@orbs-network/pos-analytics-lib';
import { TFunction } from 'i18next';
import { ChartUnit, OverviewSections } from '../../global/enums';
import {
    BarChartDataset,
    GuardiansChartDatasetObject,
    MenuOption,
    OverviewChartData,
    OverviewChartObject,
    OverviewGuardianDataset
} from '../../global/types';
import { routes } from '../../routes/routes';
import {
    converFromNumberToDate,
    generateDays,
    generateMonths,
    generateWeeks,
    getDateFormatByUnit,
    returnDateNumber
} from '../dates';
import { sortByNumber } from '../array';
import { overviewguardiansColors } from '../../ui/colors';
import { DATE_FORMAT, OVERVIEW_CHART_LIMIT } from '../../global/variables';
import moment from 'moment';
import { yellow } from '@material-ui/core/colors';

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

export const getGuardianColor = (index: number) => {
    const colorIndex = index % overviewguardiansColors.length;
    return overviewguardiansColors[colorIndex];
};

const fillChartData = (dates: Date[], unit: ChartUnit): GuardiansChartDatasetObject[] => {
    return dates.map((date) => {
        const blockTimeDate = moment(date);
        const blockTimeByUnit = getDateFormatByUnit(blockTimeDate, unit);

        return {
            group: blockTimeByUnit,
            x: moment(date).format(DATE_FORMAT),
            y: null
        };
    });
};

export const createGuardianDatasets = (
    sortedGuardians: PosOverviewData[],
    dates: Date[],
    unit: ChartUnit,
    guardiansColors?: { [id: string]: string }
): { [id: string]: OverviewGuardianDataset } => {
    const guardiansObject: { [id: string]: OverviewGuardianDataset } = {};
    sortedGuardians.forEach((guardian: PosOverviewData, index: number) => {
        const obj = {
            order: index,
            backgroundColor: guardiansColors ? guardiansColors[guardian.address] : getGuardianColor(index),
            label: guardian.name,
            data: fillChartData(dates, unit),
            maxBarThickness: 30,
            hoverBackgroundColor: undefined
        };
        guardiansObject[guardian.address] = obj;
    });
    return guardiansObject;
};

export const fillEmptyData = (orderObject: any, unit: ChartUnit): OverviewChartObject[] => {
    const filledChartData = Object.keys(orderObject).map(function (key, index) {
        const data = orderObject[key];
        const date = converFromNumberToDate(Number(key), unit, DATE_FORMAT);
        if (data.length === 0) {
            return {
                data: [],
                date
            };
        } else {
            return {
                date,
                data
            };
        }
    });
    return filledChartData;
};
export const getLastSlice = (slices: PosOverviewSlice[]) => {
    if (!slices || slices.length === 0) return;
    const sorted = slices.sort((s1, s2) => s2.block_time - s1.block_time);
    return sorted[0];
};

export const filledEmptyData = (data: GuardiansChartDatasetObject[]) => {
    let previousValue = 0;
    return data
        .sort((d1, d2) => moment(d1.x, DATE_FORMAT).valueOf() - moment(d2.x, DATE_FORMAT).valueOf())
        .map((elem) => {
            const { y } = elem;
            if (!y || y === 0) {
                return {
                    ...elem,
                    y: previousValue
                };
            } else {
                previousValue = y || previousValue;
                return {
                    ...elem
                };
            }
        });
};
