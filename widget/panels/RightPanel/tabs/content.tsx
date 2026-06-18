// widget/panels/RightPanel/tabs/content.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { activeTab } from "./tabs";

import { renderNotificationList } from "./tabs-content/notifd/index"; 
import { AudioTabContent } from "./tabs-content/audio/index"; 
import { WeatherTabContent } from "./tabs-content/weather/index"; 

export function TabContentArea(): Gtk.Widget {
    return (
        <box vexpand={true} hexpand={true} class="content-scroll-container">
            <stack
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
                transitionDuration={180}
                vexpand={true}
                hexpand={true}
                // RETORNO SEGURO SÍNCRONO: Escucha el cambio y asegura un string válido
                visibleChildName={createBinding(activeTab, "value")((val) => val || "notifications")}
                $={(self) => {
                    // 1. Pestaña de Notificaciones
                    const scrollNotif = new Gtk.ScrolledWindow({
                        has_frame: false,
                        hscrollbar_policy: Gtk.PolicyType.NEVER,
                        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                        vexpand: true, hexpand: true
                    });
                    scrollNotif.set_name("notifications"); // <--- Forzamos el ID del widget en C
                    scrollNotif.set_child(renderNotificationList());
                    self.add_named(scrollNotif, "notifications");

                    // 2. Pestaña de Audio
                    const scrollAudio = new Gtk.ScrolledWindow({
                        has_frame: false,
                        hscrollbar_policy: Gtk.PolicyType.NEVER,
                        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                        vexpand: true, hexpand: true
                    });
                    scrollAudio.set_child(AudioTabContent());
                    self.add_named(scrollAudio, "audio");

                    // 3. Pestaña de Clima
                    const scrollWeather = new Gtk.ScrolledWindow({
                        has_frame: false,
                        hscrollbar_policy: Gtk.PolicyType.NEVER,
                        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
                        vexpand: true, hexpand: true
                    });
                    scrollWeather.set_child(WeatherTabContent());
                    self.add_named(scrollWeather, "weather");

                    // Forzamos de forma manual el estado inicial en C para sincronizar
                    const initialTab = activeTab.get_value();
                    if (initialTab) {
                        self.set_visible_child_name(initialTab);
                    }
                }}
            />
        </box>
    ) as any;
}