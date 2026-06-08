import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import Workspaces from "./custtom-bar-nodes/Workspaces"
import AstalHyprland from 'gi://AstalHyprland';
import Wallpaper from "./custtom-bar-nodes/Wallpaper"
import AIChatButton from "./custtom-bar-nodes/AIChatButton"
import Clock from "./custtom-bar-nodes/Clock"


export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date")
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const hypr = AstalHyprland.Hyprland.get_default();

  // Creamos la ventana de la barra
  // const win = (
  //   <window
  //     visible
  //     name="bar"
  //     class="Bar"
  //     gdkmonitor={gdkmonitor}
  //     exclusivity={Astal.Exclusivity.EXCLUSIVE}
  //     anchor={TOP | LEFT | RIGHT}
  //     application={app}
  //   >
  //     <box class="left-modules">
  //       <box class="glass-capsule">
  //         <AIChatButton />
  //         <Wallpaper />
  //         <Workspaces />
  //       </box>
  //     </box>
  //     <box css={'background:red'}>
  //       <box class="glass-capsule">
  //         <AIChatButton />
  //         <Wallpaper />
  //         <Workspaces />
  //       </box>
  //     </box>
  //   </window>
  // ) as any;
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
          </box>
        </box>

        {/* BLOQUE DERECHO: Marcado obligatoriamente con $type="end" */}
        <box $type="end" halign={Gtk.Align.END}>
          <box class="glass-capsule status-capsule">
            <label class="status-icon net" label="󰖩 " />
            <label class="status-icon vol" label="󰕾 " />
            <label class="status-icon bat" label="󰁹 " />
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
