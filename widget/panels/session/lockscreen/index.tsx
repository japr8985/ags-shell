import { Gtk } from "ags/gtk4";
import { doLockScreen } from "./lockScreen";

export function LockScreen(): Gtk.Widget {
    return (<button 
        class="session-btn"
        onClicked={() => doLockScreen()}>
            <label label="󰌾" />
    </button>) as any;
}