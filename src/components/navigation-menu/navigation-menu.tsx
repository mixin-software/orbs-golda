import React, { FunctionComponent as Component, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { generateNavigationLinks, navigationImagesSrcArr } from '../../utils/navigation';
import Logo from '../../assets/images/navbar-logo.svg';
import { NavigationLink, RouteParams } from '../../global/types';
import { Languages } from './components/languages/Languages';

import './navigation-menu.scss';

export const NavigationMenu: Component<any> = () => {
    const { t } = useTranslation();

    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const params: RouteParams = useParams();

    useEffect(() => {
        const { section } = params;
        setSelectedSection(section);
    }, [params.section]);


    useEffect(() => {
       
        navigationImagesSrcArr.forEach((src: string) => {
            const image = new Image()
            image.src = src
        })
      
    }, [])

    return (
        <nav className="navigation flex-column">
            <img src={Logo} alt="" className="navigation-logo" />
            <h4 className="navigation-title">{t('navigation.orbsUniverse')}</h4>
            <h5 className="navigation-sub-title">{t('navigation.analytics')}</h5>
            <ul className="navigation-list flex-column">
                {generateNavigationLinks(t).map(
                    (link: NavigationLink, index: number) => {
                        const { name, image, route, selectedImage } = link;
                        const isSelected = selectedSection === name;
                        const className = isSelected
                            ? 'navigation-list-item navigation-list-item-selected'
                            : 'navigation-list-item';
                        return (
                            <li className={className} key={index}>
                                <Link to={route} className="navigation-list-item-link flex-column">
                                    <img src={ isSelected ?  selectedImage : image} alt={name} />
                                    <p className="capitalize">{name}</p>
                                </Link>
                            </li>
                        );
                    }
                )}
            </ul>
            <Languages />
        </nav>
    );
};
