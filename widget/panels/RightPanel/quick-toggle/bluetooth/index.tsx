// widget/panels/session/bluetooth/index.tsx
import { Gtk, Gdk } from "ags/gtk4";
import { createBinding } from "ags";
import { bluetooth, toggleBluetooth, showBluetoothMenu } from "./bluetooth";

export default function BluetoothToggle(): Gtk.Widget {
    // Fallback de seguridad si el hardware/servicio Bluetooth no responde en Fedora
    if (!bluetooth) {
        return (
            <button class="toggle-card disabled" hexpand={true}>
                <box orientation={Gtk.Orientation.VERTICAL} spacing={6} valign={Gtk.Align.CENTER}>
                    <label class="toggle-icon" label="󰂲" />
                    <label class="toggle-title" label="Bluetooth (No disponible)" />
                </box>
            </button>
        ) as any;
    }

    return (
        <button 
            // Escucha reactiva limpia sobre el cambio de estado en memoria de C
            class={createBinding(bluetooth, "is-powered")(() => bluetooth.is_powered ? "toggle-card active" : "toggle-card")} 
            hexpand={true}
            // CLICK IZQUIERDO: Conmutación nativa inmediata
            onClicked={() => toggleBluetooth()}
            // CLICK DERECHO: Levantamiento dinámico del menú Popover
            $={(self) => {
                const gesture = new Gtk.GestureClick();
                gesture.set_button(0); // Escucha todos los clicks del mouse
                
                gesture.connect("pressed", () => {
                    if (gesture.get_current_button() === Gdk.BUTTON_SECONDARY) {
                        showBluetoothMenu(self);
                    }
                });
                
                self.add_controller(gesture);
            }}
        >
            <box orientation={Gtk.Orientation.VERTICAL} spacing={6} valign={Gtk.Align.CENTER}>
                {/* Icono dinámico reactivo */}
                <label 
                    class="toggle-icon" 
                    label={createBinding(bluetooth, "is-powered")(() => bluetooth.is_powered ? "󰂯" : "󰂲")} 
                />
                <label class="toggle-title" label="Bluetooth" />
            </box>
        </button>
    ) as any;
}