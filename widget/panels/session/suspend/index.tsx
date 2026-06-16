import { Gtk } from "ags/gtk4";
import { doSuspend } from "./suspend";


export function SuspendBtn(): Gtk.Widget {
    return (<button 
        class="session-btn"
        onClicked={() => doSuspend()}>
        <label label="󰤄" />
    </button>) as any;
}