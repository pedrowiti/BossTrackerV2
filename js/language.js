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

    t(key, variables = {}) {

    const language = TRANSLATIONS[this.current];

    if (!language)
        return key;

    let text = language[key] || key;

    Object.entries(variables).forEach(([name, value]) => {

        text = text.replaceAll(`{{${name}}}`, value);

    });

    return text;

}

    //==========================================
    // Obtener idiomas disponibles
    //==========================================

    getLanguages() {

        return Object.keys(TRANSLATIONS);

    }

}