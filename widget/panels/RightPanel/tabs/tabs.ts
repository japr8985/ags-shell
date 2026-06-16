import AstalIO from "gi://AstalIO?version=0.1";

export type TabId = "notifications" | "audio" | "weather";

const { Variable } = AstalIO;

// Inicializamos el estado global en la pestaña de notificaciones
export const activeTab = Variable.new<TabId>("notifications");

/**
 * Cambia la pestaña activa de forma segura
 */
export function switchTab(tab: TabId) {
    activeTab.set_value(tab);
}