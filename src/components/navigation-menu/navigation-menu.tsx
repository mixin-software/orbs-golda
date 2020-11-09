import React, { FunctionComponent as Component, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { generateNavigationLinks } from '../../utils/navigation';
import Logo from '../../assets/images/navbar-logo.svg';
import { NavigationLink, RouteParams, SupportedLanguage } from '../../global/types';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types/types';
import { Languages } from './components/languages/Languages';

import './navigation-menu.scss';

export const NavigationMenu: Component<any> = () => {
    const { t } = useTranslation();

    const [selectedSection, setSelectedSection] = useState<string | null>(null)
    const {selectedDelegator} = useSelector((state: AppState) => state.delegator);
    const {selectedGuardian} = useSelector((state: AppState) => state.guardians);
    const params: RouteParams = useParams()


    useEffect(() => {
        const {section} = params
        setSelectedSection(section)
    }, [params.section])

 
    return (
        <nav className="navigation flex-column">
            <img src={Logo} alt="" className="navigation-logo" />
            <h4 className="navigation-title">{t('navigation.orbsUniverse')}</h4>
            <h5 className="navigation-sub-title">{t('navigation.analytics')}</h5>
            <ul className="navigation-list flex-column">
                {generateNavigationLinks(t, selectedDelegator, selectedGuardian).map((link: NavigationLink, index: number) => {
               
                    const { name, image, route, selectedImage } = link;
                    const isSelected = selectedSection === name
                    const className = isSelected ? 'navigation-list-item navigation-list-item-selected' : 'navigation-list-item'
                    return (
                       <li className={className}  key = {index}>
                            <Link to={route} className='navigation-list-item-link flex-column'>
                                <img src={isSelected ? selectedImage : image} alt="" />
                                <p className='capitalize'>{name}</p>
                            </Link>
                       </li>
                    );
                })}
            </ul>
            <Languages />
        </nav>
    );
};


