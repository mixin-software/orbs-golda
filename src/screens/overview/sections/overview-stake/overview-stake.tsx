import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { OverviewStakeGuadians } from 'screens/overview/components/overview-guardians/overview-guardians';
import { BarChartComponent } from 'components/bar-chart/bar-chart';
import { TimeRangeSelector } from 'components/date-format-picker/time-range-selector';
import { LoadingComponent } from 'components/loading-component/loading-component';
import { NoData } from 'components/no-data/no-data';
import { ChartUnit, LoaderType, OverviewChartType } from 'global/enums';
import { setOverviewStakeChartData } from 'redux/actions/actions';
import { AppState } from 'redux/types/types';
import { getStakeChartData } from 'utils/overview/stake-chart';
import './overview-stake.scss';

export const OverviewStake = () => {
    const dispatch = useDispatch();
    const { overviewData, overviewStakeChartData, overviewDataLoding } = useSelector(
        (state: AppState) => state.overview
    );
    const { guardiansColors, guardians } = useSelector((state: AppState) => state.guardians);
    const { t } = useTranslation();

    useEffect(() => {
        if (!overviewStakeChartData) {
            selectChartData(ChartUnit.WEEK);
        }
    }, []);

    const selectChartData = (unit: ChartUnit) => {
        const data = getStakeChartData( unit, overviewData, guardiansColors);
        dispatch(setOverviewStakeChartData(data));
    };
    const noData = !overviewData && !overviewDataLoding;
    return (
        <div className="overview-chart-wrapper flex-between">
            <div className="overview-chart">
                {noData ? (
                    <NoData />
                ) : (
                    <LoadingComponent isLoading={overviewDataLoding} loaderType={LoaderType.BIG}>
                        {overviewStakeChartData && (
                            <header className="flex-between">
                                <h4 className="capitalize">{t('overview.graphText')}</h4>
                                <TimeRangeSelector
                                    selected={overviewStakeChartData.unit}
                                    selectCallBack={selectChartData}
                                    unitsToHide={[ChartUnit.MONTH]}
                                />
                            </header>
                        )}
                        {overviewStakeChartData && (
                            <div className="bar-chart">
                                <BarChartComponent
                                    chartData={overviewStakeChartData}
                                    guardians={guardians}
                                    total={overviewData?.total_stake}
                                    chartType={OverviewChartType.STAKE}
                                />
                            </div>
                        )}
                    </LoadingComponent>
                )}
            </div>
            <OverviewStakeGuadians
                  
                />
        </div>
    );
};
