import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/types/types';
import { convertToString } from 'utils/number';
import { useTranslation } from 'react-i18next';
import './guardian-stake-balance.scss';
import { BalanceSection } from 'components/balance-section/balance-section';
import { NoData } from 'components/no-data/no-data';



export const GuardianStakeBalance = () => {
    const { selectedGuardian, guardianIsLoading } = useSelector((state: AppState) => state.guardians);
    const { t } = useTranslation();
    const stake =( selectedGuardian?.stake_status.delegated_stake || 0) + (selectedGuardian?.stake_status.self_stake ||0 )
    const noData = !guardianIsLoading && !selectedGuardian
    return (
        noData ? 
        <NoData />
        :<section className="guardian-stake-balance flex-start">
            <BalanceSection
                data={convertToString(stake)}
                isLoading={guardianIsLoading}
                text={t('main.stake')}
            />
               <BalanceSection
                data={convertToString(selectedGuardian?.stake_status.self_stake)}
                isLoading={guardianIsLoading}
                text={t('guardians.selfStake')}
            />
            <BalanceSection
                data={convertToString(selectedGuardian?.stake_status.cooldown_stake)}
                isLoading={guardianIsLoading}
                text={t('guardians.cooldown')}
            />
            <BalanceSection
                data={convertToString(selectedGuardian?.stake_status.non_stake)}
                isLoading={guardianIsLoading}
                text={t('guardians.nonStakedBalance')}
            />
        </section>
    );
};
