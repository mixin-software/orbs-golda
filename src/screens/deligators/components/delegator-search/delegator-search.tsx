import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { RouteParams } from 'global/types';
import { findDelegatorAction, setDelegatorLoading } from 'redux/actions/actions';
import { AppState } from 'redux/types/types';
import { routes } from 'routes/routes';
import { checkIfLoadDeligator } from 'utils/delegators';
import { useClickOutside } from 'react-click-outside-hook';
import LoupeImg from 'assets/images/loupe.svg';

export const DelegatorSearch = () => {
    const { selectedDelegator, delegatorNotFound } = useSelector((state: AppState) => state.delegator);
    const [ref, hasClickedOutside] = useClickOutside();
    const [inputValue, setInputValue] = useState<string>('');
    const dispatch = useDispatch();
    const history = useHistory();
    const params: RouteParams = useParams();
    const { t } = useTranslation();

    const pushAddressAndFindDelegator = (address: string) => {
        const { section } = params;
        history.push(routes.delegators.main.replace(':section?', section).replace(':address', address));
        findDelegator(address);
    };
    useEffect(() => {
        const { address } = params;
        if (hasClickedOutside) {
            if (!address) return;
            setInputValue(address);
        }
    }, [hasClickedOutside]);

    useEffect(() => {
        const { address } = params;
        if (!address || inputValue) return;
        setInputValue(address);
    }, [params.address]);

    const findDelegator = (address: string) => {
        const LoadDelegator = checkIfLoadDeligator(address, selectedDelegator);
        if (LoadDelegator) {
            dispatch(findDelegatorAction(address));
        }
    };

    useEffect(() => {
        handleOnLoad()
    }, []);

    const handleOnLoad = () => {
        const { address } = params;
        if (!address) {
            return dispatch(setDelegatorLoading(false));
        }
        return findDelegator(address);
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const value = e.clipboardData.getData('Text');
        pushAddressAndFindDelegator(value);
    };

    const submit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputValue) return;
        if (e.key === 'Enter' || e.keyCode === 13) {
            pushAddressAndFindDelegator(inputValue);
        }
    };

    return (
        <div className="delegator-search search-input flex-column">
            <p className="search-input-title">{t('main.address')}</p>
            <section className="search-input-box" ref={ref}>
                <button
                    type="button"
                    className="search-input-box-btn flex-center"
                    onClick={() => pushAddressAndFindDelegator(inputValue)}>
                    <img src={LoupeImg} alt="" />
                </button>
                <input
                    onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => submit(e)}
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    value={inputValue}
                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                    placeholder = {t('delegators.inputPlaceholder')}
                />
            </section>
            {delegatorNotFound && <p className="search-input-not-found">{t('delegators.notFound')}</p>}
        </div>
    );
};
