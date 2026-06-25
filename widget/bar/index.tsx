import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import Workspaces from "./components/Workspaces";
import AstalHyprland from 'gi://AstalHyprland';
import { AIChatButton } from "./components/AIChat/ChatButton";
import { Hardware } from "./components/Hardware";
import { Wallpaper } from "./components/Wallpaper";
import Clock from "./components/Clock";



export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const hypr = AstalHyprland.Hyprland.get_default();

  const win = (
    <window
      visible
      name="bar"
      namespace="bar"
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
            {/* <AIChatButton /> */}
            <Wallpaper />
            {/* <Wallpaper /> */}
            <Workspaces />
          </box>
        </box>

        {/* BLOQUE CENTRAL: Marcado obligatoriamente con $type="center" */}
        <box $type="center" halign={Gtk.Align.CENTER}>
          <box class="glass-capsule clock-capsule">
            <Clock />
          </box>
          <box class="bar-right-container">
            {/* <DropdownTrigger icon="󰎈" namespace="music" classNamespace="music-trigger" /> */}
        </box>
        </box>

        {/* BLOQUE DERECHO: Marcado obligatoriamente con $type="end" */}
        <box $type="end" halign={Gtk.Align.END}>
          <box class="glass-capsule status-capsule">
            <Hardware />
            {/*  */}
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
