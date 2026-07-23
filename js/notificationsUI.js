// =========================================
// Boss Tracker V2
// notificationsUI.js
// =========================================

export default class NotificationsUI {

    constructor(notifications) {

        this.notifications = notifications;

        //==========================================
        // ELEMENTOS
        //==========================================

        this.button =
            document.getElementById("btnNotifications");

        this.panel =
            document.getElementById("notificationPanel");

        this.chkNotifications =
            document.getElementById("chkNotifications");

        this.chkWindows =
            document.getElementById("chkWindows");

        this.chkSound =
            document.getElementById("chkSound");

        this.chk10 =
            document.getElementById("chk10");

        this.chk5 =
            document.getElementById("chk5");

        this.chkSpawn =
            document.getElementById("chkSpawn");

    }

    //==========================================
    // INICIALIZAR
    //==========================================

    init() {

        this.loadSettings();

        this.updateBell();

        this.bindEvents();

    }

    //==========================================
    // CARGAR CONFIGURACIÓN
    //==========================================

    loadSettings() {

        const settings =
            this.notifications.getSettings();

        this.chkNotifications.checked =
            settings.enabled;

        this.chkWindows.checked =
            settings.windows;

        this.chkSound.checked =
            settings.sound;

        this.chk10.checked =
            settings.notify10;

        this.chk5.checked =
            settings.notify5;

        this.chkSpawn.checked =
            settings.notifySpawn;

    }

    //==========================================
    // ACTUALIZAR CAMPANA
    //==========================================

    updateBell() {

        this.button.textContent =

            this.chkNotifications.checked

                ? "🔔"

                : "🔕";

    }

    //==========================================
    // ABRIR / CERRAR PANEL
    //==========================================

    togglePanel() {

        this.panel.classList.toggle("hidden");

    }

    //==========================================
    // CERRAR PANEL
    //==========================================

    closePanel() {

        this.panel.classList.add("hidden");

    }

    //==========================================
// EVENTOS
//==========================================

bindEvents() {

    //======================================
    // CAMPANA
    //======================================

    this.button.addEventListener("click", (event) => {

        event.stopPropagation();

        this.togglePanel();

    });

    //======================================
    // ACTIVAR / DESACTIVAR
    //======================================

    this.chkNotifications.addEventListener("change", () => {

        this.toggleNotifications();

    });

    //======================================
    // WINDOWS
    //======================================

    this.chkWindows.addEventListener("change", () => {

        this.toggleWindows();

    });

    //======================================
    // SONIDO
    //======================================

    this.chkSound.addEventListener("change", () => {

        this.toggleSound();

    });

    //======================================
    // AVISO 10
    //======================================

    this.chk10.addEventListener("change", () => {

        this.toggle10();

    });

    //======================================
    // AVISO 5
    //======================================

    this.chk5.addEventListener("change", () => {

        this.toggle5();

    });

    //======================================
    // SPAWN
    //======================================

    this.chkSpawn.addEventListener("change", () => {

        this.toggleSpawn();

    });

    //======================================
    // CLICK FUERA
    //======================================

    document.addEventListener("click", (event) => {

        if (

            !this.panel.contains(event.target) &&

            !this.button.contains(event.target)

        ) {

            this.closePanel();

        }

    });

    //======================================
    // ESC
    //======================================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            this.closePanel();

        }

    });

}

//==========================================
// GUARDAR CONFIGURACIÓN
//==========================================

saveSettings() {

    this.notifications.setSettings({

        enabled:
            this.chkNotifications.checked,

        windows:
            this.chkWindows.checked,

        sound:
            this.chkSound.checked,

        notify10:
            this.chk10.checked,

        notify5:
            this.chk5.checked,

        notifySpawn:
            this.chkSpawn.checked

    });

    this.updateBell();

}

//==========================================
// CAMBIAR ESTADO GENERAL
//==========================================

toggleNotifications() {

    this.saveSettings();

}

//==========================================
// CAMBIAR WINDOWS
//==========================================

toggleWindows() {

    this.saveSettings();

}

//==========================================
// CAMBIAR SONIDO
//==========================================

toggleSound() {

    this.saveSettings();

}

//==========================================
// CAMBIAR AVISO 10
//==========================================

toggle10() {

    this.saveSettings();

}

//==========================================
// CAMBIAR AVISO 5
//==========================================

toggle5() {

    this.saveSettings();

}

//==========================================
// CAMBIAR AVISO SPAWN
//==========================================

toggleSpawn() {

    this.saveSettings();

}

}