import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LoadingComponent } from 'components/loading-component/loading-component';
import { LoaderType } from 'global/enums';
import { AppState } from 'redux/types/types';
import LinkImg from 'assets/images/copy.svg';
import './guardian-info.scss';

export const GuardianInfo = () => {
    const { selectedGuardian, guardianIsLoading } = useSelector((state: AppState) => state.guardians);
    const { t } = useTranslation();

    const website = selectedGuardian?.details.website;
    const detailsUrl = selectedGuardian?.details.details_URL;
    const ip = selectedGuardian?.details.ip;
    const nodeAddress = selectedGuardian?.details.node_address;
    return (
        <div className="guardian-info flex-start">
          

             <div className='guardian-info-container'>
           <section>
                <h5 className="guardian-info-title">{t('guardians.guardianWebsite')}</h5>
                <LoadingComponent isLoading={guardianIsLoading} loaderType={LoaderType.TEXT}>
                   {website ?  <a href={`${website}`} target="_blank" rel="noopener noreferrer">
                        <p> {website}</p>
                    </a> : <p>-</p>}
                </LoadingComponent>
            </section>
            <section>
                <h5 className="guardian-info-title">{t('guardians.guardianDetailsUrl')}</h5>
                <LoadingComponent isLoading={guardianIsLoading} loaderType={LoaderType.TEXT}>
                    {detailsUrl ? (
                        <a href={detailsUrl} target="_blank" rel="noopener noreferrer">
                            <p>{detailsUrl}</p>
                        </a>
                    ) : (
                        <p>-</p>
                    )}
                </LoadingComponent>
            </section>
           </div>
          <div className='guardian-info-container'>
          <section>
                <h5 className="guardian-info-title">{t('guardians.nodeIP')}</h5>
                <LoadingComponent isLoading={guardianIsLoading} loaderType={LoaderType.TEXT}>
                    <p>{ip || '-'}</p>
                </LoadingComponent>
            </section>
            <section>
                <h5 className="guardian-info-title">{t('guardians.nodeAddress')}</h5>
                <LoadingComponent isLoading={guardianIsLoading} loaderType={LoaderType.TEXT}>
                   {nodeAddress ?  <div className="flex-start-center">
                        <p>{nodeAddress}</p>
                        <img src={LinkImg} />
                    </div> : <p>-</p>}
                </LoadingComponent>
            </section>
          </div> 
        </div>
    );
};
