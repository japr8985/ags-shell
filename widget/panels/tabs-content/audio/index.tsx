import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { speaker } from "./audio";

export function AudioTabContent(): Gtk.Widget {
    // Fallback de seguridad por si WirePlumber no ha iniciado en DBus
    if (!speaker) {
        const fallbackBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 10 });
        fallbackBox.set_valign(Gtk.Align.CENTER);
        
        const fallbackLabel = new Gtk.Label({ label: "Audio no disponible", opacity: 0.5 });
        fallbackBox.append(fallbackLabel);
        return fallbackBox as any;
    }

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={16} class="audio-tab-container" vexpand>
            
            {/* BLOQUE COMPACTO DEL SLIDER */}
            <box orientation={Gtk.Orientation.VERTICAL} spacing={8} class="audio-slider-block">
                
                {/* Fila superior informativa */}
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
                    
                    {/* Icono Dinámico basado en el volumen actual */}
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
                    
                    {/* Título de la pista */}
                    <label class="audio-title" label="Volumen Principal" hexpand />
                    
                    {/* Porcentaje numérico exacto (Ej: 45%) */}
                    <label 
                        class="audio-percentage" 
                        label={createBinding(speaker, "volume")(() => {
                            return `${Math.round(speaker.volume * 100)}%`;
                        })} 
                    />
                </box>

                {/* Deslizador de volumen nativo en PascalCase */}
                <Scale
                    class="audio-scale"
                    hexpand={true}
                    draw_value={false} // Oculta el contador de texto nativo de GTK
                    min={0}
                    max={1}
                    step={0.01}
                    // Bindeo bidireccional de lectura
                    value={createBinding(speaker, "volume")}
                    // Escritura instantánea en memoria de PipeWire al arrastrar
                    onValueChanged={(self) => {
                        speaker.volume = self.value;
                    }}
                />
                
            </box>
            
        </box>
    ) as any;
}