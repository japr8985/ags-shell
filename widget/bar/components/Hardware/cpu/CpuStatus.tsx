import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";
import updateMetrics from "../updateMetrics";



export function CpuStatus() {

    let cpuLabelRef: Gtk.Label | null = null;

    const CPU_CMD = "top -bn1 | grep Cpu | sed 's/,/./g' | awk '{print int($2)}'";
    
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        return updateMetrics(cpuLabelRef, CPU_CMD);
    });

    return (<box class="hw-item" spacing={2} tooltipText="Uso de CPU">
        <label class="hw-icon cpu" label=" " />
        <label
            class="hw-value"
            label="0%" // Valor inicial por defecto
            $={(self) => { cpuLabelRef = self; }} // Capturamos el widget real en memoria
        />
    </box>)

}

export function CpuTemp() {
    let cpuLabelRef: Gtk.Label | null = null;
    
    const CPU_CMD = "cat /sys/class/thermal/thermal_zone0/temp | awk '{print int($1/1000)}'";
    
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        return updateMetrics(cpuLabelRef, CPU_CMD, "°C");
    });

    return (<box class="hw-item" spacing={2} tooltipText="Temp de CPU">
        <label class="hw-icon cpu" label="" />
        <label
            class="hw-value"
            label="0" // Valor inicial por defecto
            $={(self) => { cpuLabelRef = self; }} // Capturamos el widget real en memoria
        />
    </box>)
}