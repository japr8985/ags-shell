import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import { exec } from "ags/process";
import ChatWindow from "./widget/custtom-bar-nodes/ChatWindow"; // <-- Importamos la ventana
import { Gdk } from "ags/gtk4";
// import RightPanel from "./widget/custtom-bar-nodes/Right-panel";
import RightPanel from "./widget/panels/RightPanel/index";
import handlerCli from "./utils/handlerCli";


const scss = `./style/main.scss`;
const css = `/tmp/ags-style.css`;
try {
  exec(`sass ${scss} ${css}`);

} catch (err) {
  console.error("Error compilando SCSS:", err);
}
app.start({
  requestHandler(request, response) {
    // Lógica para alternar la visibilidad desde la terminal o atajos de Hyprland
    console.group(request)
    handlerCli.handlerRequest(request.join(' '))
    // if (request[0] === "toggle-right") {
    //   const win = app.get_window("right-panel"); // <-- Este string...
    //   if (win) {
    //     win.visible = !win.visible;
        
    //     response(`Visibilidad cambiada a: ${win.visible}`);
    //   } else {
    //     response("ERROR: No se encontró la ventana 'right-panel'");
    //   }
    // }
  },
  css: css,
  main() {
    // Obtenemos la lista de monitores reales y válidos directamente desde Astal
    const monitors = app.get_monitors();

    if (monitors && monitors.length > 0) {
      const primaryMonitor = monitors[0]; // El primer monitor detectado por la Layer Shell
      monitors.map((gdkmonitor, index) => {
        Bar(gdkmonitor);
        ChatWindow(gdkmonitor);
        RightPanel({ gdkmonitor, monitorIndex: index})
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
