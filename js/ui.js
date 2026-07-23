// =========================================
// Boss Tracker V2
// ui.js
// =========================================

import Language from "./language.js";

export default class UI {

    constructor() {

        this.activeContainer = document.getElementById("activeBosses");
        this.bossContainer = document.getElementById("bossList");
        this.completedContainer = document.getElementById("completedList");
        this.completedTitle = document.getElementById("completedTitle");
        this.language = new Language();
    }

    //==========================================
    // Crear tarjeta
    //==========================================

    createBossCard(
    boss,
    active = false,
    showCompleteButton = false
) {

       const card = document.createElement("div");

card.className = "bossCard";

if (active) {

    card.classList.add("bossActive");

} else if (boss.remaining <= 300) {

    // 5 minutos

    card.classList.add("bossSoon");

} else if (boss.remaining <= 1800) {

    // 30 minutos

    card.classList.add("bossWarning");

}

        //-------------------------
        // Información
        //-------------------------

        const info = document.createElement("div");
        info.className = "bossInfo";

        //-------------------------
        // Nombre
        //-------------------------

        const header = document.createElement("div");
header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
header.style.gap = "10px";

const name = document.createElement("div");
name.className = "bossName";

const worldText = this.formatWorld(boss);

if (active) {

    name.textContent = `🔥 ${boss.name} (${worldText})`;

} else {

    name.textContent = `${boss.name} (${worldText})`;

}

const status = document.createElement("div");
status.className = "bossStatus";

status.style.whiteSpace = "nowrap";

if (active) {

    status.textContent =
        this.language.t("active");

} else {

    status.textContent =
        "⏳ " +
        this.formatRemaining(boss.remaining);

}

header.appendChild(name);
header.appendChild(status);

const hours = document.createElement("div");
hours.className = "bossWorld";

hours.textContent =
    this.getSchedulePreview(
        boss.scheduleFull,
        boss.nextSpawn,
        active        
    );

info.appendChild(header);
info.appendChild(hours);
card.appendChild(info);

        //-------------------------
        // Botón completar
        //-------------------------

        if (showCompleteButton) {

    const button = document.createElement("button");

    button.className = "completeButton";

    button.textContent = "✖";

    button.dataset.id = boss.id;

    button.title =
    this.language.t("complete");

    card.appendChild(button);

}

        return card;

    }

    //==========================================
    // Activos
    //==========================================

    renderActiveBosses(list) {

        this.activeContainer.innerHTML = "";

        if (!list.length) {

            this.activeContainer.innerHTML =
    `<div class="emptyMessage">
        ${this.language.t("noActive")}
    </div>`;

            return;

        }

        list.forEach(boss => {

            this.activeContainer.appendChild(

                this.createBossCard(
    boss,
    true,
    true
)

            );

        });

    }

    //==========================================
    // Próximos
    //==========================================

    renderBosses(list) {

        this.bossContainer.innerHTML = "";

        list.forEach(boss => {

            this.bossContainer.appendChild(

               this.createBossCard(
    boss,
    false,
    true
)

            );

        });

    }

    //==========================================
    // Completed
    //==========================================

    renderCompletedBosses(list) {

        this.completedContainer.innerHTML = "";

        this.completedTitle.textContent =
    `${this.language.t("completed")} (${list.length})`;

        list.forEach(boss => {

            const card = document.createElement("div");
            card.className = "bossCard completed";

            const info = document.createElement("div");
            info.className = "bossInfo";

            const name = document.createElement("div");
            name.className = "bossName";
            name.textContent = boss.name;

            const world = document.createElement("div");
            world.className = "bossWorld";
            
            const worldText = this.formatWorld(boss);
            world.textContent = worldText;

            info.appendChild(name);
            info.appendChild(world);

            world.textContent = worldText;

            card.appendChild(info);

            const restore = document.createElement("button");

            restore.className = "restoreButton";

            restore.textContent = "↺";

            restore.title =
    this.language.t("restore");

            restore.dataset.id = boss.id;

            card.appendChild(restore);

            this.completedContainer.appendChild(card);

        });

    }

    //==========================================
// Evento botón X
//==========================================

onBossCompleted(callback) {

    const handler = (event) => {

        const button = event.target.closest(".completeButton");

        if (!button)
            return;

        callback(button.dataset.id);

    };

    this.activeContainer.addEventListener("click", handler);

    this.bossContainer.addEventListener("click", handler);

}
//==========================================
// EVENTO RESTAURAR
//==========================================

onBossRestore(callback) {

    this.completedContainer.addEventListener("click", (event) => {

        const button = event.target.closest(".restoreButton");

        if (!button)
            return;

        callback(button.dataset.id);

    });

}
    //==========================================
    // Mostrar horarios
    //==========================================

    getSchedulePreview(schedule, nextSpawn, active = false) {

        if (!schedule || !nextSpawn)
            return "";

        let index = schedule.indexOf(nextSpawn);

        if (index === -1)
            return schedule.join(" · ");

        // Si el boss está activo,
        // mostrar primero la aparición actual.

        if (active) {

            index--;

            if (index < 0)
                index = schedule.length - 1;

        }

        const hour1 = schedule[index];

        const hour2 =
            schedule[(index + 1) % schedule.length];

        const hour3 =
            schedule[(index + 2) % schedule.length];

        return `${hour1} · ${hour2} · ${hour3}`;

}


    //==========================================
    // Cuenta atrás
    //==========================================

    formatRemaining(seconds) {

        if (seconds < 0)
            seconds = 0;

        const h = Math.floor(seconds / 3600);

        const m = Math.floor((seconds % 3600) / 60);

        const s = seconds % 60;

        if (h > 0) {

            return `${h}h ${m}m ${s}s`;

        }

        return `${m}m ${s}s`;

    }

    //==========================================
    // FORMATEAR MUNDO
    //==========================================

    formatWorld(boss) {

        if (boss.layer) {

            return `${this.language.t("layer")} ${boss.world}`;

        }

        return boss.world;

    }

}