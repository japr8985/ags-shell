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
                        {/* FIX 1: Cambiamos el bindeo para que escuche "mute" en lugar de "volume".
                          Como el mute cambia el estado visual del icono, ahora reaccionará al milisegundo.
                        */}
                        <label
                            class="audio-icon"
                            label={createBinding(speaker, "mute")(() => {
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

                    {/* El porcentaje sí puede seguir escuchando a "volume" */}
                    <label
                        class="audio-percentage"
                        label={createBinding(speaker, "volume")(() => {
                            return `${Math.round(speaker.volume * 100)}%`;
                        })}
                    />
                </box>

                {/* INYECCIÓN NATIVA DEL SLIDER DE GTK4 CORREGIDA CON TIMEOUT */}
                <box $={(self) => {
                    const scale = new Gtk.Scale({
                        orientation: Gtk.Orientation.HORIZONTAL,
                        hexpand: true,
                        draw_value: false,
                        round_digits: 2
                    });

                    scale.add_css_class("audio-scale");
                    scale.set_range(0, 1);
                    scale.set_increments(0.01, 0.05);

                    // TRUCO MAESTRO: Esperamos a que GTK renderice el widget en pantalla 
                    // antes de inyectarle el volumen inicial de PipeWire. ¡Adiós barra en cero!
                    import("gi://GLib").then((GLib) => {
                        GLib.default.timeout_add(GLib.default.PRIORITY_DEFAULT, 50, () => {
                            if (scale && speaker) {
                                scale.set_value(speaker.volume);
                            }
                            return false; // Retornar false destruye el timeout para que corra UNA sola vez
                        });
                    });

                    // Bindeo de lectura: Sincroniza el slider si cambias el volumen desde atajos del teclado
                    createBinding(speaker, "volume")((val) => {
                        // Si el usuario no tiene el foco físico del mouse encima del slider, lo actualizamos
                        if (!scale.has_focus) {
                            scale.set_value(val);
                        }
                    });

                    // Bindeo de escritura: Modifica PipeWire al arrastrar el slider
                    scale.connect("value-changed", () => {
                        const currentVal = scale.get_value();
                        // Solo mutamos si el valor cambió significativamente para evitar bucles
                        if (Math.abs(speaker.volume - currentVal) > 0.001) {
                            speaker.volume = currentVal;
                        }
                    });

                    self.append(scale);
                }} />
            </box>
        </box>
    ) as any;
}