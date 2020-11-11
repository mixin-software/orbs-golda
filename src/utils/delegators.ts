import { Delegator, DelegatorAction } from '@orbs-network/pos-analytics-lib';
import { TFunction } from 'i18next';
import { ChartColors, ChartUnit, ChartYaxis, DelegatorActionsTypes, DelegatorsSections } from '../global/enums';
import { ChartData, MenuOption } from '../global/types';
import { routes } from '../routes/routes';
import moment from 'moment';
import { generateDays, generateMonths, generateWeeks, returnDateNumber } from './dates';
import { STACK_GRAPH_MONTHS_LIMIT } from '../global/variables';
import { convertToString } from './number';
import { chartDatasetObjectComparer } from './chart';
export const generateDelegatorsRoutes = (t: TFunction, address: string): MenuOption[] => {
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
const fillDelegatorsChartData = (dates: Date[]) => {
    return dates.map((date) => {
        return {
            x: moment(date).valueOf(),
            y: null
        };
    });
};
export const getDelegatorChartData = (
    minDate: Date,
    dates: Date[],
    unit: ChartUnit,
    { stake_slices }: Delegator
): ChartData => {
    const moMinDate = moment(minDate);
    let emptydataPoints = fillDelegatorsChartData(dates);
    const points = stake_slices
        .filter((s) => moment.unix(s.block_time) >= moMinDate)
        .map((m) => {
            return {
                x: moment.unix(m.block_time).valueOf(),
                y: m.stake
            };
        })
        .sort(chartDatasetObjectComparer);

    const dataset = {
        data: [...emptydataPoints, ...points],
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
        case DelegatorActionsTypes.RESTAKED:
            return 'green';
        case DelegatorActionsTypes.UNSTAKED:
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
        case DelegatorActionsTypes.RESTAKED:
        case DelegatorActionsTypes.UNSTAKED:
        case DelegatorActionsTypes.WITHDREW:
            return convertToString(currentStake, '0');
        default:
            return convertToString(currentStake, '-');
    }
};

export const generateDelegatorChartData = (unit: ChartUnit, selectedDelegator?: Delegator): ChartData | undefined => {
    if (!selectedDelegator) return;
    let dates, minDate;
    let now = moment();
    switch (unit) {
        case ChartUnit.MONTH:
            minDate = now.subtract(STACK_GRAPH_MONTHS_LIMIT, 'month');
            dates = generateMonths(STACK_GRAPH_MONTHS_LIMIT);
            break;
        case ChartUnit.WEEK:
            minDate = now.subtract(STACK_GRAPH_MONTHS_LIMIT, 'weeks');
            dates = generateWeeks(STACK_GRAPH_MONTHS_LIMIT);
            break;
        case ChartUnit.DAY:
            minDate = now.subtract(STACK_GRAPH_MONTHS_LIMIT, 'days');
            dates = generateDays(STACK_GRAPH_MONTHS_LIMIT);
            break;
        default:
            minDate = now.subtract(STACK_GRAPH_MONTHS_LIMIT, 'week');
            dates = generateWeeks(STACK_GRAPH_MONTHS_LIMIT);
            break;
    }
    if (!dates) return;
    return getDelegatorChartData(minDate.toDate(), dates, unit, selectedDelegator);
};

export const getDelegatorRewardActions = (actions?: DelegatorAction[]) => {
    if (!actions) return [];
    return actions.filter((action: DelegatorAction) => action.event === DelegatorActionsTypes.CLAIMED);
};
