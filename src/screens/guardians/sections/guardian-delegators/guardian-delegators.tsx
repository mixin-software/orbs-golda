import React from 'react';
import {  GuardianDelegator } from '@orbs-network/pos-analytics-lib';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../redux/types/types';
import { NoData } from '../../../../components/no-data/no-data';
import './guardian-delegators.scss';
import { GuardianDelegatorElement } from './components/guardian-delegator/guardian-delegator';
import { useTranslation } from 'react-i18next';
import { LoadingComponent } from '../../../../components/loading-component/loading-component';
import { ListMaterial } from '../../../../components/list/list-material';
import { LoaderType } from '../../../../global/enums';

export const GuardianDelegators = () => {
    const { selectedGuardian, guardianIsLoading } = useSelector((state: AppState) => state.guardians);
    const { t } = useTranslation();
    const titles = [t('guardians.delegatorsAddress'), t('guardians.stake'), t('guardians.nonStakedBalance')];
    const noData = !guardianIsLoading && !selectedGuardian;

    return noData ? (
        <NoData />
    ) : (
        <div className="guardian-delegators-list">
            <LoadingComponent isLoading={guardianIsLoading} listElementAmount={5} loaderType={LoaderType.LIST}>
                <ListMaterial titles={titles} titleClassName="list-titles" listHeaderBg="#F7F7F7">
                    {selectedGuardian && selectedGuardian.delegators.map((delegator: GuardianDelegator) => {
                            return <GuardianDelegatorElement delegator={delegator} key={delegator.address} />;
                        })}
                </ListMaterial>
            </LoadingComponent>
        </div>
    );
};
