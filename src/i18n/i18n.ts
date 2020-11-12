import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import isDev from '../config/env';
import { LOCAIZE_API_KEY, LOCAIZE_PROJECT_ID } from '../global/variables';
import Backend from 'i18next-locize-backend';

const locizeOptions = {
    projectId: LOCAIZE_PROJECT_ID,
    apiKey: LOCAIZE_API_KEY,
    referenceLng: 'en-US'
};

i18n.use(initReactI18next)
    .use(Backend)
    .init({
        fallbackLng: 'en-US',
        keySeparator: '.',
        backend: locizeOptions,
        defaultNS: 'all',
        react: {
            useSuspense: true
        },
        interpolation: {
            escapeValue: false
        },
        debug: isDev()
    });

export default i18n;
