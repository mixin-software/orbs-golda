import { TFunction } from 'i18next';
import { ChartData, GuardiansChartDatasets, MenuOption } from '../global/types';
import { routes } from '../routes/routes';
import { ChartColors, ChartUnit, ChartYaxis, GuardianActionsTypes, GuardiansSections } from '../global/enums';
import { Guardian, GuardianAction, GuardianInfo, GuardianStake } from '@orbs-network/pos-analytics-lib';
import {
    converFromNumberToDateMilliseconds,
    generateDays,
    generateMonths,
    generateWeeks,
    returnDateNumber
} from './dates';
import { STACK_GRAPH_MONTHS_LIMIT } from '../global/variables';
import moment from 'moment';
import DAItoken from '../assets/images/bootstrap-token.png';
import { convertToString } from './number';

export const generateGuardiansRoutes = (t: TFunction, guardian?: GuardianInfo): MenuOption[] => {
    const address = guardian ? guardian.address : '';
    return [
        {
            name: t('main.stake'),
            route: routes.guardians.stake.replace(':address', address),
            key: GuardiansSections.STAKE
        },
        {
            name: t('main.rewards'),
            route: routes.guardians.rewards.replace(':address', address),
            key: GuardiansSections.REWARDS
        },
        {
            name: t('main.delegetors'),
            route: routes.guardians.delegators.replace(':address', address),
            key: GuardiansSections.DELEGATORS
        },
        {
            name: t('main.actions'),
            route: routes.guardians.actions.replace(':address', address),
            key: GuardiansSections.ACTIONS
        }
    ];
};

export const checkIfLoadDelegator = (address?: string, selectedGuardianAddress?: string): boolean => {
    if (!address) return false;
    if (selectedGuardianAddress && address.indexOf(selectedGuardianAddress) > -1) return false;
    return true;
};

const generateGuardianDatasets = (): GuardiansChartDatasets => {
    return {
        selfStake: {
            data: [],
            color: ChartColors.SELF_STAKE,
            yAxis: ChartYaxis.Y2
        },
        delegatedStake: {
            data: [],
            color: ChartColors.TOTAL_STAKE,
            yAxis: ChartYaxis.Y2
        },
        delegators: {
            data: [],
            color: ChartColors.DELEGATORS,
            yAxis: ChartYaxis.Y1
        }
    };
};

const fillGuardiansChartData = (chartData: any, dates: any, unit: ChartUnit) => {
    Object.keys(dates).forEach((key: string) => {
        const date = converFromNumberToDateMilliseconds(Number(key), unit);
        chartData = insertChartDataByType(chartData, date);
    });
    return chartData;
};
export const getGuardianChartData = (dates: any, unit: ChartUnit, guardian: GuardianInfo): ChartData => {
    let chartData = generateGuardianDatasets();
    const { stake_slices } = guardian;

    stake_slices.map((slice: GuardianStake) => {
        const { block_time, self_stake, delegated_stake, n_delegates } = slice;
        const blockDateNumber = returnDateNumber(block_time, unit);
        if (!dates.hasOwnProperty(blockDateNumber)) return;
        const date = moment.unix(block_time).valueOf();
        chartData = insertChartDataByType(chartData, date, self_stake, n_delegates, delegated_stake);
    });
    chartData = fillGuardiansChartData(chartData, dates, unit);
    const formatted = formatGuardianChartData(chartData, unit);
    return formatted;
};

export const formatGuardianChartData = (data: any, unit: ChartUnit) => {
    let datasetsArr: any = [];
    Object.keys(data).map(function (key) {
        const dataset = data[key];
        datasetsArr.push(dataset);
    });

    const obj = {
        datasets: datasetsArr,
        unit
    };
    return obj;
};

const insertChartDataByType = (
    chartData: any,
    date: number,
    self_stake?: number,
    n_delegates?: number,
    delegated_stake?: number
): any => {
    const x = date;
    const selftStake = {
        x,
        y: self_stake
    };
    const delegators = {
        x,
        y: n_delegates
    };
    const delegatedStake = {
        x,
        y: delegated_stake
    };
    chartData.selfStake.data.push(selftStake);
    chartData.delegators.data.push(delegators);
    chartData.delegatedStake.data.push(delegatedStake);
    return chartData;
};

