import { execAsync } from "ags/process";

const LOCKSCREEN = "hyprlock";

export function doLockScreen() {
    execAsync(LOCKSCREEN)
    .then(() => console.info('Locking screen'))
    .catch(err => console.error('Error al bloquear pantalla', err))
}