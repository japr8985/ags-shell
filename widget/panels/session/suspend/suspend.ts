import { execAsync } from "ags/process"

const SUSPEND = "systemctl suspend";

export function doSuspend() {
    execAsync(SUSPEND)
    .then(() => console.info('SUSPEND'))
    .catch((err) => console.error('Error al suspender', err))
}