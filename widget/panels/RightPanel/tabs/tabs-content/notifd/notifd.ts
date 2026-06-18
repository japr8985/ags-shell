// widget/panels/RightPanel/tabs/tabs-content/notifd/notifd.ts
import Notifd from "gi://AstalNotifd?version=0.1";

// Singleton del demonio oficial de notificaciones de Astal
export const notifd = Notifd.get_default();

/**
 * Elimina una notificación específica del historial en memoria de C
 */
export function dismissNotification(id: number) {
    const notification = notifd.get_notification(id);
    if (notification) {
        notification.dismiss();
    }
}

/**
 * Puga por completo la lista de mensajes activos
 */
export function clearAllNotifications() {
    if (notifd && notifd.notifications) {
        // Hacemos una copia superficial para evitar mutar el array real a mitad del bucle
        const activeNotifs = [...notifd.notifications];
        activeNotifs.forEach(n => n.dismiss());
    }
}

/**
 * Ejecuta la acción primaria de la notificación (por ejemplo, abrir un enlace del navegador)
 */
export function invokeDefaultAction(id: number) {
    const notification = notifd.get_notification(id);
    if (notification) {
        notification.invoke_action("default");
    }
}