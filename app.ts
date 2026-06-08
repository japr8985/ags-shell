import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import { exec } from "ags/process";
import ChatWindow from "./widget/custtom-bar-nodes/ChatWindow"; // <-- Importamos la ventana
import { Gdk } from "ags/gtk4";

const scss = `./style/main.scss`;
const css = `/tmp/ags-style.css`;
try {
    exec(`sass ${scss} ${css}`);
    
} catch (err) {
    console.error("Error compilando SCSS:", err);
}
app.start({
  css: css,
  main() {
    const display = Gdk.Display.get_default();
    const monitors = display?.get_monitors();
    const primaryMonitor = monitors[0];
    app.get_monitors().map(Bar)
    ChatWindow(primaryMonitor);
  },
})
