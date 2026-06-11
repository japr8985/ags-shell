import { Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createBinding } from "ags"
import WifiToggle from "./WifiToggle";
import BluetoothToggle from "./BlueTooth";

interface ToggleButtonProps {
  icon: string;
  title: string;
  commandLeft: string;
  commandRight?: string;
  activeVar?: any; // Para cuando los conectemos a los servicios nativos
}

// Componente base aislado para cada botón con soporte de click izquierdo y derecho
// function ToggleCard({ icon, title, commandLeft, commandRight }: ToggleButtonProps) {
//   return (
//     <button class="toggle-card active" hexpand>
//       <box 
//         orientation={Gtk.Orientation.VERTICAL} 
//         spacing={6} 
//         valign={Gtk.Align.CENTER}
//         $={(self) => {
//           // Controlador nativo de GTK4 para capturar botones del ratón
//           const gesture = new Gtk.GestureClick();
//           gesture.set_button(0); // Captura TODOS los botones (izquierdo, medio, derecho)
          
//           gesture.connect("pressed", (_g, _n, x, y) => {
//             const currentButton = gesture.get_current_button();
            
//             if (currentButton === Gdk.BUTTON_PRIMARY) {
//               // Click Izquierdo: Alternar estado
//               const classes = self.get_css_classes()
//               if (classes.includes('active')) {
//                 self.remove_css_class('active')
//               } else {
//                 self.add_css_class('activate')
//               }
              
//               execAsync(commandLeft);
//             } else if (currentButton === Gdk.BUTTON_SECONDARY && commandRight) {
//               // Click Derecho: Abrir menú detallado de Hyprland/Ags
//               execAsync(commandRight);
//             }
//           });
          
//           self.add_controller(gesture);
//         }}
//       >
//         <label class="toggle-icon" label={icon} />
//         <label class="toggle-title" label={title} />
//       </box>
//     </button>
//   ) as any;
// }
function ToggleCard({ icon, title, commandLeft, commandRight }: ToggleButtonProps) {
  return (
    // Quitamos la clase 'active' estática de aquí para que la maneje el Box dinámicamente al nacer
    <button class="toggle-card" hexpand>
      <box 
        orientation={Gtk.Orientation.VERTICAL} 
        spacing={6} 
        valign={Gtk.Align.CENTER}
        $={(self) => {
          // Buscamos la referencia real del botón (el componente padre del Box)
          const buttonWidget = self.get_parent() as Gtk.Button | null;
          
          // Estado inicial: Forzamos que arranque activo visualmente si así lo deseas
          if (buttonWidget) {
            buttonWidget.add_css_class("active");
          }

          const gesture = new Gtk.GestureClick();
          gesture.set_button(0); // Captura clicks izquierdos y derechos
          
          gesture.connect("pressed", (_g, _n, x, y) => {
            const currentButton = gesture.get_current_button();
            
            if (currentButton === Gdk.BUTTON_PRIMARY) {
                
              // CLICK IZQUIERDO: Mutar estilos en el botón real
              if (self.get_parent()) {
                const hasActive = self.get_parent()?.has_css_class("active");
                if (hasActive) {
                  self.get_parent()?.remove_css_class("active");
                } else {
                  self.get_parent()?.add_css_class("active");
                }
              }
              
              // EJECUCIÓN BLINDADA: Envolvemos en subshell de Bash y silenciamos rechazos
              execAsync(["bash", "-c", commandLeft])
                .catch(err => console.log(`[Toggle OS Link] Comando izquierdo ejecutado (status filtrado)`));

            } else if (currentButton === Gdk.BUTTON_SECONDARY && commandRight) {
              // CLICK DERECHO: Abrir menú flotante o heramienta del sistema
              execAsync(["bash", "-c", commandRight])
                .catch(err => console.error(`Error en click derecho: ${err}`));
            }
          });
          
          self.add_controller(gesture);
        }}
      >
        <label class="toggle-icon" label={icon} />
        <label class="toggle-title" label={title} />
      </box>
    </button>
  ) as any;
}
// Contenedor principal de la rejilla que exportaremos al panel
export default function QuickToggles() {
  return (
    <box class="quick-toggles-grid" spacing={10} homogeneous={true}>
      
      {/* 1. WIFI TOGGLE */}
      <WifiToggle />

      {/* BLUETOOTH INTELIGENTE DBUS */}
      <BluetoothToggle />

      {/* 3. CAFFEINE TOGGLE (Previene que la pantalla se apague/suspenda) */}
      <ToggleCard 
        icon="󰅶" 
        title="Caffeine"
        // Usa hypridle o systemd inhihbit temporalmente para bloquear la suspensión de tu entorno
        commandLeft="pkill hypridle && notify-send 'Caffeine' 'Hypridle desactivado' || (hypridle & notify-send 'Caffeine' 'Hypridle activo')"
      />

    </box>
  ) as any;
}