// widget/panels/tabs-content/audio/index.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { speaker, toggleMute } from "./audio";

export function AudioTabContent(): Gtk.Widget {
    if (!speaker) {
        return (
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
                <label label="󰓃" class="fallback-audio-icon" opacity={0.3} />
                <label label="Dispositivo de audio no disponible" opacity={0.5} />
            </box>
        ) as any;
    }

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={16} class="audio-tab-container" vexpand hexpand>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10} class="audio-slider-block">
                
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
                    <button class="audio-icon-btn" onClicked={() => toggleMute()}>
                        <label 
                            class="audio-icon" 
                            label={createBinding(speaker, "volume")(() => {
                                if (speaker.mute) return "󰝟";
                                const vol = speaker.volume;
                                if (vol === 0) return "󰕿";
                                if (vol < 0.3) return "󰖀";
                                if (vol < 0.7) return "󰕾";
                                return "󰕾";
                            })} 
                        />
                    </button>
                    
                    <label class="audio-title" label="Volumen Principal" hexpand halign={Gtk.Align.START} />
                    
                    <label 
                        class="audio-percentage" 
                        label={createBinding(speaker, "volume")(() => {
                            return `${Math.round(speaker.volume * 100)}%`;
                        })} 
                    />
                </box>

                {/* INYECCIÓN NATIVA DEL SLIDER DE GTK4 */}
                <box $={(self) => {
                    // Instanciamos el GtkScale real de C de forma horizontal
                    const scale = new Gtk.Scale({
                        orientation: Gtk.Orientation.HORIZONTAL,
                        hexpand: true,
                        draw_value: false, // Oculta el contador nativo de GTK
                        round_digits: 2
                    });

                    // Añadimos su clase de CSS para tus estilos SCSS
                    scale.add_css_class("audio-scale");

                    // Configuramos los límites del rango de PipeWire (0.0 a 1.0)
                    scale.set_range(0, 1);
                    scale.set_increments(0.01, 0.05);

                    // Bindeo de lectura: Sincroniza el slider si cambias el volumen desde afuera
                    createBinding(speaker, "volume")((val) => {
                        // Evita bucles de eventos bloqueantes si el usuario está arrastrando el slider
                        if (!scale.is_pointer_inside || !scale.has_focus) {
                            scale.set_value(val);
                        }
                    });

                    // Bindeo de escritura: Modifica PipeWire al arrastrar el slider
                    scale.connect("value-changed", () => {
                        speaker.volume = scale.get_value();
                    });

                    // Insertamos el slider de C dentro del contenedor JSX
                    self.append(scale);
                }} />
                
            </box>
        </box>
    ) as any;
}