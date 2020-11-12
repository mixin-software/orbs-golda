import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LoadingComponent } from 'components/loading-component/loading-component';
import { LoaderType } from 'global/enums';
import { AppState } from 'redux/types/types';
import { getGuardianByAddress } from 'utils/guardians';
import { convertToString } from 'utils/number';
import { routeToGuardian } from 'utils/routing';
import { useTranslation } from 'react-i18next';
import './delegators-stake-balance.scss';
import { BalanceSection } from 'components/balance-section/balance-section';
import { NoData } from 'components/no-data/no-data';


export const DelegatorsStakeBalance = () => {
    const { selectedDelegator, delegatorIsLoading } = useSelector((state: AppState) => state.delegator);
    const { guardians } = useSelector((state: AppState) => state.guardians);
    const { t } = useTranslation();
    const delegatedTo = getGuardianByAddress(guardians, selectedDelegator?.delegated_to)?.name;
    const noData  = !selectedDelegator && !delegatorIsLoading
    return (
        noData ? <NoData  /> : <section className="delegators-stake-balance flex-start">
            <BalanceSection
                data={convertToString(selectedDelegator?.total_stake)}
                isLoading={delegatorIsLoading}
                text={t('main.stake')}
            />
            <BalanceSection
                data={convertToString(selectedDelegator?.cooldown_stake)}
                isLoading={delegatorIsLoading}
                text={t('delegators.cooldown')}
            />
            <BalanceSection
                data={convertToString(selectedDelegator?.non_stake)}
                isLoading={delegatorIsLoading}
                text={t('delegators.nonStakedBalance')}
            />
            <div className="delegators-stake-balance-section flex-column text-overflow">
                <h4>{t('delegators.delegatedTo')}</h4>
                <LoadingComponent loaderType={LoaderType.TEXT} isLoading={delegatorIsLoading} >
                  {delegatedTo ?   <Link to={routeToGuardian(selectedDelegator?.delegated_to)}>
                        <p className="text-overflow delegators-stake-balance-to">{delegatedTo}</p>
                        <p className="text-overflow delegators-stake-balance-address">
                            {selectedDelegator?.delegated_to}
                        </p>
                    </Link> :  <p className="delegators-stake-balance-bold">-</p>}
                </LoadingComponent>
            </div>
        </section>
    );
};
