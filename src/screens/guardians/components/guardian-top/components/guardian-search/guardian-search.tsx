import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useClickOutside } from 'react-click-outside-hook';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { GuardiansResults } from './guardians-results';
import { RouteParams } from '../../../../../../global/types';
import { setGuardianLoading, getGuardianAction } from '../../../../../../redux/actions/actions';
import { AppState } from '../../../../../../redux/types/types';
import { routes } from '../../../../../../routes/routes';
import { getGuardianName, checkIfLoadDelegator, getGuardianByAddress } from '../../../../../../utils/guardians';
import './guardian-search.scss';

export const GuardianSearch = () => {
    const { guardians, selectedGuardian } = useSelector((state: AppState) => state.guardians);
  

    const dispatch = useDispatch();
    const history: any = useHistory();
    const { t } = useTranslation();
    const [ref, hasClickedOutside] = useClickOutside();
    const [inputValue, setInputValue] = useState<string>('');
    const [showResults, setShowResults] = useState<boolean>(false);
    const params: RouteParams = useParams();
    useEffect(() => {
        const { address } = params;
        searchGuardianByAddress(address);
        
    
    }, []);

 
    useEffect(() => {
        const { address } = params;
        setGuardianNameAsValue(address);
    }, [guardians && guardians.length]);

    useEffect(() => {
        const { address } = params;
        if (hasClickedOutside) {
            setShowResults(false);
            setGuardianNameAsValue(address);
            const guardianName = getGuardianName(guardians, address);
            if (!guardianName) return;
        }
    }, [hasClickedOutside]);

    const searchGuardianByAddress = (address?: string) => {
        const { section } = params;
        if (!address) {
            return dispatch(setGuardianLoading(false));
        }
        const loadGuardian = checkIfLoadDelegator(address, selectedGuardian?.address);
        if (!loadGuardian) return;
        history.push(routes.guardians.main.replace(':section?', section).replace(':address', address));
        dispatch(getGuardianAction(address));
    };

    const selectGuardian = (guardianAddress: string) => {
        setGuardianNameAsValue(guardianAddress);
        setShowResults(false);
        searchGuardianByAddress(guardianAddress);
    };

    const setGuardianNameAsValue = (address?: string) => {
        if (!address) return;
        const guardian = getGuardianByAddress(guardians, address);
        if (!guardian) return;
        const string = `${guardian.name} (${guardian.address})`;
        setInputValue(string);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const value = e.clipboardData.getData('Text');
        searchGuardianByAddress(value);
    };

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputValue) return;
        if (e.key === 'Enter' || e.keyCode === 13) {
            searchGuardianByAddress(inputValue);
        }
    };

    const clear = () => {
        setInputValue('');
        setShowResults(true);
    };

    const generateBtn = () => {
        if (inputValue) {
            return (
                <button type="button" className="search-input-box-btn flex-center" onClick={() => clear()}>
                    <CloseRoundedIcon />
                </button>
            );
        }
        return (
            <button
                type="button"
                className="search-input-box-btn flex-center"
                onClick={() => searchGuardianByAddress(inputValue)}>
                <SearchRoundedIcon />
            </button>
        );
    };

    return (
        <div className="guardian-search search-input flex-column">
            <p className="search-input-title">{t('guardians.selectGuardian')}</p>
            <section className="search-input-box" ref={ref}>
                {generateBtn()}
                <input
                    onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleSubmit(e)}
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                    value={inputValue}
                    onFocus={() => setShowResults(true)}
                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e)}
                    placeholder={t('guardians.inputPlaceholder')}
                />
                {showResults && (
                    <GuardiansResults guardians={guardians} inputValue={inputValue} select={selectGuardian} />
                )}
            </section>
        </div>
    );
};
