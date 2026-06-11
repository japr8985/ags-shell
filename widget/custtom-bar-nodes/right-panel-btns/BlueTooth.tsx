import { Gtk, Gdk } from "ags/gtk4"
import Bluetooth from "gi://AstalBluetooth?version=0.1"
import { createBinding } from "ags"
import { execAsync } from "ags/process"

export default function BluetoothToggle() {
  // Inicializamos el servicio nativo de Bluetooth de Astal
  const bluetooth = Bluetooth.get_default();
    
  return (
    <button 
      // El estilo CSS del botón escucha de forma reactiva la propiedad de energía en C
      class={createBinding(bluetooth, "is-powered")(() => Bluetooth.get_default()?.is_powered ? "toggle-card active" : "toggle-card")} 
      hexpand
    >
      <box 
        orientation={Gtk.Orientation.VERTICAL} 
        spacing={6} 
        valign={Gtk.Align.CENTER}

        $={(self) => {
          const gesture = new Gtk.GestureClick();
          gesture.set_button(0); // Captura botones del ratón
          
          gesture.connect("pressed", () => {
            const currentButton = gesture.get_current_button();
            
            if (currentButton === Gdk.BUTTON_PRIMARY) {
              // CLICK IZQUIERDO: Conmutamos usando la CLI de BlueZ de forma blindada
              // La propiedad 'is_powered' (de solo lectura) nos sirve perfectamente para saber el estado actual
              const currentState = bluetooth.is_powered;
              const targetCommand = currentState ? "bluetoothctl power off" : "bluetoothctl power on";
              
              execAsync(["bash", "-c", targetCommand])
                .catch(err => console.error(`Error al conmutar Bluetooth: ${err}`));
              
            } else if (currentButton === Gdk.BUTTON_SECONDARY) {
              // CLICK DERECHO: Desplegar lista de dispositivos disponibles
              showBluetoothMenu(self, bluetooth);
            }
          });
          
          self.add_controller(gesture);
        }}
      >
        {/* El icono cambia si el adaptador está encendido o apagado */}
        <label 
          class="toggle-icon" 
          label={createBinding(bluetooth, "is-powered")(() => bluetooth.is_powered ? "󰂯" : "󰂲")} 
        />
        <label class="toggle-title" label="Bluetooth" />
      </box>
    </button>
  ) as any;
}

function showBluetoothMenu(relativeWidget: Gtk.Widget, bluetooth: any) {
  const popover = new Gtk.Popover();
  popover.set_parent(relativeWidget);

  const listBox = new Gtk.Box({ 
    orientation: Gtk.Orientation.VERTICAL, 
    spacing: 6,
    css_classes: ["bluetooth-popover-menu"]
  });

  if (!bluetooth.is_powered) {
    listBox.append(new Gtk.Label({ label: "Bluetooth apagado", css_classes: ["popover-empty-label"] }));
  } else {
    const devices = bluetooth.get_devices();

    if (devices.length === 0) {
      listBox.append(new Gtk.Label({ label: "Buscando dispositivos..." }));
    } else {
      devices.forEach((device: any) => {
        const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
        
        // Formateamos el string con el icono correspondiente si está conectado o no
        const labelText = device.connected ? `󰂱  ${device.name || device.alias}` : `󰂯  ${device.name || device.alias}`;
        
        const deviceBtn = new Gtk.Button({ 
          label: labelText,
          hexpand: true,
          css_classes: device.connected ? ["bluetooth-device-btn", "connected"] : ["bluetooth-device-btn"]
        });

        deviceBtn.connect("clicked", () => {
          popover.popdown();
          
          // REEMPLAZO CON BLUETOOTHCTL: Mandamos la MAC-Address directo a la CLI de Linux
          const action = device.connected ? "disconnect" : "connect";
          const macAddress = device.address; // Astal Bluetooth nos provee la MAC en esta propiedad
          
          execAsync(["bash", "-c", `bluetoothctl ${action} ${macAddress}`])
            .then(() => console.log(`[BluetoothCTL] Ejecutado ${action} hacia ${macAddress}`))
            .catch(err => console.error(`Error en bluetoothctl: ${err}`));
        });

        row.append(deviceBtn);
        listBox.append(row);
      });
    }
  }

  // Separador estético
  listBox.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL }));

  // BOTÓN AVANZADO: Abre bluetoothctl interactivo en una terminal flotante de Hyprland
  const managerBtn = new Gtk.Button({ 
    label: "Abrir Consola Bluetooth...", 
    css_classes: ["bluetooth-manager-btn"] 
  });
  
  managerBtn.connect("clicked", () => {
    popover.popdown();
    
    // Cambia 'kitty' por tu emulador de terminal favorito (alacritty, foot, ghostty, etc.)
    // Usamos el dispatch 'vlan' u 'on_demand' flotante de tu Hyprland
    // Al usar la sintaxis interna de bluetoothctl, la terminal flotante se abrirá 
    // E INICIARÁ el escaneo activo de dispositivos nuevos en tu cuarto de inmediato
    const cmd = "hyprctl dispatch exec '[float; size 700 500]' kitty bluetoothctl -- scan on";
    
    execAsync(["bash", "-c", cmd])
      .catch(err => console.error(`No se pudo levantar la terminal interactiva: ${err}`));
  });

  listBox.append(managerBtn);

  popover.set_child(listBox);
  popover.popup();
}