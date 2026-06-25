import { Gtk } from "ags/gtk4";

import RamStatus from "./ram/RamStatus";
import { GpuTemp } from "./gpu/GpuStatus";
import { CpuStatus, CpuTemp } from "./cpu/CpuStatus";

export function Hardware() {
    return (<box class="hardware-monitor" spacing={12} orientation={Gtk.Orientation.HORIZONTAL}>

        {/* Indicador de CPU */}
        <CpuStatus />
        <CpuTemp />
        <RamStatus />
        <GpuTemp />

    </box>);
}