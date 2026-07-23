// =========================================
// Boss Tracker V2
// app.js
// =========================================

//==========================================
// IMPORTS
//==========================================

import Engine from "./engine.js";
import Storage from "./storage.js";
import UI from "./ui.js";
import Notifications from "./notifications.js";
import NotificationsUI from "./notificationsUI.js";
import Language from "./language.js";

import { BOSSES } from "./bosses.js";
import { CONFIG } from "./config.js";
import { TRANSLATIONS } from "./translations.js";

//==========================================
// INSTANCIAS
//==========================================

const engine = new Engine();
const storage = new Storage();
const ui = new UI();

const language = new Language();

const notifications =
    new Notifications(language);

const notificationsUI =
    new NotificationsUI(notifications);

//==========================================
// ELEMENTOS HTML
//==========================================

const searchInput =
    document.getElementById("searchInput");

const worldFilter =
    document.getElementById("worldFilter");

const resetButton =
    document.getElementById("btnReset");

const timezoneInfo =
    document.getElementById("timezoneInfo");

const languageSelector =
    document.getElementById("languageSelector");

//==========================================
// ESTADO
//==========================================


let activeBosses = [];
let upcomingBosses = [];
let completedBosses = [];

//==========================================
// CARGAR IDIOMAS
//==========================================

function loadLanguages() {

    languageSelector.innerHTML = "";

    language.getLanguages().forEach(code => {

        const option = document.createElement("option");

        option.value = code;

        option.textContent =
            TRANSLATIONS[code].languageName;

        languageSelector.appendChild(option);

    });

}

//==========================================
// TRADUCCIONES
//==========================================

function applyTranslations() {

    const t = TRANSLATIONS[language.getCurrent()];

    worldFilter.options[0].textContent =
        t.worlds;

    document.querySelector("h2").textContent =
        t.activeBosses;

    document.querySelectorAll("h2")[1].textContent =
        t.upcomingBosses;

    resetButton.textContent =
        t.reset;

    searchInput.placeholder =
        t.search;

    timezoneInfo.textContent =
        `${t.timezone}: ${engine.getUserTimezone()}`;

    languageSelector.value =
        language.getCurrent();

}

//==========================================
// CONFIGURACIÓN INICIAL
//==========================================

storage.cleanOldData();

notificationsUI.init();

timezoneInfo.textContent =
    `${language.t("timezone")}: ${engine.getUserTimezone()}`;

if (Notification.permission === "default") {

    Notification.requestPermission();

}

function updateBosses() {

    activeBosses = [];
    upcomingBosses = [];
    completedBosses = [];

    const search =
        searchInput.value.trim().toLowerCase();

    const world =
        worldFilter.value;

    BOSSES.forEach((boss, index) => {

        // Boss ya derrotado esta semana

        if (storage.isCompleted(boss.id)) {

            completedBosses.push(boss);

            return;

        }

        // Obtener siguiente aparición

        const schedule =
            engine.buildSchedule(boss.schedule);

        const next =
            engine.getNextSpawn(schedule);

        const bossData = {

        ...boss,

        scheduleFull: schedule.map(time =>
            engine.minutesToString(time)
        ),

        order: index,

        nextSpawn: next.nextSpawn,

        nextSpawnValue: next.nextSpawnValue,

        remaining: next.remaining,

        active: next.active,

        lastSpawn: next.lastSpawn,

        lastSpawnValue: next.lastSpawnValue,
};

        // Buscador

        if (
            search &&
            !boss.name.toLowerCase().includes(search)
        ) {

            return;

        }

        // Filtro por mundo

        if (world !== "ALL") {

    switch (world) {

        case "W1":

            if (boss.layer || boss.world !== "W1")
                return;

            break;

        case "W2":

            if (boss.layer || boss.world !== "W2")
                return;

            break;

        case "W3":

            if (boss.world !== "W3")
                return;

            break;

        case "W4":

            if (boss.world !== "W4")
                return;

            break;

        case "W5":

            if (boss.world !== "W5")
                return;

            break;

        case "W6":

            if (boss.world !== "W6")
                return;

            break;

        case "W7":

            if (boss.world !== "W7")
                return;

            break;

        case "W8":

            if (boss.world !== "W8")
                return;

            break;

        case "L1-W1":

            if (!(boss.layer && boss.world === "W1"))
                return;

            break;

        case "L1-W2":

            if (!(boss.layer && boss.world === "W2"))
                return;

            break;

        case "L1-W3":

            if (!(boss.layer && boss.world === "W3"))
                return;

            break;

    }

}

        // Clasificación

        if (bossData.active) {

            activeBosses.push(bossData);

        } else {

            upcomingBosses.push(bossData);

        }

    });

    // Después próximos por tiempo restante

    upcomingBosses.sort((a, b) => {

    // Primero el que aparece antes

    if (a.remaining !== b.remaining) {

        return a.remaining - b.remaining;

    }

    // Si aparecen a la misma hora,
    // mantener el orden de bosses.js

    return a.order - b.order;

});

    completedBosses.sort((a, b) =>

        a.name.localeCompare(b.name)

    );

}

function render() {

    ui.renderActiveBosses(activeBosses);

    ui.renderBosses(upcomingBosses);

    ui.renderCompletedBosses(completedBosses);

}

function refresh() {

    updateBosses();

   notifications.check(

    activeBosses,

    upcomingBosses

);
 render();

}



//==========================================
// BOTÓN X
//==========================================

ui.onBossCompleted((id) => {

    storage.completeBoss(id);

    refresh();

});

//======================================
// BOTÓN RESTAURAR
//======================================

ui.onBossRestore((id) => {

    storage.uncompleteBoss(id);

    refresh();

});

//==========================================
// RESET
//==========================================

resetButton.addEventListener("click", () => {

    if (!confirm(language.t("resetConfirm")))
        return;

    storage.clear();

    refresh();

});

//==========================================
// BUSCADOR
//==========================================

searchInput.addEventListener(

    "input",

    refresh

);

//==========================================
// FILTRO
//==========================================

worldFilter.addEventListener(

    "change",

    refresh

);

//==========================================
// IDIOMA
//==========================================

languageSelector.addEventListener("change", () => {

    language.setLanguage(

        languageSelector.value

    );

    applyTranslations();

    refresh();

});

//==========================================
// INIT
//==========================================

loadLanguages();

applyTranslations();

refresh();

setInterval(refresh,1000);
