import { Gtk } from "ags/gtk4";
import { changeWallpaper } from "./wallpaper";

export function Wallpaper() {
    return (<button
        class="wallpaper-btn"
        onClicked={() => changeWallpaper()}
        $={(self) => {
            const gesture = new Gtk.GestureClick();
            gesture.set_button(0);

            gesture.connect("released", (g, n_press, x, y) => {
                // Obtenemos qué botón físico disparó el evento (1 = Izquierdo, 3 = Derecho)
                const currentButton = g.get_current_button();
                changeWallpaper(currentButton);
            });
            self.add_controller(gesture)
        }}>
            <label label="" />
    </button>);
}