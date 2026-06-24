import { Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";

export function changeWallpaper(button: number = Gdk.BUTTON_PRIMARY) {
    const cmd = ['waypaper'];

    if (button === Gdk.BUTTON_PRIMARY) {
        cmd.push('--random')
    }
    
    execAsync(cmd).catch(err => console.error('Error al cambiar wallpaper', err));
}