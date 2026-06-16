import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import GLib from "gi://GLib?version=2.0";

const HOME_DIR = GLib.get_home_dir();

export function getUserAvatar(ctx:  Gtk.Box) {
    const avatarPath = `file://${HOME_DIR}/.config/ags/assets/avatar.png`;
    const provider = new Gtk.CssProvider();

    const style = `* { background-image: url('${avatarPath}'); }`
    provider.load_from_data(style, -1);

    const context = ctx.get_style_context();
    context.add_provider(provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
}

export function getUserName(ctx: Gtk.Label) {
    execAsync(['bash', '-c', 'getent passwd $(whoami) | cut -d: -f5'])
    .then(result => {
        ctx.set_label(result)
    })
    .catch(err => console.error('Error obteniendo nombre de usuario', err))
}

export function getKernelVersion(ctx: Gtk.Label) {
    execAsync(['bash', '-c', 'uname -r'])
        .then(res => ctx.label = `Kernel: ${res.trim()}`)
        .catch(() => ctx.label = "Linux Kernel");
}