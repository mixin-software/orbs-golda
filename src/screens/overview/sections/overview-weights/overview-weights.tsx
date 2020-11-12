import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { OverviewStakeGuadians } from 'screens/overview/components/overview-guardians/overview-guardians';
import { BarChartComponent } from 'components/bar-chart/bar-chart';
import { TimeRangeSelector } from 'components/date-format-picker/time-range-selector';
import { LoadingComponent } from 'components/loading-component/loading-component';
import { NoData } from 'components/no-data/no-data';
import { ChartUnit, LoaderType, OverviewChartType } from 'global/enums';
import { setOverviewWeightsChartData } from 'redux/actions/actions';
import { AppState } from 'redux/types/types';
import { getWeightsChartData } from 'utils/overview/weights-chart';
import './overview-weights.scss';

export const OverviewWeights = () => {
    const dispatch = useDispatch();
    const { overviewData, overviewWeightsChartData, overviewDataLoding } = useSelector(
        (state: AppState) => state.overview
    );
    const { guardians, guardiansColors } = useSelector((state: AppState) => state.guardians);
    const { t } = useTranslation();

    useEffect(() => {
        if (overviewWeightsChartData) return;
        selectChartData(ChartUnit.WEEK);
    }, []);

    const selectChartData = (unit: ChartUnit) => {
        if (!guardians) return;
        const data = getWeightsChartData(unit, overviewData, guardiansColors);
        dispatch(setOverviewWeightsChartData(data));
    };
    const noData = !overviewData && !overviewDataLoding;

    return (
        <div className="overview-chart-wrapper flex-between">
            <div className="overview-chart">
                {noData ? (
                    <NoData />
                ) : (
                    <LoadingComponent isLoading={overviewDataLoding} loaderType={LoaderType.BIG}>
                        {overviewWeightsChartData && (
                            <header className="flex-between">
                                <h4 className="capitalize">{t('overview.graphText')}</h4>
                                <TimeRangeSelector
                                    selected={overviewWeightsChartData.unit}
                                    selectCallBack={selectChartData}
                                    unitsToHide={[ChartUnit.MONTH]}
                                />
                            </header>
                        )}
                        {overviewWeightsChartData && (
                            <div className="bar-chart">
                                <BarChartComponent
                                    chartData={overviewWeightsChartData}
                                    guardians={guardians}
                                    total={overviewData?.total_stake}
                                    chartType={OverviewChartType.WEIGHTS}
                                />
                            </div>
                        )}
                    </LoadingComponent>
                )}
            </div>
            <OverviewStakeGuadians />
        </div>
    );
};
