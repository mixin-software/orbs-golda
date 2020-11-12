import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TimeRangeSelector } from 'components/date-format-picker/time-range-selector';
import { LoadingComponent } from 'components/loading-component/loading-component';
import { ChartUnit, LoaderType } from 'global/enums';
import { setGuardianChartData } from 'redux/actions/actions';
import { AppState } from 'redux/types/types';
import { generateGuardiansChartData } from 'utils/guardians';
import { Chart } from './chart';
import './guardian-stake-chart.scss';

export const GuardianStakeChart = () => {
    const dispatch = useDispatch();
    const { selectedGuardian, guardianIsLoading, guardianChartData } = useSelector(
        (state: AppState) => state.guardians
    );
    const { t } = useTranslation();
    useEffect(() => {
        if (!guardianChartData) {
            selectChartData(ChartUnit.WEEK);
        }
    }, [selectedGuardian && selectedGuardian.address]);

    const selectChartData = (unit: ChartUnit) => {
        const data = generateGuardiansChartData(unit, selectedGuardian);
        dispatch(setGuardianChartData(data));
    };
    const noData = !guardianIsLoading && !selectedGuardian;

    return noData ? null : (
        <div className="guardian-stake-chart">
            <LoadingComponent loaderType={LoaderType.BIG} isLoading={!selectedGuardian}>
                {guardianChartData ? (
                    <>
                        <header>
                            <h4>{t('delegators.stakeChangeOverTime')}</h4>
                            <TimeRangeSelector selected={guardianChartData.unit} selectCallBack={selectChartData} />
                        </header>
                        <Chart chartData={guardianChartData} />
                    </>
                ) : null}
            </LoadingComponent>
        </div>
    );
};
