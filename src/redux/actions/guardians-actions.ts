import { Guardian } from '@orbs-network/pos-analytics-lib';
import { getGuardianColor } from 'utils/overview/overview';
import { ChartData } from '../../global/types';
import { api } from '../../services/api';
import { types } from '../types/types';

export const getGuardianAction = (address: string) => async (dispatch: any) => {
    dispatch(resetguardian());
    const guardian = await api.getGuardianApi(address);
    dispatch(setGuardianLoading(false));
    if (!guardian) {
        return dispatch(setGuardianNotFound(true));
    }
    dispatch({
        type: types.GUARDIAN.SET_GUARDIAN,
        payload: guardian
    });
};

export const getGuardiansAction = () => async (dispatch: any) => {
    const guardians = await api.getGuardiansApi();
    if (!guardians) return null;
    const guardiansColors: { [id: string]: string } = {};
    guardians
        .sort((a, b) => b.effective_stake - a.effective_stake)
        .forEach((guardian: Guardian, index: number) => {
            guardiansColors[guardian.address] = getGuardianColor(index);
        });
    return dispatch({
        type: types.GUARDIAN.SET_GUARDIANS,
        payload: { guardians, guardiansColors }
    });
};

export const setGuardianLoading = (value: boolean) => async (dispatch: any) => {
    return dispatch({
        type: types.GUARDIAN.GUARDIAN_LOADING,
        payload: value
    });
};

export const setGuardianNotFound = (value: boolean) => async (dispatch: any) => {
    return dispatch({
        type: types.GUARDIAN.GUARDIAN_NOT_FOUND,
        payload: value
    });
};

export const setGuardianChartData = (chartData: ChartData | undefined) => async (dispatch: any) => {
    return dispatch({
        type: types.GUARDIAN.SET_GUARDIAN_CHART_DATA,
        payload: chartData
    });
};

export const resetguardian = () => async (dispatch: any) => {
    return dispatch({
        type: types.GUARDIAN.RESET_GUARDIAN
    });
};
