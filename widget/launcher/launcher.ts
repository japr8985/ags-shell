import { Astal, Gdk } from "ags/gtk4";

export const launcherInstances = new Map<number, any>();

export interface LauncherProps {
    gdkmonitor: Gdk.Monitor,
    monitorIndex: number
}

export function toggleLauncher(monitor = 0) {
    const launcher = launcherInstances.get(monitor);

    if (launcher) {
        const isVisible = launcher.get_visible();
        const nextState = !isVisible;

        launcher.visible = nextState;

        if (nextState) {
            launcher.set_property('keymode', Astal.Keymode.ON_DEMAND)
            launcher.present();
        } else {
            launcher.set_property('keymode', Astal.Keymode.NONE);
        }
    }

    
}