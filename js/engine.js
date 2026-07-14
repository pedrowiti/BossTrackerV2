// =========================================
// Boss Tracker V2
// engine.js
// =========================================

import { CONFIG } from "./config.js";

export default class Engine {

    constructor() {

        this.baseTimezone = CONFIG.BASE_TIMEZONE;

        this.userTimezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;

        this.ACTIVE_SECONDS =
            CONFIG.ACTIVE_MINUTES * 60;

    }

    //==========================================
    // ZONA HORARIA
    //==========================================

    getUserTimezone() {

        return this.userTimezone;

    }

    getSpainDate() {

        const now = new Date();

        const text = now.toLocaleString("en-US", {
            timeZone: this.baseTimezone
        });

        return new Date(text);

    }

    //==========================================
    // CONVERSIONES
    //==========================================

    timeToMinutes(time) {

        const [h, m] = time.split(":").map(Number);

        return h * 60 + m;

    }

    minutesToString(minutes) {

        minutes = ((minutes % 1440) + 1440) % 1440;

        const h = Math.floor(minutes / 60);

        const m = minutes % 60;

        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    }

    getSpainMinutes() {

        const now = this.getSpainDate();

        return now.getHours() * 60 + now.getMinutes();

    }

    //==========================================
    // HORARIOS
    //==========================================

    buildSchedule(schedule) {

    const result = [];

    schedule.forEach(time => {

        const minutes = this.timeToMinutes(time);

        // Día actual
        result.push(minutes);

        // Mismo spawn 12 horas después
        result.push(minutes + 720);

        // Mismo spawn del día siguiente
        result.push(minutes + 1440);

    });

    result.sort((a, b) => a - b);

    return result;

}

    //==========================================
    // DIFERENCIA
    //==========================================

    getSecondsRemaining(targetMinutes) {

        const now = this.getSpainDate();

        const currentMinutes =
            now.getHours() * 60 +
            now.getMinutes();

        let diffMinutes =
            targetMinutes - currentMinutes;

        if (diffMinutes < 0)
            diffMinutes += 1440;

        return diffMinutes * 60 - now.getSeconds();

    }

    //==========================================
    // PRÓXIMO SPAWN
    //==========================================

    getNextSpawn(schedule) {

    const now = this.getSpainDate();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes() +
        (now.getSeconds() / 60);

    // Línea temporal continua
    const nowTimeline =
        currentMinutes < 720
            ? currentMinutes + 1440
            : currentMinutes;

    let previousSpawn = null;
    let nextSpawn = null;

    for (const spawn of schedule) {

        if (spawn <= nowTimeline) {

            previousSpawn = spawn;

            continue;

        }

        nextSpawn = spawn;

        break;

    }

    if (previousSpawn === null)
        previousSpawn = schedule[0];

    if (nextSpawn === null)
        nextSpawn = schedule[schedule.length - 1] + 720;

    const secondsSinceSpawn =
        Math.floor((nowTimeline - previousSpawn) * 60);

    const remaining =
        Math.floor((nextSpawn - nowTimeline) * 60);

    return {

        nextSpawn: this.minutesToString(nextSpawn),

        remaining,

        active: secondsSinceSpawn <= this.ACTIVE_SECONDS

    };

}

    //==========================================
    // FORMATO
    //==========================================

    formatCountdown(seconds) {

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