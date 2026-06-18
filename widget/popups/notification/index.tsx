// widget/popups/notification/index.tsx
import { Astal, Gtk } from "ags/gtk4";
import GLib from "gi://GLib";
import Gio from "gi://Gio"; // <--- IMPORTANTE: Forzador nativo de D-Bus
import { notifd } from "../../panels/RightPanel/tabs/tabs-content/notifd/notifd";
import { createPopupCard } from "./popup-card";

export default function NotificationPopup(gdkmonitor: any) {
    const { TOP, RIGHT } = Astal.WindowAnchor;

    return (
        <window
            name="notification-popup"
            class="popup-window-container"
            gdkmonitor={gdkmonitor}
            anchor={TOP | RIGHT}
            margin_top={12}
            margin_right={12}
            visible={false}
            exclusivity={Astal.Exclusivity.IGNORE} 
        >
            <box 
                orientation={Gtk.Orientation.VERTICAL} 
                spacing={8}
                $={(self) => {
                    // --- REFORZAMIENTO DE D-BUS EN CALIENTE ---
                    try {
                        Gio.bus_own_name(
                            Gio.BusType.SESSION,
                            "org.freedesktop.Notifications",
                            Gio.BusNameOwnerFlags.REPLACE, // Reemplaza cualquier intento de fallback del navegador
                            null, null, null
                        );
                    } catch (e) {
                        console.log("Error forzando el registro D-Bus: " + e);
                    }

                    const keyRoot = new Set<number>();

                    // Escucha el evento de entrada directa de Astal
                    notifd.connect("notified", (_, id) => {
                        const n = notifd.get_notification(id);
                        if (!n || keyRoot.has(id)) return;

                        keyRoot.add(id);

                        const card = createPopupCard(n);
                        self.append(card);
                        
                        const win = self.get_parent() as Gtk.Window;
                        if (win) win.set_visible(true);

                        // Temporizador visual de 5 segundos
                        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 5000, () => {
                            if (card && card.get_parent() === self) {
                                self.remove(card);
                            }
                            
                            if (!self.get_first_child() && win) {
                                win.set_visible(false);
                            }
                            
                            return GLib.SOURCE_REMOVE;
                        });
                    });
                }}
            />
        </window>
    ) as any;
}