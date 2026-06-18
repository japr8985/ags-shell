// widget/panels/RightPanel/tabs/tabs-content/notifd/index.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { notifd, dismissNotification, clearAllNotifications } from "./notifd";

/**
 * Mapeo inteligente de iconos según la aplicación (De tu versión original)
 */
function getNotificationIcon(appNameOrIcon: string): string {
    if (!appNameOrIcon) return "󰂚";
    const name = appNameOrIcon.toLowerCase();
    if (name.includes("steam")) return "󰓓";
    if (name.includes("discord")) return "󰙯";
    if (name.includes("telegram")) return "󰔁";
    if (name.includes("spotify")) return "󰓇";
    if (name.includes("firefox") || name.includes("chrome") || name.includes("brave")) return "󰖟";
    if (name.includes("terminal") || name.includes("kitty") || name.includes("foot")) return "󰞷";
    if (name.includes("update") || name.includes("dnf") || name.includes("fedora")) return "󰚰";
    return "󰂚";
}

export function renderNotificationList(): Gtk.Widget {
    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={12} class="notif-tab-container" vexpand={true} hexpand={true}>
            
            {/* 1. HEADER REPOSITORIO (Contador y Botón arriba fijos) */}
            <box 
                orientation={Gtk.Orientation.HORIZONTAL} 
                class="notif-header-bar"
                hexpand={true}
                visible={createBinding(notifd, "notifications")((list) => list && list.length > 0)}
            >
                <label 
                    class="notif-count-label" 
                    halign={Gtk.Align.START} 
                    hexpand={true} 
                    label={createBinding(notifd, "notifications")((list) => {
                        const count = list ? list.length : 0;
                        if (count === 0) return "No hay notificaciones";
                        if (count === 1) return "1 notificación";
                        return `${count} notificaciones`;
                    })} 
                />
                <button class="notif-clear-all-btn" onClicked={() => clearAllNotifications()}>
                    <label label="󰎟  Limpiar Todo" />
                </button>
            </box>

            {/* 2. CONTENEDOR DINÁMICO DE TARJETAS (Implementación original robusta) */}
            <box 
                orientation={Gtk.Orientation.VERTICAL} 
                spacing={10} 
                vexpand={true} 
                hexpand={true}
                $={(self) => {
                    const syncNotifications = () => {
                        // Limpieza segura mediante punteros de hermanos de C (Tu código original)
                        let child = self.get_first_child();
                        while (child) {
                            const next = child.get_next_sibling();
                            self.remove(child);
                            child = next;
                        }

                        const rawNotifications = notifd.notifications;

                        // ESTADO VACÍO ZEN
                        if (!rawNotifications || rawNotifications.length === 0) {
                            const emptyBox = new Gtk.Box({
                                orientation: Gtk.Orientation.VERTICAL,
                                spacing: 14,
                                hexpand: true,
                                vexpand: true
                            });
                            emptyBox.set_valign(Gtk.Align.CENTER);
                            emptyBox.set_halign(Gtk.Align.CENTER);

                            const emptyIcon = new Gtk.Label({ label: "󰂛", opacity: 0.35 });
                            emptyIcon.set_css_classes(["empty-notif-icon"]);

                            const emptyText = new Gtk.Label({ label: "Todo al día", opacity: 0.5 });
                            emptyText.set_css_classes(["empty-notif-text"]);

                            emptyBox.append(emptyIcon);
                            emptyBox.append(emptyText);
                            self.append(emptyBox);
                            return;
                        }

                        // ORDENACIÓN EN PILA (Las más nuevas arriba)
                        const stackedNotifications = [...rawNotifications].reverse();

                        // CONSTRUCCIÓN IMPERATIVA ULTRA ESTABLE
                        stackedNotifications.forEach((n) => {
                            const timeString = new Date(n.time * 1000).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            });

                            const iconLabel = getNotificationIcon(n.appName || n.appIcon);

                            // Maquetación de la tarjeta
                            const card = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 12 });
                            card.get_style_context().add_class("notif-card");

                            // Icono Dinámico
                            const icon = new Gtk.Label({ label: iconLabel });
                            icon.get_style_context().add_class("notif-icon");
                            icon.set_valign(Gtk.Align.CENTER);

                            // Cuerpo de Texto
                            const textContainer = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 2, hexpand: true });
                            textContainer.set_valign(Gtk.Align.CENTER);

                            const title = new Gtk.Label({ label: n.summary || "", wrap: true });
                            title.get_style_context().add_class("notif-title");
                            title.set_halign(Gtk.Align.START);

                            const body = new Gtk.Label({ label: n.body || "", wrap: true });
                            body.get_style_context().add_class("notif-body");
                            body.set_halign(Gtk.Align.START);

                            textContainer.append(title);
                            textContainer.append(body);

                            // Botones de acción y hora (Derecha)
                            const actionContainer = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 });
                            actionContainer.set_valign(Gtk.Align.CENTER);

                            const time = new Gtk.Label({ label: timeString });
                            time.get_style_context().add_class("notif-time");

                            const dismissBtn = new Gtk.Button({ child: new Gtk.Label({ label: "󰅖" }) });
                            dismissBtn.get_style_context().add_class("notif-dismiss-btn");
                            dismissBtn.set_valign(Gtk.Align.CENTER);
                            dismissBtn.set_halign(Gtk.Align.CENTER);
                            
                            // Acción del botón cerrar individual
                            dismissBtn.connect("clicked", () => dismissNotification(n.id));

                            actionContainer.append(time);
                            actionContainer.append(dismissBtn);

                            // Ensamblaje final de la fila
                            card.append(icon);
                            card.append(textContainer);
                            card.append(card.get_first_child() ? actionContainer : actionContainer); 
                            
                            self.append(card);
                        });
                    };

                    // Sincronización nativa por señales de GObject (El secreto del éxito)
                    syncNotifications();
                    notifd.connect("notify::notifications", () => syncNotifications());
                }}
            />
        </box>
    ) as any;
}