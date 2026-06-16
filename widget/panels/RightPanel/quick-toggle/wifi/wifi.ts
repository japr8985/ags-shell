import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import AstalNetwork from "gi://AstalNetwork?version=0.1";

const network = AstalNetwork.get_default();
export const wifi = network.wifi;

export function toggleWifi() {
    if (wifi) {
        wifi.enabled = !wifi.enabled;
    }
}

export function showWifiMenu(relativeWidget: Gtk.Widget) {
    if (!wifi) return;

    const popover = new Gtk.Popover();
    popover.set_parent(relativeWidget);

    const listBox = new Gtk.Box({ 
        orientation: Gtk.Orientation.VERTICAL, 
        spacing: 6,
        css_classes: ["wifi-popover-menu"]
    });

    const aps = wifi.get_access_points();
    
    // Filtrar duplicados y ordenar por fuerza de señal
    const uniqueAps = aps
        .filter((ap: any, index: number, self: any[]) => ap.ssid && self.findIndex(t => t.ssid === ap.ssid) === index)
        .sort((a: any, b: any) => b.strength - a.strength);

    if (uniqueAps.length === 0) {
        listBox.append(new Gtk.Label({ label: "Buscando redes..." }));
    } else {
        uniqueAps.forEach((ap: any) => {
            const row = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
            
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
function promptWifiPassword(ap: any) {
    if (ap.wpa_flags === 0 && ap.rsn_flags === 0) {
        wifiConnect(ap.ssid, "");
        return;
    }

    const dialog = new Gtk.Dialog({ title: `Conectar a ${ap.ssid}`, modal: true });
    const contentArea = dialog.get_content_area();
    
    const label = new Gtk.Label({ label: "Introduce la contraseña de la red:" });
    label.set_margin_bottom(10);
    
    const entry = new Gtk.Entry({ visibility: false, placeholder_text: "Contraseña" });

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

/**
 * Conexión final asíncrona mediante nmcli
 */
function wifiConnect(ssid: string, password?: string) {
    const cmd = password 
        ? `nmcli device wifi connect "${ssid}" password "${password}"`
        : `nmcli device wifi connect "${ssid}"`;
        
    execAsync(["bash", "-c", cmd])
        .then(() => console.log(`[NetworkManager] Conectado con éxito a ${ssid}`))
        .catch(err => console.error(`[NetworkManager] Error de conexión: ${err}`));
}