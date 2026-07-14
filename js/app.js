// =========================================
// Boss Tracker V2
// app.js
// =========================================

import Engine from "./engine.js";
import Storage from "./storage.js";
import UI from "./ui.js";
import { BOSSES } from "./bosses.js";
import { CONFIG } from "./config.js";

const engine = new Engine();
const storage = new Storage();
const ui = new UI();

const searchInput = document.getElementById("searchInput");
const worldFilter = document.getElementById("worldFilter");
const resetButton = document.getElementById("btnReset");
const timezoneInfo = document.getElementById("timezoneInfo");

let activeBosses = [];
let upcomingBosses = [];
let completedBosses = [];

//==========================================
// NOTIFICACIONES
//==========================================

const notified = new Set();

storage.cleanOldData();

timezoneInfo.textContent =
    "Zona horaria: " + engine.getUserTimezone();
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

    BOSSES.forEach(boss => {

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

        nextSpawn: next.nextSpawn,

        remaining: next.remaining,

        active: next.active

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

            if (world === "L1") {

                if (!boss.layer)
                    return;

            } else {

                if (boss.world !== world)
                    return;

            }

        }

        // Clasificación

        if (bossData.active) {

            activeBosses.push(bossData);

        } else {

            upcomingBosses.push(bossData);

        }

    });

    // Primero activos

    activeBosses.sort((a, b) =>

        a.name.localeCompare(b.name)

    );

    // Después próximos por tiempo restante

    upcomingBosses.sort((a, b) =>

        a.remaining - b.remaining

    );

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

    checkNotifications();

    render();

}

//==========================================
// NOTIFICACIONES
//==========================================

function checkNotifications() {

    if (Notification.permission !== "granted")
        return;

    upcomingBosses.forEach(boss => {

        CONFIG.WARNINGS.forEach(minutes => {

            const target = minutes * 60;

            const key =
                `${boss.id}-${boss.nextSpawn}-${minutes}`;

            if (
                boss.remaining <= target &&
                boss.remaining > target - 1
            ) {

                if (notified.has(key))
                    return;

                notified.add(key);

                new Notification(
                    `${boss.name} (${boss.world})`,
                    {
                        body:
                            `Aparece en ${minutes} minutos (${boss.nextSpawn})`,
                        icon: "icon.png"
                    }
                );

            }

        });

    });

}

refresh();

setInterval(

    refresh,

    1000

);

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

    if (!confirm("¿Resetear todos los bosses?"))
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