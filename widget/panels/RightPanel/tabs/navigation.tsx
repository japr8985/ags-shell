// widget/panels/tabs/navigation.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { activeTab, switchTab, TabId } from "./tabs";

export function TabNavigation(): Gtk.Widget {
    // Función auxiliar para construir botones reactivos sin repetir código CSS
    const TabButton = (id: TabId, iconAndText: string) => (
        <button
            class={createBinding(activeTab, "value")((current) => 
                current === id ? "tab-btn active" : "tab-btn"
            )}
            hexpand={true}
            onClicked={() => switchTab(id)}
        >
            <label label={iconAndText} />
        </button>
    );

    return (
        <box class="subnav-tabs" spacing={4} homogeneous={true}>
            {TabButton("notifications", "󰵚  Notificaciones")}
            {TabButton("audio", "󰕾  Audio")}
            {TabButton("weather", "󰖕  Clima")}
        </box>
    ) as any;
}