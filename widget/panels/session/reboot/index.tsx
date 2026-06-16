import { Gtk } from "ags/gtk4";
import { doReboot } from "./Reboot";

export function RebootBtn(): Gtk.Widget {
    return (
        <button 
            class="action-btn"
            onClicked={() => doReboot()}>
                <label label="󰑓" />
        </button>
    ) as any
}