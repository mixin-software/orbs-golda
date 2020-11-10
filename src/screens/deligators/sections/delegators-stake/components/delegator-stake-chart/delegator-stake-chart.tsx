import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TimeRangeSelector } from '../../../../../../components/date-format-picker/time-range-selector';
import { LoadingComponent } from '../../../../../../components/loading-component/loading-component';
import { ChartUnit, LoaderType } from '../../../../../../global/enums';
import { setDelegatorChartData } from '../../../../../../redux/actions/actions';
import { AppState } from '../../../../../../redux/types/types';
import { generateDelegatorChartData } from '../../../../../../utils/delegators';
import { Chart } from './chart';
import './delegator-stake-chart.scss';



export const DelegatorStakeChart = () => {
    const dispatch = useDispatch();
    const { selectedDelegator, delegatorIsLoading, delegatorChartData } = useSelector(
        (state: AppState) => state.delegator
    );
    const { t } = useTranslation();
    useEffect(() => {
        if (delegatorChartData) return;
        selectChartData(ChartUnit.WEEK);
    }, [selectedDelegator && selectedDelegator.address]);

    const selectChartData = (unit: ChartUnit) => {
        const data = generateDelegatorChartData(unit, selectedDelegator);
        dispatch(setDelegatorChartData(data));
    };
    const noData = !delegatorIsLoading && !selectedDelegator
    return (
        noData ? null : <div className="delegator-stake-chart">
            <LoadingComponent loaderType={LoaderType.BIG} isLoading={delegatorIsLoading && !delegatorChartData}>
                {delegatorChartData ? (
                    <>
                        <header className="flex-between">
                            <h4>{t('delegators.stakeChangeOverTime')}</h4>
                            <TimeRangeSelector selected={delegatorChartData.unit} selectCallBack={selectChartData} />
                        </header>
                        <div className="line-chart">
                            <Chart chartData={delegatorChartData} />
                        </div>
                    </>
                ) : null}
            </LoadingComponent>
        </div>
    );
};
