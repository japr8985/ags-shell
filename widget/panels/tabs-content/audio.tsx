// import Wp from "gi://AstalWp?version=0.1"
import Wp from "gi://AstalWirePlumber"
import { createBinding } from "ags"
import { Gtk } from "ags/gtk4";

// Obtenemos el endpoint de audio por defecto del sistema (Las cornetas/salida principal)
const audio = Wp.get_default()?.audio;
const defaultSpeaker = audio?.default_speaker;

function renderAudioTab(): Gtk.Widget {
  // Si WirePlumber no está disponible, mostramos un fallback seguro
  if (!defaultSpeaker) {
    return (
      <box orientation={Gtk.Orientation.VERTICAL} spacing={10} valign={Gtk.Align.CENTER}>
        <label label="󰓃" style="font-size: 24px; opacity: 0.5;" />
        <label label="Servicio de audio no disponible" opacity={0.6} />
      </box>
    ) as any;
  }

  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={16} class="audio-tab-container">
      
      {/* SECCIÓN DE VOLUMEN PRINCIPAL */}
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8} class="audio-slider-block">
        
        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
          {/* Icono dinámico según el nivel de volumen */}
          <label 
            class="audio-icon" 
            label={createBinding(defaultSpeaker, "volume")(() => {
              if (defaultSpeaker.mute) return "󰝟";
              const vol = defaultSpeaker.volume;
              if (vol === 0) return "󰕿";
              if (vol < 0.3) return "󰖀";
              if (vol < 0.7) return "󰕾";
              return "󰕾";
            })} 
          />
          {/* Texto identificador */}
          <label class="audio-title" label="Volumen Principal" hexpand halign={Gtk.Align.START} />
          {/* Porcentaje numérico exacto (ej: 45%) */}
          <label 
            class="audio-percentage" 
            label={createBinding(defaultSpeaker, "volume")(() => {
              return `${Math.round(defaultSpeaker.volume * 100)}%`;
            })} 
          />
        </box>

        {/* Deslizador Nativo de GTK */}
        <Scale
          class="audio-scale"
          hexpand={true}
          draw_value={false} // Quitamos el indicador numérico nativo feo de GTK
          min={0}
          max={1}
          step={0.01}
          // Vinculamos el estado bidireccional
          value={createBinding(speaker, "volume")}
          // Al arrastrar, mutamos la propiedad de PipeWire directamente en JS
          onValueChanged={(self) => {
            speaker.volume = self.value;
          }}
        />
      </box>

      {/* Aquí podemos meter más adelante la lista de aplicaciones o dispositivos de salida */}
    </box>
  ) as any;
}