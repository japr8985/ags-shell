import { execAsync } from "ags/process"

const SHUTDOWN = "systemctl poweroff";

export function doShutdown() {
    execAsync(SHUTDOWN)
    .then(() => console.info('Shutdown'))
    .catch((err) => console.error('Error al apagar', err))
}