import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/types/types';
import Logo from 'assets/images/token.png';
import { Reward } from 'components/reward/reward';
import { NoData } from 'components/no-data/no-data';
import TrophyImg from 'assets/images/trophy.svg';
import './delegator-rewards-top.scss';
import { ListMaterial } from 'components/list/list-material';

export const DelegatorRewardsTop = () => {
    const { selectedDelegator, delegatorIsLoading } = useSelector((state: AppState) => state.delegator);
    const { t } = useTranslation();
    const titles = [
        '',
        t('main.currentBalance'),
        t('main.alreadyClaimed'),
        `${t('main.totalClaimed')} (${t('main.untilNow')})`
    ];
    const noData = !selectedDelegator && !delegatorIsLoading;
    return noData ? (
        <NoData />
    ) : (
        <div className="delegator-rewards-top">
            <ListMaterial titles={titles} titleClassName='reward-title' listClassName='rewards-list'>
                <Reward
                    current={selectedDelegator?.rewards_balance}
                    claimed={selectedDelegator?.rewards_claimed}
                    img={TrophyImg}
                    token={Logo}
                    title={t('main.rewards')}
                    isLoading={delegatorIsLoading}
                />
            </ListMaterial>
        </div>
    );
};
