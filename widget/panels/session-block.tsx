import { execAsync } from "ags/process"

const SHUTDOWN = "systemctl poweroff";
const REBOOT = "systemctl reboot";
const SUSPEND = "systemctl suspend";
const CLOSE_SESSION = "hyprctl dispatch exit";

export function rebootBtn() {
    return (<button
        class="header-action-btn reboot-btn"
        onClicked={() => {
            // Exec_async lanza el comando al sistema de forma aislada
            execAsync(REBOOT).catch(err => console.error("Error al reiniciar:", err));
        }}
    >
        <label label="󰜉" /> {/* Icono de reiniciar de Nerd Fonts */}
    </button>)
}
export function powerOffBtn() {
    return (<button 
        class="header-action-btn poweroff-btn"
        onClicked={() => execAsync(SHUTDOWN).catch(err => console.error("Error al apagar:", err))}>
            <label label="󰐥" /> {/* Icono de Power Off de Nerd Fonts */}
    </button>)
}
export function suspendBtn() {
    return (
        <button class="session-btn" onClicked={() => execAsync(SUSPEND)}>
            <label label="󰤄" />
        </button>
    )
}
export function lockBtn() {
    return (<button class="session-btn" onClicked={() => execAsync("hyperlock")}>
        <label label="󰤄" />
      </button>)
}


      