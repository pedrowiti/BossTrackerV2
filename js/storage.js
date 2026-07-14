// =========================================
// Boss Tracker V2
// storage.js
// =========================================

import { CONFIG } from "./config.js";

export default class Storage {

    constructor() {

        this.key = CONFIG.STORAGE_KEY;

        this.data = this.load();

        this.cleanOldData();

    }

    //==========================================
    // CARGAR
    //==========================================

    load() {

        try {

            const json = localStorage.getItem(this.key);

            if (!json) {

                return {

                    cycle: this.getCurrentCycle(),

                    completed: []

                };

            }

            return JSON.parse(json);

        }

        catch {

            return {

                cycle: this.getCurrentCycle(),

                completed: []

            };

        }

    }

    //==========================================
    // GUARDAR
    //==========================================

    save() {

        localStorage.setItem(

            this.key,

            JSON.stringify(this.data)

        );

    }

    //==========================================
    // CICLO SEMANAL DEL SERVIDOR
    //==========================================

    getCurrentCycle() {

        const now = new Date();

        const current = new Date(Date.UTC(

            now.getUTCFullYear(),

            now.getUTCMonth(),

            now.getUTCDate(),

            now.getUTCHours(),

            now.getUTCMinutes(),

            now.getUTCSeconds()

        ));

        if (

            current.getUTCDay() === CONFIG.SERVER_RESET_WEEKDAY &&

            current.getUTCHours() < CONFIG.SERVER_RESET_UTC_HOUR

        ) {

            current.setUTCDate(

                current.getUTCDate() - 7

            );

        }

        while (

            current.getUTCDay() !== CONFIG.SERVER_RESET_WEEKDAY

        ) {

            current.setUTCDate(

                current.getUTCDate() - 1

            );

        }

        current.setUTCHours(

            CONFIG.SERVER_RESET_UTC_HOUR,

            0,

            0,

            0

        );

        return current.toISOString();

    }

    //==========================================
    // LIMPIAR CICLOS ANTIGUOS
    //==========================================

    cleanOldData() {

        const cycle = this.getCurrentCycle();

        if (this.data.cycle === cycle)
            return;

        this.data = {

            cycle,

            completed: []

        };

        this.save();

    }

    //==========================================
    // COMPLETAR
    //==========================================

    completeBoss(id) {

        if (this.isCompleted(id))
            return;

        this.data.completed.push(id);

        this.save();

    }

    //==========================================
    // ¿ESTÁ COMPLETADO?
    //==========================================

    isCompleted(id) {

        return this.data.completed.includes(id);

    }

    //==========================================
    // LISTA COMPLETADOS
    //==========================================

    getCompleted() {

        return [...this.data.completed];

    }

    //==========================================
    // DESMARCAR
    //==========================================

    uncompleteBoss(id) {

        this.data.completed =

            this.data.completed.filter(

                boss => boss !== id

            );

        this.save();

    }

    //==========================================
    // RESET
    //==========================================

    clear() {

        this.data.completed = [];

        this.save();

    }

}