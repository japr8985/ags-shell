import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";
import updateMetrics from "../updateMetrics";


export function GpuTemp() {
    const GPU_TEMP = 'nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits';
    let labelRef: Gtk.Label | null = null;

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        return updateMetrics(labelRef, GPU_TEMP, "°C")
    });
    return (
        <box class="hw-item" spacing={4} tooltipText="Temperatura de la GPU">
            <label class="hw-icon gpu-temp" label="" />
            <label
                class="hw-value"
                label="0°C"
                $={(self) => { labelRef = self; }}
            />
        </box>
    );
}


export function GpuStatus() {
    let gpuLabelRef: Gtk.Label | null = null;
    const GPU_USAGE_CMD = "nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits";

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
        return updateMetrics(gpuLabelRef, GPU_USAGE_CMD, "%");
    });

    return (
        <box class="hw-item" spacing={4} tooltipText="Uso de GPU">
            <label class="hw-icon gpu" label="󰢮 " />
            <label
                class="hw-value"
                label="0%" 
                $={(self) => { gpuLabelRef = self; }} 
            />
        </box>
    );
}