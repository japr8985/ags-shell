import { Gtk } from 'ags/gtk3';
import { For } from 'ags'
import { createBinding, createComputed } from "ags";
import AstalHyprland from 'gi://AstalHyprland';

const hypr = AstalHyprland.Hyprland.get_default();

const goTo = (id: number) => {
  try {
    hypr?.dispatch('hl.dsp.focus', `{workspace = ${id}}`)
  } catch (error) {
    console.log("Error", error)
  }
}
function Workspaces() {
  const persistentIds = [1, 2, 3, 4, 5, 6];
  const emptyIcon = "";      // Ícono vacío (Waybar)
  const persistentIcon = "";   // Ícono ocupado/persistente (Waybar)
  const activeIcon = "󰮯";       // Ícono enfocado (Waybar)

  if (!hypr) return <box />;

  // 1. Creamos la lista calculada reactiva (Computed)
  const workspacesList = createComputed(() => {
    // REGISTRO DE DEPENDENCIAS CRUCIALES:
    // Al invocar createBinding, Gnim sabe que debe re-evaluar todo este bloque
    // cada vez que Hyprland mueva el foco o modifique un espacio.
    const activeWorkspaces = createBinding(hypr, "workspaces")();
    const focusedWorkspace = createBinding(hypr, "focused_workspace")();
    const currentWorkspaceId = focusedWorkspace?.id || 0;

    // Generamos los botones JSX correspondientes a tus 6 escritorios persistentes
    return persistentIds.map(id => {
      // Buscamos si el workspace existe actualmente en el backend
      const ws = activeWorkspaces.find((w) => w.id === id);
      const isFocused = currentWorkspaceId === id;
      const isActive = ws !== undefined; // Tiene ventanas o existe

      let icon = persistentIcon;
      let className = "workspace-dot";

      if (isFocused) {
        icon = activeIcon;
        className += " active";
      } else if (!isActive) {
        icon = emptyIcon;
        className += " empty";
      }

      return (
        <button 
          class={className} 
          onClicked={() => goTo(id)}
        >
          <label label={icon} />
        </button>
      );
    });
  });

  // 2. Renderizamos usando el componente <For /> nativo de Gnim para GTK4
  return (
    <box class="workspaces-display" spacing={4}>
      <For each={workspacesList}>
        {(button: any) => button}
      </For>
    </box>
  );
}

export default Workspaces;
