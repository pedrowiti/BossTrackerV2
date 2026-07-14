// =========================================
// Boss Tracker V2
// ui.js
// =========================================

export default class UI {

    constructor() {

        this.activeContainer = document.getElementById("activeBosses");
        this.bossContainer = document.getElementById("bossList");
        this.completedContainer = document.getElementById("completedList");
        this.completedTitle = document.getElementById("completedTitle");

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

const worldText = boss.layer
    ? `${boss.world} • Layer 1`
    : boss.world;

if (active) {

    name.textContent = `🔥 ${boss.name} (${worldText})`;

} else {

    name.textContent = `${boss.name} (${worldText})`;

}

const status = document.createElement("div");
status.className = "bossStatus";

status.style.whiteSpace = "nowrap";

if (active) {

    status.textContent = "🔥 Activo";

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
        boss.nextSpawn
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

    button.title = "Marcar como derrotado";

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
                "<div class='emptyMessage'>No hay bosses activos.</div>";

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
            `Completed (${list.length})`;

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
            world.textContent = boss.layer
                ? `${boss.world} • Layer 1`
                : boss.world;

            info.appendChild(name);
            info.appendChild(world);

            card.appendChild(info);

            const restore = document.createElement("button");

            restore.className = "restoreButton";

            restore.textContent = "↺";

            restore.title = "Volver a pendientes";

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
    // Mostrar próximos horarios
    //==========================================

    getSchedulePreview(schedule, nextSpawn) {

    if (!schedule || !nextSpawn)
        return "";

    const index = schedule.indexOf(nextSpawn);

    if (index === -1)
    return "";

    const next1 = schedule[index];

    const next2 =
        schedule[(index + 1) % schedule.length];

    const next3 =
        schedule[(index + 2) % schedule.length];

    return `${next1} · ${next2} · ${next3}`;

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

}