import app from "ags/gtk4/app"
import style from "./style.scss"
import { exec } from "ags/process";
import RightPanel from "./widget/panels/RightPanel/index";
import handlerCli from "./utils/handlerCli";
import NotificationPopup from "./widget/popups/notification";
import { createDropdownWindow } from "./widget/bar/components/DropdownWindow";
import { MusicBarContent } from "./widget/bar/components/Music";
import Bar from "./widget/bar/index";
import { ChatWindow } from "./widget/bar/components/AIChat/ChatWindow";


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
    
    const monitors = app.get_monitors();

    if (monitors && monitors.length > 0) {
      const primaryMonitor = monitors[0]; // El primer monitor detectado por la Layer Shell
      monitors.map((gdkmonitor, index) => {
        Bar(gdkmonitor);
        ChatWindow(gdkmonitor);
        RightPanel({ gdkmonitor, monitorIndex: index })
        NotificationPopup(gdkmonitor);
        createDropdownWindow({
          namespace: "music",
          gdkmonitor: gdkmonitor,
          marginRight: 140, 
          contentWidget: MusicBarContent()
        });
      });

      console.log("¡Monitores e instancias inicializadas con éxito!");
    } else {
      console.error("No se detectaron monitores a través de Astal.");
    }
  },
})
