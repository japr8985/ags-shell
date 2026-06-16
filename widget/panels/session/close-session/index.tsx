import { Gtk } from "ags/gtk4";
import { doCloseSession } from "./close";

export function CloseSession(): Gtk.Widget {
    return (<button
        class="session-btn"
        onClicked={() => doCloseSession()}>
            <label label="󰈆" />
    </button>) as any;
}