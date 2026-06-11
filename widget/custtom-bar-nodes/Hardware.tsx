import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process"; // Usamos el ejecutor asíncrono nativo que ya tienes
import GLib from "gi://GLib?version=2.0";

export default function Hardware() {
    // Creamos referencias mutables para los labels de GTK
    let cpuLabelRef: Gtk.Label | null = null;
    let ramLabelRef: Gtk.Label | null = null;

    // Comandos puros en Bash que devuelven solo el número entero
    const RAM_CMD = "free | awk '/^Mem/ {print int(($3/$2) * 100)}'";
    const CPU_CMD = "top -bn1 | grep Cpu | sed 's/,/./g' | awk '{print int($2)}'";

    // Función asíncrona que ejecuta los comandos y actualiza los textos en GTK
    const updateMetrics = () => {
        // 1. Ejecutar y actualizar RAM
        execAsync(["bash", "-c", RAM_CMD])
            .then((stdout) => {
                if (ramLabelRef) ramLabelRef.label = `${stdout.trim()}%`;
            })
            .catch((err) => console.error("Error RAM:", err));

        // 2. Ejecutar y actualizar CPU
        execAsync(["bash", "-c", CPU_CMD])
            .then((stdout) => {
                if (cpuLabelRef) cpuLabelRef.label = `${stdout.trim()}%`;
            })
            .catch((err) => console.error("Error CPU:", err));

        // Retornamos true para que GLib sepa que debe seguir repitiendo este ciclo
        return true;
    };

    // Disparamos el bucle nativo de C: ejecuta cada 2000 milisegundos (2 segundos)
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, updateMetrics);

    return (
        <box class="hardware-monitor" spacing={12} orientation={Gtk.Orientation.HORIZONTAL}>

            {/* Indicador de CPU */}
            <box class="hw-item" spacing={4} tooltipText="Uso de CPU">
                <label class="hw-icon cpu" label=" " />
                <label
                    class="hw-value"
                    label="0%" // Valor inicial por defecto
                    $={(self) => { cpuLabelRef = self; }} // Capturamos el widget real en memoria
                />
            </box>
            <box class="hw-item" spacing={2} tooltipText="Memoria RAM Usada">
                <label class="hw-icon ram" label="󰘚" /> {/* Glifo alternativo ultra-compatible */}
                <label
                    class="hw-value"
                    label="0%"
                    $={(self) => { ramLabelRef = self; }}
                />
            </box>

        </box>
    );
}