import app from "ags/gtk4/app"
import style from "./style.scss"
// import Bar from "./widget/Bar"
import { exec } from "ags/process";
// import ChatWindow from "./widget/custtom-bar-nodes/ChatWindow"; // <-- Importamos la ventana
import { Gdk } from "ags/gtk4";
// import RightPanel from "./widget/custtom-bar-nodes/Right-panel";
import RightPanel from "./widget/panels/RightPanel/index";
import handlerCli from "./utils/handlerCli";
import NotificationPopup from "./widget/popups/notification";
import { createDropdownWindow } from "./widget/bar/components/DropdownWindow";
import { MusicBarContent } from "./widget/bar/components/Music";
import Bar from "./widget/bar/index";
import { ChatWindow } from "./widget/bar/components/AIChat/ChatWindow";
// import { Launcher } from "./widget/launcher";

const scss = `./style/main.scss`;
const css = `/tmp/ags-style.css`;
try {
  exec(`sass ${scss} ${css}`);

} catch (err) {
  console.error("Error compilando SCSS:", err);
}
app.start({
  requestHandler(request, response) {
    handlerCli.handlerRequest(request.join(' '))
  },
  css: css,
  main() {
    // Obtenemos la lista de monitores reales y válidos directamente desde Astal
    const monitors = app.get_monitors();

    if (monitors && monitors.length > 0) {
      const primaryMonitor = monitors[0]; // El primer monitor detectado por la Layer Shell
      monitors.map((gdkmonitor, index) => {
        // Bar(gdkmonitor);
        Bar(gdkmonitor);
        ChatWindow(gdkmonitor);
        RightPanel({ gdkmonitor, monitorIndex: index})
        NotificationPopup(gdkmonitor);
        // Launcher({gdkmonitor, monitorIndex: index})
        createDropdownWindow({
          namespace: "music",
          gdkmonitor: gdkmonitor,
          marginRight: 140, // Desplazamiento horizontal en píxeles desde la esquina derecha
          contentWidget: MusicBarContent() // Slot con el contenido que se va a renderizar en la card
      });
      });
      
      // monitors.map(Bar);

      
      // ChatWindow(primaryMonitor);
      // try {
      //   RightPanel(primaryMonitor);
      //   console.log("-> RightPanel inicializada con éxito.");
      // } catch (e) {
      //   console.error("CRÍTICO en RightPanel:", e);
      // }

      console.log("¡Monitores e instancias inicializadas con éxito!");
    } else {
      console.error("No se detectaron monitores a través de Astal.");
    }
  },
})
