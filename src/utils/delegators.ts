import { Delegator, DelegatorAction, DelegatorStake } from '@orbs-network/pos-analytics-lib';
import { TFunction } from 'i18next';
import { ChartColors, ChartUnit, ChartYaxis, DelegatorActionsTypes, DelegatorsSections } from '../global/enums';
import { ChartData, ChartDatasetObject, MenuOption } from '../global/types';
import { routes } from '../routes/routes';
import moment from 'moment';
import {
    converFromNumberToDateMilliseconds,
    generateDays,
    generateMonths,
    generateWeeks,
    returnDateNumber
} from './dates';
import { sortByDate } from './array';
import { STACK_GRAPH_MONTHS_LIMIT } from '../global/variables';
import { convertToString } from './number';
export const generateDelegatorsRoutes = (t: TFunction, delegator?: Delegator): MenuOption[] => {
    const address = delegator ? delegator.address : '';
    return [
        {
            name: t('main.stake'),
            route: routes.delegators.stake.replace(':address', address),
            key: DelegatorsSections.STAKE
        },
        {
            name: t('main.rewards'),
            route: routes.delegators.rewards.replace(':address', address),
            key: DelegatorsSections.REWARDS
        },
        {
            name: t('main.actions'),
            route: routes.delegators.actions.replace(':address', address),
            key: DelegatorsSections.ACTIONS
        }
    ];
};

export const checkIfLoadDeligator = (address?: string, delegator?: Delegator): boolean => {
    if (!address) return false;
    if (!delegator) return true;
    if (delegator.address.toLowerCase() === address.toLowerCase()) return false;
    return true;
};
const fillDelegatorsChartData = (dates: any, unit: ChartUnit) => {
    let arr: ChartDatasetObject[] = [];
    Object.keys(dates).forEach((key: string) => {
        const date = converFromNumberToDateMilliseconds(Number(key), unit);
        const datasetObject = {
            x: date,
            y: null
        };
        arr.push(datasetObject);
    });
    return arr;
};
export const getDelegatorChartData = (dates: any, unit: ChartUnit, delegator: Delegator): ChartData => {
    const { stake_slices } = delegator;
    let arr = fillDelegatorsChartData(dates, unit);
    stake_slices.map((slice: DelegatorStake) => {
        const { block_time, stake } = slice;
        const date = returnDateNumber(block_time, unit);
        if (!dates.hasOwnProperty(date)) return;
        const datasetObject = {
            x: moment.unix(block_time).valueOf(),
            y: stake
        };
        arr.push(datasetObject);
    });
    const dataset = {
        data: sortByDate(arr),
        color: ChartColors.TOTAL_STAKE,
        yAxis: ChartYaxis.Y1
    };
    return {
        datasets: [dataset],
        unit
    };
};

export const generateDelegatorsActionColors = (event: DelegatorActionsTypes) => {
    switch (event) {
        case DelegatorActionsTypes.STAKED:
            return 'green';
        case DelegatorActionsTypes.RESTAKED:
            return 'green';
        case DelegatorActionsTypes.UNSTAKED:
            return 'red';
        case DelegatorActionsTypes.WITHDREW:
            return 'red';
        case DelegatorActionsTypes.CLAIMED:
            return 'black';
        default:
            break;
    }
};

export const generateDelegatorsCurrentStake = (event: DelegatorActionsTypes, currentStake?: number) => {
    switch (event) {
        case DelegatorActionsTypes.STAKED:
            return convertToString(currentStake, '0');
        case DelegatorActionsTypes.RESTAKED:
            return convertToString(currentStake, '0');
        case DelegatorActionsTypes.UNSTAKED:
            return convertToString(currentStake, '0');
        case DelegatorActionsTypes.WITHDREW:
            return convertToString(currentStake, '0');
        default:
            return convertToString(currentStake, '-');
    }
};

export const generateDelegatorChartData = (type: ChartUnit, selectedDelegator?: Delegator): ChartData | undefined => {
    if (!selectedDelegator) return;
    let data;
    switch (type) {
        case ChartUnit.MONTH:
            const months = generateMonths(STACK_GRAPH_MONTHS_LIMIT);
            data = getDelegatorChartData(months, ChartUnit.MONTH, selectedDelegator);
            break;
        case ChartUnit.WEEK:
            const weeks = generateWeeks(STACK_GRAPH_MONTHS_LIMIT);
            data = getDelegatorChartData(weeks, ChartUnit.WEEK, selectedDelegator);
            break;
        case ChartUnit.DAY:
            const days = generateDays(STACK_GRAPH_MONTHS_LIMIT);
            data = getDelegatorChartData(days, ChartUnit.DAY, selectedDelegator);
            break;
        default:
            break;
    }
    return data;
};

export const getDelegatorRewardActions = (actions?: DelegatorAction[]) => {
    if (!actions) return [];
    return actions.filter((action: DelegatorAction) => action.event === DelegatorActionsTypes.CLAIMED);
};
