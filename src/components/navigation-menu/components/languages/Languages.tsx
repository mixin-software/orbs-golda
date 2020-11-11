import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '../../../../global/types';
import { api } from '../../../../services/api';
import { flags } from '../../../../ui/country-flags';
import Logo from '../../../../assets/images/logo orbs.svg';

export const Languages = () => {
    const { i18n } = useTranslation();
    const [supportedlanguages, setSupportedLanguages] = useState<undefined | { [id: string]: SupportedLanguage }>(
        undefined
    );

    useEffect(() => {
        getLanguages();
    }, []);

    const getLanguages = async () => {
        const res = await api.getSupportedlanguages();
        if (!res) return;
        setSupportedLanguages(res);
    };

    const generateSupportedlanguages = (languages?: { [id: string]: SupportedLanguage }) => {
        if (!languages) return;
        return Object.keys(languages).map(function (key: string, index: number) {
            const flagsObject: any = flags;
            const src = flagsObject[key];
            const name = languages[key].name;
            return (
                <li key={index} onClick={() => changeLang(key)}>
                    <img src={src} alt={name} />
                </li>
            );
        });
    };

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return <div className="navigation-languages flex-column">
        <figure className='navigation-languages-logo'>
            <img src={Logo} alt="orbs logo"/>
        </figure>
        <ul className='flex-start'>
        {generateSupportedlanguages(supportedlanguages)}
        </ul>
    </div>;
};
