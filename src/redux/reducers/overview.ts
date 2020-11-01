import { OverviewState } from '../types/overview-types';
import { types } from '../types/types';

const initialState: OverviewState = {
    overviewData: undefined,
    overviewChartData: undefined,
    overviewDataLoding: true
};

export const overviewReducer = (state = initialState, { payload, type }: any): OverviewState => {
    switch (type) {
        case types.OVERVIEW.SET_OVERVIEW:
            return {
                ...state,
                overviewData: payload,
                overviewDataLoding: false
            };
        case types.OVERVIEW.SET_CHART_DATA:
            return {
                ...state,
                overviewChartData: payload
            };

        default:
            return state;
    }
};