export const generateGuardiansChartData = (unit: ChartUnit, selectedGuardian?: GuardianInfo) => {
    if (!selectedGuardian) return;
    let dates;
    switch (unit) {
        case ChartUnit.MONTH:
            dates = generateMonths(STACK_GRAPH_MONTHS_LIMIT);
            break;
        case ChartUnit.WEEK:
            dates = generateWeeks(STACK_GRAPH_MONTHS_LIMIT);
            break;
        case ChartUnit.DAY:
            dates = generateDays(STACK_GRAPH_MONTHS_LIMIT);
            break;
        default:
            break;
    }
    const data = getGuardianChartData(dates, unit, selectedGuardian);
    return data;
};

export const getGuardianByAddress = (guardians?: Guardian[], address?: string): Guardian | undefined => {
    if (!guardians || !address) return;
    const guardian = guardians.filter((g: Guardian) => {
        return g.address.toLowerCase() === address.toLowerCase();
    })[0];

    return guardian;
};

export const getGuardianByName = (guardians?: Guardian[], name?: string): string | undefined => {
    if (!guardians || !name) return;
    const guardian = guardians.filter((g: Guardian) => {
        return g.name === name;
    })[0];
    return guardian.address;
};

export const filterGuardians = (list: Guardian[], value: string) => {
    if (!value || !list) return list || [];
    const filtered = list.filter((guardian: Guardian) => {
        const { name, address } = guardian;
        const string = `${name} ${address}`;
        return string.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });
    return filtered || [];
};

export const getGuardiansRewardActions = (actions?: GuardianAction[]) => {
    const arr = [
        GuardianActionsTypes.CLAIM_GUARDIAN_REWARDS,
        GuardianActionsTypes.DELEGATOR_STAKING_REWARDS_CLAIMED,
        GuardianActionsTypes.BOOTSTRAP_REWARDS_WITHDREW,
        GuardianActionsTypes.FEES_WITHDRAWN
    ];
    if (!actions) return [];
    return actions.filter((action: GuardianAction) => {
        const { event } = action;
        if (arr.includes(event as GuardianActionsTypes)) {
            return actions;
        }
    });
};

export const generateGuardiansActionColors = (type: GuardianActionsTypes) => {
    switch (type) {
        case GuardianActionsTypes.STAKED:
            return 'green';
        case GuardianActionsTypes.RESTAKED:
            return 'green';
        case GuardianActionsTypes.UNSTAKED:
            return 'red';
        case GuardianActionsTypes.WITHDREW:
            return 'red';
        case GuardianActionsTypes.CLAIM_GUARDIAN_REWARDS:
            return 'black';
        case GuardianActionsTypes.DELEGATOR_STAKING_REWARDS_CLAIMED:
            return 'black';
        case GuardianActionsTypes.BOOTSTRAP_REWARDS_WITHDREW:
            return 'black';
        case GuardianActionsTypes.FEES_WITHDRAWN:
            return 'black';
        default:
            break;
    }
};

export const generateGuardiansCurrentStake = (event: GuardianActionsTypes, currentStake?: number) => {
    switch (event) {
        case GuardianActionsTypes.STAKED:
            return convertToString(currentStake, '0');
        case GuardianActionsTypes.RESTAKED:
            return convertToString(currentStake, '0');
        case GuardianActionsTypes.UNSTAKED:
            return convertToString(currentStake, '0');
        case GuardianActionsTypes.WITHDREW:
            return convertToString(currentStake, '0');
        default:
            return '-';
    }
};

export const generateGuardiansActionIcon = (event: GuardianActionsTypes) => {
    switch (event) {
        case GuardianActionsTypes.BOOTSTRAP_REWARDS_WITHDREW:
            return DAItoken;
        default:
            break;
    }
};

export const getGuardianName = (guardians?: Guardian[], address?: string): string | null => {
    if (!address) return null;
    const guardian = getGuardianByAddress(guardians, address);
    if (!guardian) return null;
    return `${guardian.name} (${guardian.address})`;
};
