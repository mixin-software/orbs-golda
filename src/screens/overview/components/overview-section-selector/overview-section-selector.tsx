import React from 'react'
import { useTranslation } from 'react-i18next';
import { SectionMenu } from 'components/section-menu/section-menu';
import { generateOverviewRoutes } from 'utils/overview/overview';

export const OverviewSectionSelector = () => {
    const { t } = useTranslation();
    return <SectionMenu options={generateOverviewRoutes(t,)} />

}

