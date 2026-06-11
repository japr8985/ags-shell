import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import GLib from "gi://GLib?version=2.0"
import { execAsync } from "ags/process"
import AstalIo from "gi://AstalIO?version=0.1"
import { createBinding } from "ags";
import QuickToggles from "./right-panel-btns/QuickToggles"
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

// SOLUCIÓN AL FREEZE (LAZY FACTORY): Aislamos la construcción pesada de las notificaciones
function renderNotificationList(): Gtk.Widget {
  return (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={8} class="notification-list" vexpand>
      <box class="notif-card" spacing={12}>
        <label class="notif-icon" label="󰂚" />
        <box orientation={Gtk.Orientation.VERTICAL} hexpand>
          <label class="notif-title" halign={Gtk.Align.START} label="Sistema Actualizado" />
          <label class="notif-body" halign={Gtk.Align.START} label="Todos los paquetes de Fedora están al día." />
        </box>
        <label class="notif-time" valign={Gtk.Align.START} label="Ahora" />
      </box>

      <box class="notif-card" spacing={12}>
        <label class="notif-icon" label="󰓓" />
        <box orientation={Gtk.Orientation.VERTICAL} hexpand>
          <label class="notif-title" halign={Gtk.Align.START} label="Steam" />
          <label class="notif-body" halign={Gtk.Align.START} label="Descarga completada." />
        </box>
        <label class="notif-time" valign={Gtk.Align.START} label="11:24" />
      </box>
    </box>
  ) as any;
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
            <button class="action-btn" onClicked={() => execAsync(["ags", "quit"]).catch(e => console.log(e))}><label label="󰑓" /></button>
            <button class="action-btn" onClicked={() => execAsync("hyprctl dispatch exit")}><label label="󰍃" /></button>
          </box>
        </box>

        {/* BLOQUE 2: QUICK TOGGLES */}
        <QuickToggles />

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


            <box name="tab-1" valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
              <label class="user-uptime" label="Controles de Audio Próximamente..." />
            </box>


            <box name="tab-2" valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
              <label class="user-uptime" label="Configuración de Red Próximamente..." />
            </box>
          </stack>
        </box>

        {/* FOOTER */}
        <box class="panel-footer" spacing={8}>
          <label class="notif-count" label="2 notificaciones" hexpand halign={Gtk.Align.START} />
          <button class="footer-btn clear-btn"><label label="󰎟 Limpiar" /></button>
        </box>

      </box>
    </window>
  ) as any;
}