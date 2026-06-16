import { Gtk } from "ags/gtk4"
import AstalNotifd from "gi://AstalNotifd?version=0.1";

const notifd = AstalNotifd.get_default();

export function getNotificationIcon(appNameOrIcon: string): string {
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
    <box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
      class="notification-list"
      vexpand
      $={(self) => {

        const syncNotifications = () => {
          // 1. Limpieza de hijos de C
          let child = self.get_first_child();
          while (child) {
            const next = child.get_next_sibling();
            self.remove(child);
            child = next;
          }

          const rawNotifications = notifd.notifications;

          // ESTADO VACÍO
          // ==========================================
          // REEMPLAZAR ÚNICAMENTE EL BLOQUE DEL ESTADO VACÍO:
          // ==========================================
          if (!rawNotifications || rawNotifications.length === 0) {
            // 1. Contenedor principal con expansión total y centrado simétrico
            const emptyBox = new Gtk.Box({
              orientation: Gtk.Orientation.VERTICAL,
              spacing: 14, // Un poco más de aire entre el icono y el texto
              hexpand: true,
              vexpand: true
            });
            emptyBox.set_valign(Gtk.Align.CENTER);
            emptyBox.set_halign(Gtk.Align.CENTER);

            // 2. Icono con clase CSS dedicada y opacidad baja para ese look elegante
            const emptyIcon = new Gtk.Label({
              label: "󰂛",
              opacity: 0.35
            });
            emptyIcon.get_style_context().add_class("empty-notif-icon");
            // Opcional: Si quieres forzar el tamaño directo por código antes del CSS
            emptyIcon.set_css_classes(["empty-notif-icon"]);

            // 3. Texto descriptivo refinado
            const emptyText = new Gtk.Label({
              label: "Todo al día", // Cambiado por un término más minimalista, o mantén "Bandeja limpia"
              opacity: 0.5
            });
            emptyText.get_style_context().add_class("empty-notif-text");

            // Ensamblamos el layout centrado
            emptyBox.append(emptyIcon);
            emptyBox.append(emptyText);
            self.append(emptyBox);
            return;
          }

          // 2. ORDENACIÓN EN PILA
          const stackedNotifications = [...rawNotifications].reverse();

          // 3. CONSTRUCCIÓN IMPERATIVA USANDO SETTERS NATIVOS
          stackedNotifications.forEach((n) => {
            const timeString = new Date(n.time * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });

            const iconLabel = getNotificationIcon(n.appName || n.appIcon);

            // Contenedor de la tarjeta
            const card = new Gtk.Box({
              orientation: Gtk.Orientation.HORIZONTAL,
              spacing: 12
            });
            card.get_style_context().add_class("notif-card");

            // Icono
            const icon = new Gtk.Label({ label: iconLabel });
            icon.get_style_context().add_class("notif-icon");
            icon.set_valign(Gtk.Align.CENTER);

            // Caja central de textos (Compacta)
            const textContainer = new Gtk.Box({
              orientation: Gtk.Orientation.VERTICAL,
              spacing: 2,
              hexpand: true
            });
            textContainer.set_valign(Gtk.Align.CENTER); // FIX: Asignación por setter nativo

            const title = new Gtk.Label({
              label: n.summary || "",
              wrap: true
            });
            title.get_style_context().add_class("notif-title");
            title.set_halign(Gtk.Align.START); // FIX: Asignación por setter nativo

            const body = new Gtk.Label({
              label: n.body || "",
              wrap: true
            });
            body.get_style_context().add_class("notif-body");
            body.set_halign(Gtk.Align.START); // FIX: Asignación por setter nativo

            textContainer.append(title);
            textContainer.append(body);

            // Contenedor derecho de acciones
            const actionContainer = new Gtk.Box({
              orientation: Gtk.Orientation.VERTICAL,
              spacing: 4
            });
            actionContainer.set_valign(Gtk.Align.CENTER); // FIX: Asignación por setter nativo

            const time = new Gtk.Label({ label: timeString });
            time.get_style_context().add_class("notif-time");

            const dismissBtn = new Gtk.Button({
              child: new Gtk.Label({ label: "󰅖" })
            });
            dismissBtn.get_style_context().add_class("notif-dismiss-btn");
            dismissBtn.set_valign(Gtk.Align.CENTER); // FIX: Asignación por setter nativo
            dismissBtn.set_halign(Gtk.Align.CENTER); // FIX: Asignación por setter nativo
            dismissBtn.connect("clicked", () => n.dismiss());

            actionContainer.append(time);
            actionContainer.append(dismissBtn);

            // Ensamblaje
            card.append(icon);
            card.append(textContainer);
            card.append(actionContainer);

            self.append(card);
          });
        };

        if ('dont_disturb' in notifd) {
          (notifd as any).dont_disturb = true;
        }

        // Arranque inicial y conexión
        syncNotifications();
        notifd.connect("notify::notifications", () => syncNotifications());
      }}
    />
  ) as any;
}
