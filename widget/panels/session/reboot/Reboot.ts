import { execAsync } from "ags/process";

const REBOOT = "systemctl reboot";

export function doReboot() {
    execAsync(REBOOT)
    .then(() => console.info('Rebooting'))
    .catch(err => console.error('Error al reiniciar', err))
}