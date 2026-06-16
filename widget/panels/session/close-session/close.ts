import { execAsync } from "ags/process";
import GLib from "gi://GLib";

export function doCloseSession() {
    
    const currentUser = GLib.getenv("USER") || GLib.get_user_name();

    if (!currentUser) {
        console.error("No se pudo recuperar el nombre de usuario del sistema");
        return;
    }

    console.info(`Intentando cerrar sesión para el usuario: ${currentUser}`);

    const CLOSE_SESSION = `loginctl kill-user ${currentUser}`;
    
    execAsync(CLOSE_SESSION)
        .then(() => console.info(`Sesión de ${currentUser} cerrada exitosamente.`))
        .catch(err => console.error('Error al cerrar sesión:', err));
}