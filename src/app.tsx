import React, { FunctionComponent as Component, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getGuardiansAction, getOverviewAction } from './redux/actions/actions';
import { RootRouter } from './routes';
import './scss/app.scss';

const App: Component = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getGuardiansAction());
    }, []);

    return (
        <div className="app flex-between">
            <RootRouter />
        </div>
    );
};

export default App;
