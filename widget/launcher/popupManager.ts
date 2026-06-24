// widget/launcher/popupManager.ts
import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";

export const popupInstances = new Map<string, Gtk.Window>();

export function registerPopup(namespace: string, windowInstance: Gtk.Window) {
    popupInstances.set(namespace, windowInstance);
    console.log(`[PopupManager] Ventana registrada exitosamente para: ${namespace}`);
}

export function togglePopup(namespace: string, triggerWidget?: Gtk.Widget) {
    // 1. Intenta buscarlo en el mapa local
    let win = popupInstances.get(namespace);
    
    // 2. Si no está por orden de carga, búscalo por el nombre nativo en la app de AGS
    if (!win) {
        const expectedName = `${namespace}-dropdown-window`;
        win = app.get_window(expectedName) as Gtk.Window;
        if (win) {
            popupInstances.set(namespace, win); // Lo recuperamos
        }
    }

    if (!win) {
        console.log(`[PopupManager] CRÍTICO: No se encontró la ventana para el namespace: ${namespace}`);
        return;
    }

    const isVisible = win.get_visible();
    if (!isVisible) {
        win.set_visible(true);
        win.present();
        console.log(`[PopupManager] Mostrando popup: ${namespace}`);
    } else {
        win.set_visible(false);
        console.log(`[PopupManager] Ocultando popup: ${namespace}`);
    }
}