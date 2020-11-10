import React, { useEffect }  from 'react';
import { Route } from 'react-router-dom';
import { routes } from '../../routes/routes';
import { GuardianDelegators } from './sections/guardian-delegators/guardian-delegators';
import { GuardiansStake } from './sections/guardians-stake/guardians-stake';
import { GuardianSectionSelect } from './components/guardian-section-select/guardian-section-select';
import { GuardianRewards } from './sections/guardian-rewards/guardian-rewards';
import { GuardianActions } from './sections/guardian-actions/guardian-actions';
import './guardians.scss';
import { GuardianTop } from './components/guardian-top/guardian-top';

const GuardiansComponent = () => {
  

 

    return (
        <div className="guardians screen">
           <GuardianTop />
            <div className="screen-section">
             <GuardianSectionSelect />
                <div className="screen-section-container">
                    <Route path={routes.guardians.stake} render={() => <GuardiansStake />} />
                    <Route path={routes.guardians.rewards} render={() => <GuardianRewards />} />
                    <Route path={routes.guardians.delegators} render={() => <GuardianDelegators />} />
                    <Route path={routes.guardians.actions} render={() => <GuardianActions />} />
                </div>
            </div>
        </div>
    );
};

export const Guardians = React.memo(GuardiansComponent)