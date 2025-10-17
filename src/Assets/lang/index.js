import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import cn from './cn.json';
import vn from './vn.json';
import en from './en.json';


i18n.use(initReactI18next).init({
    resources:{
        en:{translation: en},
        vi:{translation: vn},
        // cn:{translation: cn},
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;





