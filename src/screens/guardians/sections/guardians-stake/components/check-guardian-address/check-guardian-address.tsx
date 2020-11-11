import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AppState } from 'redux/types/types';
import { routes } from 'routes/routes';

interface StateProps {
    addressParam?: string;
}

export const CheckGuardianAddress = ({ addressParam }: StateProps) => {
    const { selectedGuardian } = useSelector((state: AppState) => state.guardians);
    const addressToReplace = selectedGuardian?.address || addressParam || '';
    return (
        <Route exact path={routes.guardians.default}>
            <Redirect to={routes.guardians.stake.replace(':address', addressToReplace)} />
        </Route>
    );
};
