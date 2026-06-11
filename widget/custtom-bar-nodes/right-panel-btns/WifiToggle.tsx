import { Gtk, Gdk } from "ags/gtk4"
import Network from "gi://AstalNetwork?version=0.1"
import { createBinding } from "ags"

export default function WifiToggle() {
  // Inicializamos el servicio nativo de red de Astal
  const network = Network.get_default();
  const wifi = network.wifi;

  return (
    <button 
      // El estilo del botón ahora depende DIRECTAMENTE del estado real del hardware en C
      class={createBinding(wifi, "enabled")(() => wifi.enabled ? "toggle-card active" : "toggle-card")} 
      hexpand
    >
      <box 
        orientation={Gtk.Orientation.VERTICAL} 
        spacing={6} 
        valign={Gtk.Align.CENTER}
        $={(self) => {
          const gesture = new Gtk.GestureClick();
          gesture.set_button(0);
          
          gesture.connect("pressed", () => {
            const currentButton = gesture.get_current_button();
            
            if (currentButton === Gdk.BUTTON_PRIMARY) {
              // CLICK IZQUIERDO: Conmutación nativa de hardware mediante DBus (0 lag, 0 Bash)
              wifi.enabled = !wifi.enabled;
              
            } else if (currentButton === Gdk.BUTTON_SECONDARY) {
              // CLICK DERECHO: Desplegar el menú de redes disponibles
              showWifiMenu(self, wifi);
            }
          });
          
          self.add_controller(gesture);
        }}
      >
        {/* El icono cambia dinámicamente si está apagado o encendido */}
        <label 
          class="toggle-icon" 
          label={createBinding(wifi, "enabled")(() => wifi.enabled ? "󰖩" : "󰖪")} 
        />
        <label class="toggle-title" label="Wi-Fi" />
      </box>
    </button>
  ) as any;
}

// // Función auxiliar para construir el menú flotante (Popover) de redes disponibles
// function showWifiMenu(relativeWidget: Gtk.Widget, wifi: Network.Wifi) {
//   const popover = new Gtk.Popover();
//   popover.set_parent(relativeWidget);

//   const listBox = new Gtk.Box({ 
//     orientation: Gtk.Orientation.VERTICAL, 
//     spacing: 6,
//     class: "wifi-popover-menu"
//   });

//   // Obtenemos los Access Points (redes) escaneados por NetworkManager
//   const aps = wifi.get_access_points();
  
//   // Filtrar redes duplicadas por SSID y ordenarlas por intensidad de señal
//   const uniqueAps = aps
//     .filter((ap, index, self) => ap.ssid && self.findIndex(t => t.ssid === ap.ssid) === index)
//     .sort((a, b) => b.strength - a.strength);

//   if (uniqueAps.length === 0) {
//     listBox.append(new Gtk.Label({ label: "Buscando redes..." }));
//   } else {
//     uniqueAps.forEach(ap => {
//       const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
//       const connectBtn = new Gtk.Button({ 
//         label: `${ap.ssid} (${ap.strength}%)`,
//         hexpand: true,
//         class: "wifi-network-btn"
//       });

//       connectBtn.connect("clicked", () => {
//         popover.popdown();
//         promptWifiPassword(ap);
//       });

//       row.append(connectBtn);
//       listBox.append(row);
//     });
//   }

//   popover.set_child(listBox);
//   popover.popup();
// }

// Ventana emergente básica de GTK para solicitar la contraseña si es requerido
function promptWifiPassword(ap: Network.AccessPoint) {
  // Si la red es abierta, conectamos directo
  if (ap.wpa_flags === 0 && ap.rsn_flags === 0) {
    wifiConnect(ap.ssid, "");
    return;
  }

  const dialog = new Gtk.Dialog({ title: `Conectar a ${ap.ssid}`, modal: true });
  const contentArea = dialog.get_content_area();
  
  const label = new Gtk.Label({ label: "Introduce la contraseña de la red:" });
  const entry = new Gtk.Entry({ visibility: false, placeholder_text: "Contraseña" }); // Oculta los caracteres

  dialog.add_button("Cancelar", Gtk.ResponseType.CANCEL);
  dialog.add_button("Conectar", Gtk.ResponseType.OK);

  contentArea.append(label);
  contentArea.append(entry);

  dialog.connect("response", (_d, responseId) => {
    if (responseId === Gtk.ResponseType.OK) {
      wifiConnect(ap.ssid, entry.get_text());
    }
    dialog.destroy();
  });

  dialog.present();
}

// Ejecución final de la conexión a través de nmcli de forma segura
function wifiConnect(ssid: string, password?: string) {
  const cmd = password 
    ? `nmcli device wifi connect "${ssid}" password "${password}"`
    : `nmcli device wifi connect "${ssid}"`;
    
  execAsync(["bash", "-c", cmd])
    .then(() => console.log(`Conectado con éxito a ${ssid}`))
    .catch(err => console.error(`Error de conexión: ${err}`));
}

// Función auxiliar para construir el menú flotante (Popover) de redes disponibles
function showWifiMenu(relativeWidget: Gtk.Widget, wifi: any) {
  const popover = new Gtk.Popover();
  popover.set_parent(relativeWidget);

  // CORREGIDO: Usamos css_classes con un Array de strings en lugar de class
  const listBox = new Gtk.Box({ 
    orientation: Gtk.Orientation.VERTICAL, 
    spacing: 6,
    css_classes: ["wifi-popover-menu"]
  });

  const aps = wifi.get_access_points();
  
  const uniqueAps = aps
    .filter((ap: any, index: number, self: any[]) => ap.ssid && self.findIndex(t => t.ssid === ap.ssid) === index)
    .sort((a: any, b: any) => b.strength - a.strength);

  if (uniqueAps.length === 0) {
    listBox.append(new Gtk.Label({ label: "Buscando redes..." }));
  } else {
    uniqueAps.forEach((ap: any) => {
      const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
      
      // CORREGIDO: Para botones nativos de Gtk4, pasamos las clases en css_classes
      const connectBtn = new Gtk.Button({ 
        label: `${ap.ssid} (${ap.strength}%)`,
        hexpand: true,
        css_classes: ["wifi-network-btn"]
      });

      connectBtn.connect("clicked", () => {
        popover.popdown();
        promptWifiPassword(ap);
      });

      row.append(connectBtn);
      listBox.append(row);
    });
  }

  popover.set_child(listBox);
  popover.popup();
}