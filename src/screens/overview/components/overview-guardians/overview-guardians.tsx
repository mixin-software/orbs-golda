import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../../../redux/types/types';
import { routes } from '../../../../routes/routes';
import { getGuardianColor } from '../../../../utils/overview/overview';
import CopyImg from '../../../../assets/images/copy.svg';
import { LoadingComponent } from '../../../../components/loading-component/loading-component';
import { LoaderType } from '../../../../global/enums';

import './overview-guardians.scss';
import { useTranslation } from 'react-i18next';
import { PosOverview } from '@orbs-network/pos-analytics-lib';
import { sortByNumber } from '../../../../utils/array';

const listToRender = (overviewData?: PosOverview) => {
    if (!overviewData) return null;
    if (!overviewData.slices) return null;
    if (!overviewData.slices[0]) return null;
    if (!overviewData.slices[0].data) return null;
    const data = sortByNumber(overviewData.slices[0].data, 'effective_stake')
    return data
};

export const OverviewStakeGuadians = () => {
    const { overviewData, overviewDataLoding } = useSelector((state: AppState) => state.overview);
    const { t } = useTranslation();
    const list = listToRender(overviewData)
    const noData = !overviewData && !overviewDataLoding
    return  noData ? null : (
        <div className="overview-guardians">
           
            <LoadingComponent isLoading={!overviewData} loaderType={LoaderType.LIST} listElementAmount={6}>
            <header className="flex-start">{t('overview.guardianList')}</header>
                <ul className="overview-guardians-list">
                    {list && list.length > 0 && list.map((guardian: any, index: number) => {
                        const colors = getGuardianColor(list.length);
                        const background = colors[index];
                        return (
                            <li key={index}>
                                <Link
                                    to={routes.guardians.stake.replace(':address', guardian.address)}
                                    className="flex-start-center">
                                    <figure
                                        style={{
                                            background
                                        }}></figure>
                                    <p className="text-overflow">{guardian.name}</p>
                                    <img src={CopyImg} alt="" />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </LoadingComponent>
        </div>
    );
};
