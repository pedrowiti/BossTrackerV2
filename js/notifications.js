// =========================================
// Boss Tracker V2
// notifications.js
// =========================================

import { CONFIG } from "./config.js";

export default class Notifications {

   constructor(language) {

    this.language = language;

    this.storageKey = "BossTrackerNotifications";

       this.defaults = {

            enabled: false,

            windows: true,

            sound: true,

            notify10: false,

            notify5: true,

            notifySpawn: false

};

        this.sentNotifications = new Set();

        this.settings = this.load();

    }

    //==========================================
    // CARGAR CONFIGURACIÓN
    //==========================================

    load() {

        const json = localStorage.getItem(this.storageKey);

        if (!json)
            return { ...this.defaults };

        try {

            return {

                ...this.defaults,

                ...JSON.parse(json)

            };

        }

        catch {

            return { ...this.defaults };

        }

    }

    //==========================================
    // OBTENER CONFIGURACIÓN
    //==========================================

    getSettings() {

        return {

            ...this.settings

        };


    }

    //==========================================
    // GUARDAR CONFIGURACIÓN
    //==========================================

    setSettings(settings) {

        this.settings = {

            ...this.settings,

            ...settings

        };

        this.save();

    }

    //==========================================
    // GUARDAR
    //==========================================

    save() {

        localStorage.setItem(

            this.storageKey,

            JSON.stringify(this.settings)

        );

    }

    //==========================================
    // ¿ESTÁN ACTIVADAS?
    //==========================================

    isEnabled() {

        return this.settings.enabled;

    }

    //==========================================
    // SOLICITAR PERMISO
    //==========================================

    async requestPermission() {

        if (Notification.permission === "granted")
            return true;

        const result =

            await Notification.requestPermission();

        return result === "granted";

    }

    //==========================================
    // ¿PODEMOS NOTIFICAR?
    //==========================================

    canNotify() {

        return (

            this.settings.enabled &&

            Notification.permission === "granted"

        );

    }

    //==========================================
    // SONIDO
    //==========================================

    playSound() {

        if (!this.settings.sound)
            return;

        const audio = new Audio("./assets/notification.mp3");

        audio.volume = 0.8;

        audio.play().catch(() => {});

    }

    //==========================================
    // NOTIFICACIÓN WINDOWS
    //==========================================

    show(title, body) {

        if (!this.canNotify())
            return;

        if (!this.settings.windows)
            return;

        new Notification(title, {

            body

        });

    }

    //==========================================
    // COMPROBAR NOTIFICACIONES
    //==========================================

    check(activeBosses, upcomingBosses) {

        if (!this.canNotify())
        return;

        this.checkUpcoming(upcomingBosses);

        this.checkActive(activeBosses);

        
    

    const notify10 = [];
    const notify5 = [];
    const notifySpawn = [];
    }

    //======================================
    // COMPROBAR PRÓXIMOS BOSSES
    //======================================

      checkUpcoming(upcomingBosses) {

    //======================================
    // AGRUPAR POR HORA DE APARICIÓN
    //======================================

    const groups = new Map();

    upcomingBosses.forEach(boss => {

        const key = boss.lastSpawnValue;

        if (!groups.has(key)) {

            groups.set(key, []);

        }

        groups.get(key).push(boss);

    });

    //======================================
    // RECORRER CADA GRUPO
    //======================================

    groups.forEach((bosses, spawnValue) => {

        const remaining = bosses[0].remaining;

                let type = null;
        

        //======================================
        // AVISO 10 MINUTOS
        //======================================

        if (

            this.settings.notify10 &&
            remaining <= 600 &&
            remaining > 599

        ) {

            type = "10";
           

        }

        //======================================
        // AVISO 5 MINUTOS
        //======================================

        else if (

            this.settings.notify5 &&
            remaining <= 300 &&
            remaining > 299

        ) {

            type = "5";
            

        }

        if (!type)
            return;

        //======================================
        // EVITAR DUPLICADOS
        //======================================

        const key = `${spawnValue}-${type}`;

        if (this.sentNotifications.has(key))
            return;

        this.sentNotifications.add(key);

     //======================================
     // CONSTRUIR MENSAJE
     //======================================

     this.notifyGroup(type, bosses);

    });

        }

        //======================================
        // COMPROBAR BOSSES ACTIVOS
        //======================================

        checkActive(activeBosses) {
             if (!this.settings.notifySpawn)
                return;
    
            //======================================
            // AGRUPAR POR APARICIÓN
            //======================================

            const groups = new Map();

            activeBosses.forEach(boss => {

            const spawnValue = boss.lastSpawnValue;

            if (!groups.has(spawnValue)) {

                groups.set(spawnValue, []);

            }

            groups.get(spawnValue).push(boss);

});

            //======================================
            // COMPROBAR CADA GRUPO
            //======================================

            groups.forEach((bosses, spawnValue) => {

                const key = `${spawnValue}-spawn`;

                if (this.sentNotifications.has(key))
                    return;

                this.sentNotifications.add(key);

                this.notifyGroup("spawn", bosses);

            });



        }

//======================================
// NOTIFICAR GRUPO
//======================================

notifyGroup(type, bosses) {

    let title = "";

    switch (type) {

        case "10":

            title = this.language.t("notification10", {
                count: bosses.length
            });

            break;

        case "5":

            title = this.language.t("notification5", {
                count: bosses.length
            });

            break;

        case "spawn":

            title = this.language.t("notificationSpawn", {
                count: bosses.length
            });

            break;

    }

    const body = bosses
        .map(boss => {

            const world = boss.layer
                ? `Layer 1 ${boss.world}`
                : boss.world;

            return `• ${world} · ${boss.name}`;

        })
        .join("\n");

    this.show(title, body);

    this.playSound();

}

}