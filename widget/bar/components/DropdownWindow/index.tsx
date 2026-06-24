// widget/bar/components/DropdownWindow.tsx
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { registerPopup } from "../../../launcher/popupManager";


export interface DropdownWindowProps {
    namespace: string;
    gdkmonitor: Gdk.Monitor;
    marginRight: number;
    contentWidget: Gtk.Widget;
}

export function createDropdownWindow({ namespace, gdkmonitor, marginRight, contentWidget }: DropdownWindowProps) {
    const windowName = `${namespace}-dropdown-window`;

    // 1. Instanciamos la ventana flotante en su estado más básico
    const win = new Astal.Window({
        name: windowName,
        gdkmonitor: gdkmonitor,
        css_classes: ['ChatWindow'],
        anchor: Astal.WindowAnchor.TOP,
        exclusivity: Astal.Exclusivity.IGNORE,
        visible: false,
        application: app
    });

    // 2. Posicionamiento físico crudo
    win.margin_top = 50;   // Separación de la barra superior
    win.margin_right = marginRight; // Alineación con tu botón

    // 3. Contenedor estructural base (GtkBox puro)
    const cardBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        css_classes: ['chat-container']
    });

    // 4. Inyectamos el slot del contenido directo al árbol
    cardBox.append(contentWidget);
    win.set_child(cardBox);

    // 5. Registramos en el ciclo de vida de AGS
    app.add_window(win);
    registerPopup(namespace, win);

    return win;
}