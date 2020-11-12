import { GuardiansState } from '../types/guardians-types';
import { types } from '../types/types';

const initialState: GuardiansState = {
    selectedGuardian: undefined,
    guardians: undefined,
    guardianNotFound: false,
    guardianIsLoading: true,
    guardianChartData: undefined,
    guardiansColors: undefined
};

export const guardiansReducer = (state = initialState, { payload, type }: any): GuardiansState => {
    switch (type) {
        case types.GUARDIAN.SET_GUARDIAN:
            return {
                ...state,
                selectedGuardian: payload
            };
        case types.GUARDIAN.SET_GUARDIANS:
            const { guardiansColors, guardians } = payload;
            return {
                ...state,
                guardians,
                guardiansColors
            };
        case types.GUARDIAN.GUARDIAN_NOT_FOUND:
            return {
                ...state,
                guardianNotFound: payload
            };
        case types.GUARDIAN.GUARDIAN_LOADING:
            return {
                ...state,
                guardianIsLoading: payload
            };
        case types.GUARDIAN.SET_GUARDIAN_CHART_DATA:
            return {
                ...state,
                guardianChartData: payload
            };
        case types.GUARDIAN.RESET_GUARDIAN:
            return {
                ...state,
                guardianChartData: undefined,
                selectedGuardian: undefined,
                guardianNotFound: false,
                guardianIsLoading: true
            };
        default:
            return state;
    }
};
