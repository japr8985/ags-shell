import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";
import updateMetrics from "../updateMetrics";



export default function RamStatus() {
    let ramLabelRef: Gtk.Label | null = null;
    
    const RAM_CMD = "free | awk '/^Mem/ {print int(($3/$2) * 100)}'";

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        return updateMetrics(ramLabelRef, RAM_CMD)
    })
    return (<box class="hw-item" spacing={2} tooltipText="Memoria RAM Usada">
        <label class="hw-icon ram" label="󰘚" />
        <label
            class="hw-value"
            label="0%"
            $={(self) => { ramLabelRef = self; }}
        />
    </box>);
}