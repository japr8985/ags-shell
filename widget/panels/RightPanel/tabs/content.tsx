// widget/panels/RightPanel/tabs/content.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { activeTab } from "./tabs";

// Tus importaciones de contenido reales
import { renderNotificationList } from "./tabs-content/notifd"; 
import { AudioTabContent } from "./tabs-content/audio/index"; 
import { WeatherTabContent } from "./tabs-content/weather";

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

                    // --- PESTAÑA 2: CLIMA (SOLUCIÓN IMPERATIVA ULTRA RECTIVA) ---
    const scrollWeather = new Gtk.ScrolledWindow({
        has_frame: false,
        hscrollbar_policy: Gtk.PolicyType.NEVER,
        vscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
        vexpand: true,
        hexpand: true
    });
    
    // Forzamos el nombre en el core de C antes de mapear el contenido
    scrollWeather.set_name("weather"); 

    // TRUCO MAESTRO: En lugar de renderizar el bindeo en JSX, 
    // hacemos que el ScrolledWindow actualice su child nativo en C cada vez que el clima cambie.
    // Importamos la función directo (asegúrate de que WeatherTabContent devuelva un Gtk.Widget puro)
    scrollWeather.set_child(WeatherTabContent());

    // Lo registramos de forma impecable en el Stack de C
    self.add_named(scrollWeather, "weather");
                }}
            />
        </box>
    ) as any;
}