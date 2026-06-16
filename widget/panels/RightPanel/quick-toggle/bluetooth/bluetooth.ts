// widget/panels/session/bluetooth/bluetooth.ts
import { Gtk, Gdk } from "ags/gtk4";
import Bluetooth from "gi://AstalBluetooth?version=0.1";
import { execAsync } from "ags/process";

export const bluetooth = Bluetooth.get_default();

/**
 * Conmuta el estado de energía del adaptador Bluetooth usando bluetoothctl
 */
export function toggleBluetooth() {
    if (!bluetooth) return;
    
    const targetCommand = bluetooth.is_powered ? "bluetoothctl power off" : "bluetoothctl power on";
    
    execAsync(["bash", "-c", targetCommand])
        .catch(err => console.error(`[Bluetooth] Error al conmutar: ${err}`));
}

/**
 * Despliega el Popover nativo con los dispositivos emparejados/detectados
 */
export function showBluetoothMenu(relativeWidget: Gtk.Widget) {
    if (!bluetooth) return;

    const popover = new Gtk.Popover();
    popover.set_parent(relativeWidget);

    const listBox = new Gtk.Box({ 
        orientation: Gtk.Orientation.VERTICAL, 
        spacing: 6,
        css_classes: ["bluetooth-popover-menu"]
    });

    if (!bluetooth.is_powered) {
        listBox.append(new Gtk.Label({ 
            label: "Bluetooth apagado", 
            css_classes: ["popover-empty-label"] 
        }));
    } else {
        const devices = bluetooth.get_devices();

        if (devices.length === 0) {
            listBox.append(new Gtk.Label({ label: "Buscando dispositivos..." }));
        } else {
            devices.forEach((device: any) => {
                const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
                
                const labelText = device.connected 
                    ? `󰂱  ${device.name || device.alias}` 
                    : `󰂯  ${device.name || device.alias}`;
                
                const deviceBtn = new Gtk.Button({ 
                    label: labelText,
                    hexpand: true,
                    css_classes: device.connected ? ["bluetooth-device-btn", "connected"] : ["bluetooth-device-btn"]
                });

                deviceBtn.connect("clicked", () => {
                    popover.popdown();
                    
                    const action = device.connected ? "disconnect" : "connect";
                    const macAddress = device.address;
                    
                    execAsync(["bash", "-c", `bluetoothctl ${action} ${macAddress}`])
                        .then(() => console.log(`[BluetoothCTL] ${action} exitoso hacia ${macAddress}`))
                        .catch(err => console.error(`Error en bluetoothctl: ${err}`));
                });

                row.append(deviceBtn);
                listBox.append(row);
            });
        }
    }

    // Separador estético
    listBox.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL }));

    // BOTÓN DE GESTIÓN AVANZADA: Consola interactiva en terminal flotante de Hyprland
    const managerBtn = new Gtk.Button({ 
        label: "Abrir Consola Bluetooth...", 
        css_classes: ["bluetooth-manager-btn"] 
    });
    
    managerBtn.connect("clicked", () => {
        popover.popdown();
        
        // Ejecutamos Kitty (o tu terminal por defecto) en modo flotante forzado por Hyprland
        const cmd = "hyprctl dispatch exec '[float; size 700 500]' kitty bluetoothctl -- scan on";
        
        execAsync(["bash", "-c", cmd])
            .catch(err => console.error(`No se pudo levantar la terminal interactiva: ${err}`));
    });

    listBox.append(managerBtn);

    popover.set_child(listBox);
    popover.popup();
}