// =========================================
// Boss Tracker V2
// language.js
// =========================================

import { TRANSLATIONS } from "./translations.js";

export default class Language {

    constructor() {

        this.storageKey = "BossTrackerLanguage";

        this.current =
            localStorage.getItem(this.storageKey) || "es";

    }

    //==========================================
    // Idioma actual
    //==========================================

    getCurrent() {

        return this.current;

    }

    //==========================================
    // Cambiar idioma
    //==========================================

    setLanguage(lang) {

        if (!TRANSLATIONS[lang])
            return;

        this.current = lang;

        localStorage.setItem(

            this.storageKey,

            lang

        );

    }

    //==========================================
    // Obtener traducción
    //==========================================

    t(key) {

        const language =

            TRANSLATIONS[this.current];

        if (!language)
            return key;

        return language[key] || key;

    }

    //==========================================
    // Obtener idiomas disponibles
    //==========================================

    getLanguages() {

        return Object.keys(TRANSLATIONS);

    }

}