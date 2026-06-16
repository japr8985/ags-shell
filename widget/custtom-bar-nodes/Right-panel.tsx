import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import GLib from "gi://GLib?version=2.0"
import { execAsync } from "ags/process"
import AstalIo from "gi://AstalIO?version=0.1"
import { createBinding } from "ags";
// import QuickToggles from "./right-panel-btns/QuickToggles"
import Notifd from "gi://AstalNotifd"

import { RebootBtn } from "../panels/session/reboot"
import { PowerOffBtn } from "../panels/session/poweroff"
import { SuspendBtn } from "../panels/session/suspend"
import { LockScreen } from "../panels/session/lockscreen"
import { CloseSession } from "../panels/session/close-session"
import { AudioTabContent } from "../panels/tabs-content/audio/index";

const notifd = Notifd.get_default();
const { Variable } = AstalIo

interface RightSideBarProps {
  gdkmonitor: Gdk.Monitor;
  monitorIndex: number;
}

// Mapa para gestionar instancias limpias por monitor
const rightPanelInstances = new Map<number, any>();

export function toggleRightPanel(monitorIndex = 0) {
  const panel = rightPanelInstances.get(monitorIndex);
  if (panel) {
    const isVisible = panel.get_visible();
    const nextState = !isVisible;

    panel.visible = nextState;

    if (nextState) {
      panel.set_property('keymode', Astal.Keymode.ON_DEMAND);
      panel.present();
    } else {
      panel.set_property('keymode', Astal.Keymode.NONE);
    }
  }
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

export default function RightPanel({ gdkmonitor, monitorIndex }: RightSideBarProps) {
  const { TOP, BOTTOM, RIGHT } = Astal.WindowAnchor
  let uptimeLabel: Gtk.Label | null = null;

  // Usamos el estado activo reactivo de Faiyt para las pestañas
  const activeTab = Variable.new({ index: 0 });



  return (
    <window
      visible={false}
      name={`right-panel-${monitorIndex}`}
      namespace="right-panel"
      class="RightPanel"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={TOP | BOTTOM | RIGHT}
      application={app}
      $={(self) => {
        rightPanelInstances.set(monitorIndex, self);

        // Copiado de ArchEclipse: Si el mouse sale agresivamente del panel, se oculta suavemente
        // const motion = new Gtk.EventControllerMotion();
        // motion.connect("leave", () => {
        //   self.hide();
        //   self.set_property('keymode', Astal.Keymode.NONE);
        // });
        // self.add_controller(motion);
      }}
    >
      <box
        class="panel-container"
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
        widthRequest={360}
        heightRequest={900}
      >
        {/* BLOQUE 1: HEADER DE USUARIO */}
        {/* BLOQUE 1: HEADER DE USUARIO PERSONALIZADO */}
        <box class="panel-header" spacing={12} orientation={Gtk.Orientation.HORIZONTAL}>

          {/* El avatar ahora carga tu foto local en tiempo de ejecución real */}
          <box
            class="user-avatar"
            halign={Gtk.Align.START}
            $={(self) => {
              const homeDir = GLib.get_home_dir();
              // FIX 1: Añadimos file:// al inicio de la ruta absoluta
              const avatarPath = `file://${homeDir}/.config/ags/assets/avatar.png`;

              const provider = new Gtk.CssProvider();

              // FIX 2: Usamos el selector universal '*' combinando la clase 
              // para ganarle a cualquier otra regla previa de tu scss
              provider.load_from_data(`* { background-image: url('${avatarPath}'); }`, -1);

              const context = self.get_style_context();
              context.add_provider(provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
            }}
          />

          <box orientation={Gtk.Orientation.VERTICAL} hexpand valign={Gtk.Align.CENTER}>
            {/* Tu nombre real fijado de forma estática: 0ms de procesamiento */}
            <label
              class="user-name"
              halign={Gtk.Align.START}
              label="USER NAME"
              $={(self) => {

                execAsync(['bash', '-c', 'getent passwd $(whoami) | cut -d: -f5'])
                  .then(result => {
                    self.set_label(result);
                  }).catch(err => console.log(err))

              }} />
            <label
              class="user-uptime"
              halign={Gtk.Align.START}
              label="Calculando..."
              $={(self) => {
                execAsync(['bash', '-c', 'uname -r'])
                  .then(res => self.label = `Kernel: ${res.trim()}`)
                  .catch(() => self.label = "Linux Kernel");
              }}
            />
          </box>

          <box class="header-actions" spacing={8} valign={Gtk.Align.CENTER}>
            {/* { RebootBtn()} */}
            {/* <button class="action-btn" onClicked={() => execAsync("hyprctl dispatch exit")}><label label="󰍃" /></button> */}
          </box>
        </box>

        {/* BLOQUE 2: QUICK TOGGLES */}
        {/* <QuickToggles /> */}

        {/* BLOQUE 3: PESTAÑAS MEDIAS (Enlazadas reactivamente al estado activeTab) */}
        <box class="subnav-tabs" spacing={4} homogeneous={true}>
          <button
            class={createBinding(activeTab, "value").as(t => t === 0 ? "tab-btn active" : "tab-btn")}
            onClicked={() => activeTab.set_data("value", 0)}
          >
            <label label="󰵚  Notificaciones" />
          </button>
          <button
            class={createBinding(activeTab, "value").as(t => t === 1 ? "tab-btn active" : "tab-btn")}
            onClicked={() => activeTab.set_data("value", 1)}
          >
            <label label="󰕾  Audio" />
          </button>
          <button
            class={createBinding(activeTab, "value").as(t => t === 2 ? "tab-btn active" : "tab-btn")}
            onClicked={() => activeTab.set_data("value", 2)}
          >
            <label label="󰂯  Red" />
          </button>
        </box>

        {/* BLOQUE 4: AREA DE CONTENIDO (Clonando la arquitectura de Stack Asíncrono de Faiyt) */}
        <box vexpand hexpand class="content-scroll-container">
          <stack
            transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            transitionDuration={180}
            visibleChildName={createBinding(activeTab, "value").as(t => `tab-${t}`)}
          >

            <box name="tab-0" vexpand hexpand $={(self) => {
              const scroll = new Gtk.ScrolledWindow();
              scroll.set_has_frame(false);
              scroll.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
              scroll.set_child(renderNotificationList()); // Llamada controlada
              self.append(scroll);
            }} />


            {/* { activeTab === "audio" && <AudioTabContent /> } */}


            <box name="tab-2" valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
              <label class="user-uptime" label="Configuración de Red Próximamente..." />
            </box>
          </stack>
        </box>

        {/* FOOTER */}
        <box class="panel-footer" spacing={8}>

          <label
            class="notif-count"
            hexpand
            halign={Gtk.Align.START}
            // FIX: Usamos la propiedad directa en el bindeo
            label={createBinding(notifd, "notifications")(() => {
              const count = notifd.notifications ? notifd.notifications.length : 0;
              if (count === 0) return "No hay notificaciones";
              if (count === 1) return "1 notificación";
              return `${count} notificaciones`;
            })}
          />

          <button
            class="footer-btn clear-btn"
            onClicked={() => {
              // FIX: Recorremos usando la propiedad nativa del array
              if (notifd.notifications) {
                notifd.notifications.forEach(n => n.dismiss());
              }
            }}
          >
            <label label="󰎟 Limpiar" />
          </button>

        </box>
        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12} class="session-row" halign={Gtk.Align.CENTER}>
          
          {/* Bloquear pantalla (Si usas hyprlock) */}
          { LockScreen() }

          {/* Suspender */}
          { SuspendBtn() }

          {/* Cerrar Sesión Hyprland */}
          { CloseSession() }

          {/* Apagar */}
          { PowerOffBtn() }

        </box>

      </box>
    </window>
  ) as any;
}