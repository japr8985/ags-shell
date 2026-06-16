import { Gtk } from "ags/gtk4";
import { doShutdown } from "./powerOff";

export function PowerOffBtn(): Gtk.Widget {
    return (<button
        class="session-btn power-btn"
        onClicked={() => doShutdown()}>
            <label label="󰐥" />
        </button>) as any
}