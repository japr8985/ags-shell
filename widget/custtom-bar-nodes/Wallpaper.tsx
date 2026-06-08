import { Gdk, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";

function Wallpaper() {
  const handleClick = (button: number) => {
    try {
        console.log(button)
      if (button === Gdk.BUTTON_PRIMARY) {
        // Clic izquierdo: Cambiar a un wallpaper aleatorio
        execAsync(["waypaper", "--random"]);
      } else if (button === Gdk.BUTTON_SECONDARY) {
        // Clic derecho: Abrir el panel de control de Waypaper flotando en Hyprland
        execAsync(["waypaper"]);
      }
    } catch (error) {
      console.log("Error ejecutando Waypaper:", error);
    }
  };

  return (
    <button
      class="wallpaper-btn"
      // En GTK4 / Gnim, capturamos el evento genérico de clic o release 
      // y evaluamos qué botón del mouse se presionó (1 = Izquierdo, 3 = Derecho)
    onClicked={() => {
        try {
          execAsync(["waypaper", "--random"]);
        } catch (error) {
          console.log("Error en clic izquierdo:", error);
        }
      }}
    $={(self) => {
        // 1. Creamos el controlador de gestos de clic nativo de GTK4
        const gesture = new Gtk.GestureClick();
        
        // 2. Le decimos que escuche todos los botones del mouse (izquierdo, central, derecho)
        gesture.set_button(0); 

        // 3. Conectamos la señal 'released' nativa de GTK4
        // El callback nos da: (gesture, n_press, x, y)
        gesture.connect("released", (g, n_press, x, y) => {
          // Obtenemos qué botón físico disparó el evento (1 = Izquierdo, 3 = Derecho)
          const currentButton = g.get_current_button();
          handleClick(currentButton);
        });

        // 4. Inyectamos el controlador al botón
        self.add_controller(gesture);
      }}
      
      
    >
      <label label=" " />
    </button>
  );
}

export default Wallpaper;