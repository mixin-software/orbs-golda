import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../../../redux/types/types';
import Logo from '../../../../../../assets/images/token.png';
import { Reward } from '../../../../../../components/reward/reward';
import { NoData } from '../../../../../../components/no-data/no-data';
import TrophyImg from '../../../../../../assets/images/trophy.svg';
import { RewardTitles } from '../../../../../../components/reward-titles/reward-titles';
import './delegator-rewards-top.scss';

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

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Bla</th>
                        <th>Bla 2</th>
                        <th>ZB Balibi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>a</td>
                        <td>Bla</td>
                        <td>Bla 2</td>
                        <td>ZB Balibi</td>
                    </tr>
                    <tr>
                        <td>a</td>
                        <td>Bla</td>
                        <td>Bla 2</td>
                        <td>ZB Balibi</td>
                    </tr>
                </tbody>
            </table>

            <RewardTitles titles={titles} isLoading={delegatorIsLoading} listElementAmount={4} />
            <div className="delegator-rewards-top-details">
                <Reward
                    current={selectedDelegator?.rewards_balance}
                    claimed={selectedDelegator?.rewards_claimed}
                    img={TrophyImg}
                    token={Logo}
                    title={t('main.rewards')}
                    isLoading={delegatorIsLoading}
                />
            </div>
        </div>
    );
};
