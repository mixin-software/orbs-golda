import { TFunction } from 'i18next';
import { routes } from '../routes/routes';
import { NavigationLink } from '../global/types';
import overviewImg from '../assets/images/navigation/overview.svg';
import overviewSelectedImg from '../assets/images/navigation/overview-selected.svg';
import guardiansImg from '../assets/images/navigation/guardians.svg';
import guardiansSelectedImg from '../assets/images/navigation/guardians-selected.svg';
import delegatorsImg from '../assets/images/navigation/delegators.svg';
import delegatorsSelectedImg from '../assets/images/navigation/delegators-selected.svg';

export const navigationImagesSrcArr = [
    overviewImg,
    overviewSelectedImg,
    guardiansImg,
    guardiansSelectedImg,
    delegatorsImg,
    delegatorsSelectedImg
];

export const generateNavigationLinks = (t: TFunction): NavigationLink[] => {
    return [
        {
            name: t('navigation.overview'),
            route: routes.overview.default,
            image: overviewImg,
            selectedImage: overviewSelectedImg
        },
        {
            name: t('navigation.guardians'),
            route: routes.guardians.default,
            image: guardiansImg,
            selectedImage: guardiansSelectedImg
        },
        {
            name: t('navigation.delegators'),
            route: routes.delegators.default,
            image: delegatorsImg,
            selectedImage: delegatorsSelectedImg
        }
    ];
};
