import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";


export default function updateMetrics(ref: Gtk.Label | null, cmd: string, unit: string = '%'): boolean {
    execAsync(['bash', '-c', cmd])
    .then((stdout) => {
        if (ref) ref.label = `${stdout.trim()}${unit}`;
    })
    .catch((err) => console.log('Error CPU:', err));
    return true;
}