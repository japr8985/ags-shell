import { Gtk, Gdk } from "ags/gtk4";
import { createBinding } from "ags";
import { wifi, toggleWifi, showWifiMenu } from "./wifi";

export default function WifiToggle(): Gtk.Widget {
    // Fallback defensivo si no hay hardware de red mapeado en Fedora
    if (!wifi) {
        return (
            <button class="toggle-card disabled" hexpand={true}>
                <box orientation={Gtk.Orientation.VERTICAL} spacing={6} valign={Gtk.Align.CENTER}>
                    <label class="toggle-icon" label="󰖪" />
                    <label class="toggle-title" label="Wi-Fi (No disponible)" />
                </box>
            </button>
        ) as any;
    }

    return (
        <button 
            // El estado CSS muta de forma reactiva directo desde el bus de C
            class={createBinding(wifi, "enabled")(() => wifi.enabled ? "toggle-card active" : "toggle-card")} 
            hexpand={true}
            // CLICK IZQUIERDO: Invoca la función abstracta
            onClicked={() => toggleWifi()}
            // CLICK DERECHO: El controlador de gestos inyecta el menú flotante
            $={(self) => {
                const gesture = new Gtk.GestureClick();
                gesture.set_button(0);
                
                gesture.connect("pressed", () => {
                    if (gesture.get_current_button() === Gdk.BUTTON_SECONDARY) {
                        showWifiMenu(self);
                    }
                });
                
                self.add_controller(gesture);
            }}
        >
            <box orientation={Gtk.Orientation.VERTICAL} spacing={6} valign={Gtk.Align.CENTER}>
                <label 
                    class="toggle-icon" 
                    label={createBinding(wifi, "enabled")(() => wifi.enabled ? "󰖩" : "󰖪")} 
                />
                <label class="toggle-title" label="Wi-Fi" />
            </box>
        </button>
    ) as any;
}