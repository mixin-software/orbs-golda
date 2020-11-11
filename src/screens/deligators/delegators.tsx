import React from 'react';
import { routes } from '../../routes/routes';
import {  Route, useParams } from 'react-router-dom';
import { DeligatorsActions } from './sections/delegators-actions/delegators-actions';
import { DelegatorsStake } from './sections/delegators-stake/delegators-stake';
import { DelegatorSearch } from './components/delegator-search/delegator-search';
import { DelegatorReward } from './sections/delegators-reward/delegator-reward';
import { RouteParams } from '../../global/types';
import { generateDelegatorsRoutes } from '../../utils/delegators';
import { useTranslation } from 'react-i18next';
import { SectionMenu } from '../../components/section-menu/section-menu';
import './delegators.scss';
import { CheckDelegatorAddress } from './sections/delegators-stake/components/check-delegator-address/check-delegator-address';

const DelegatorsComponent = () => {
    const params: RouteParams = useParams();
    const { address } = params;
    const { t } = useTranslation();
    return (
        <div className="delegators screen">
            <DelegatorSearch />
            <div className="screen-section">
                <SectionMenu options={generateDelegatorsRoutes(t, address || '')} />
                <div className="screen-section-container">
                    <Route path={routes.delegators.stake} render={() => <DelegatorsStake />} />
                    <Route path={routes.delegators.rewards} render={() => <DelegatorReward />} />
                    <Route path={routes.delegators.actions} render={() => <DeligatorsActions />} />
                    <CheckDelegatorAddress addressParam = {address} />
                </div>
            </div>
        </div>
    );
};

export const Delegators = React.memo(DelegatorsComponent);
