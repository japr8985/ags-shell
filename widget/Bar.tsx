import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import Workspaces from "./custtom-bar-nodes/Workspaces"
import AstalHyprland from 'gi://AstalHyprland';
import Wallpaper from "./custtom-bar-nodes/Wallpaper"
import AIChatButton from "./custtom-bar-nodes/AIChatButton"
import Clock from "./custtom-bar-nodes/Clock"
import Hardware from "./custtom-bar-nodes/Hardware"
import { RevealerBtn } from "./revealer"
import { MusicSimpleModule } from "./bar/components/MusicModule"



export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date")
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const hypr = AstalHyprland.Hyprland.get_default();

  const win = (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox hexpand>
        
        {/* BLOQUE IZQUIERDO: Marcado obligatoriamente con $type="start" */}
        <box $type="start" halign={Gtk.Align.START}>
          <box class="glass-capsule">
            <AIChatButton />
            <Wallpaper />
            <Workspaces />
          </box>
        </box>

        {/* BLOQUE CENTRAL: Marcado obligatoriamente con $type="center" */}
        <box $type="center" halign={Gtk.Align.CENTER}>
          <box class="glass-capsule clock-capsule">
            <Clock />
            <MusicSimpleModule />
          </box>
        </box>

        {/* BLOQUE DERECHO: Marcado obligatoriamente con $type="end" */}
        <box $type="end" halign={Gtk.Align.END}>
          <box class="glass-capsule status-capsule">
            <Hardware />
          </box>
        </box>

      </centerbox>
    </window>
  ) as any;

  // SOLUCIÓN GLOBAL DE REACTIVIDAD:
  // Cada vez que Hyprland avise de un evento, le pedimos a la ventana completa de la barra 
  // que ejecute una cola de redibujado (queue_draw). Esto actualiza los iconos al instante
  // de forma limpia y estándar en GTK4.
  hypr?.connect("event", () => {
    win.queue_draw();
  });

  return win;

}
