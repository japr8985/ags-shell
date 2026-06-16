// widget/panels/RightPanel/tabs/content.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { activeTab } from "./tabs";

// Tus importaciones de contenido reales
import { renderNotificationList } from "./tabs-content/notifd"; 
import { AudioTabContent } from "./tabs-content/audio/index"; 

export function TabContentArea(): Gtk.Widget {
    return (
        <box vexpand={true} hexpand={true} class="content-scroll-container">
            <stack
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
                transitionDuration={180}
                visibleChildName={createBinding(activeTab, "value")}
                vexpand={true}
                hexpand={true}
                // ENFOQUE IMPERATIVO BLINDADO: Registramos los hijos directo en C
                $={(self) => {
                    // --- PESTAÑA 0: NOTIFICACIONES ---
                    const scrollNotif = new Gtk.ScrolledWindow({
                        has_frame: false,
                        hscrollbar_policy: Gtk.PolicyType.NEVER,
                        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                        vexpand: true,
                        hexpand: true
                    });
                    scrollNotif.set_child(renderNotificationList());
                    self.add_named(scrollNotif, "notifications");

                    // --- PESTAÑA 1: AUDIO ---
                    const scrollAudio = new Gtk.ScrolledWindow({
                        has_frame: false,
                        hscrollbar_policy: Gtk.PolicyType.NEVER,
                        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                        vexpand: true,
                        hexpand: true
                    });
                    scrollAudio.set_child(AudioTabContent());
                    self.add_named(scrollAudio, "audio");

                    // --- PESTAÑA 2: RED ---
                    const networkBox = new Gtk.Box({
                        valign: Gtk.Align.CENTER,
                        halign: Gtk.Align.CENTER,
                        orientation: Gtk.Orientation.VERTICAL,
                        spacing: 10
                    });
                    networkBox.append(new Gtk.Label({ label: "󰂯", css_classes: ["network-fallback-icon"], }));
                    networkBox.append(new Gtk.Label({ label: "Configuración de Red Próximamente...", css_classes: ["user-uptime"], opacity: 0.6 }));
                    self.add_named(networkBox, "network");
                }}
            />
        </box>
    ) as any;
}