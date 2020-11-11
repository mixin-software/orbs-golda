import { TFunction } from 'i18next';
import { ChartData, GuardiansChartDatasets, MenuOption } from '../global/types';
import { routes } from '../routes/routes';
import {
    ChartColors,
    ChartUnit,
    ChartYaxis,
    GuardianActionsTypes,
    GuardianChartName,
    GuardiansSections
} from '../global/enums';
import { Guardian, GuardianAction, GuardianInfo, GuardianStake } from '@orbs-network/pos-analytics-lib';
import { generateDays, generateMonths, generateWeeks } from './dates';
import { STACK_GRAPH_MONTHS_LIMIT } from '../global/variables';
import moment from 'moment';
import DAItoken from '../assets/images/bootstrap-token.png';
import { convertToString } from './number';

export const generateGuardiansRoutes = (t: TFunction, address: string): MenuOption[] => {
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

const generateDatasets = (dates: Date[]): GuardiansChartDatasets => {
    const data = fillChartData(dates);
    return {
        self_stake: {
            data,
            color: ChartColors.SELF_STAKE,
            yAxis: ChartYaxis.Y2
        },
        delegated_stake: {
            data: [],
            color: ChartColors.TOTAL_STAKE,
            yAxis: ChartYaxis.Y2
        },
        n_delegates: {
            data: [],
            color: ChartColors.DELEGATORS,
            yAxis: ChartYaxis.Y1
        }
    };
};

export const getGuardianChartData = (
    minDate: Date,
    dates: Date[],
    unit: ChartUnit,
    { stake_slices }: GuardianInfo
): ChartData => {
    const moMinDate = moment(minDate);
    let datasets = generateDatasets(dates);
    stake_slices
        .filter((s) => moment.unix(s.block_time) >= moMinDate)
        .sort((s1, s2) => (s1.block_time > s2.block_time ? 0 : s1.block_time > s2.block_time ? 1 : -1))
        .forEach((m) => {
            insertChartDataByType(datasets, m, moment.unix(m.block_time).valueOf());
        });

    return {
        datasets: [datasets.delegated_stake, datasets.n_delegates, datasets.self_stake],
        unit
    };
};

const insertChartDataByType = (chartData: GuardiansChartDatasets, stake: GuardianStake, date: number): any => {
    const { self_stake, n_delegates, delegated_stake } = stake;
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
    chartData.self_stake.data.push(selftStake);
    chartData.n_delegates.data.push(delegators);
    chartData.delegated_stake.data.push(delegatedStake);
};

const fillChartData = (dates: Date[]) => {
    return dates.map((date) => {
        return {
            x: moment(date).valueOf(),
            y: null
        };
    });
};

export const generateGuardiansChartData = (unit: ChartUnit, selectedGuardian?: GuardianInfo): ChartData | undefined => {
    if (!selectedGuardian) return;
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
    return getGuardianChartData(minDate.toDate(), dates, unit, selectedGuardian);
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
        case GuardianActionsTypes.RESTAKED:
            return 'green';
        case GuardianActionsTypes.UNSTAKED:
        case GuardianActionsTypes.WITHDREW:
            return 'red';
        case GuardianActionsTypes.CLAIM_GUARDIAN_REWARDS:
        case GuardianActionsTypes.DELEGATOR_STAKING_REWARDS_CLAIMED:
        case GuardianActionsTypes.BOOTSTRAP_REWARDS_WITHDREW:
        case GuardianActionsTypes.FEES_WITHDRAWN:
            return 'black';
        default:
            break;
    }
};

export const generateGuardiansCurrentStake = (event: GuardianActionsTypes, currentStake?: number) => {
    switch (event) {
        case GuardianActionsTypes.STAKED:
        case GuardianActionsTypes.RESTAKED:
        case GuardianActionsTypes.UNSTAKED:
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
