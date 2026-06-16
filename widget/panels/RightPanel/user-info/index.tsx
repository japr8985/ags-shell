import { Gtk } from "ags/gtk4";
import { getKernelVersion, getUserAvatar, getUserName } from "./userInfo";

export function UserInfoBox(): Gtk.Widget {
    return (<box
        class="panel-header"
        spacing={12}
        orientation={Gtk.Orientation.HORIZONTAL}>
        <box
            class="user-avatar"
            halign={Gtk.Align.START}
            $={(self) => getUserAvatar(self)}>

        </box>
        <box
            orientation={Gtk.Orientation.VERTICAL}
            hexpand
            valign={Gtk.Align.CENTER}>
            <label
                class="user-name"
                halign={Gtk.Align.START}
                $={(self) => getUserName(self)} />
            <label
                class="user-uptime"
                halign={Gtk.Align.START}
                label="..."
                $={(self) => getKernelVersion(self)} />
        </box>
        <box class="header-actions" spacing={8} valign={Gtk.Align.CENTER}>
            {/* { RebootBtn()} */}
            {/* <button class="action-btn" onClicked={() => execAsync("hyprctl dispatch exit")}><label label="󰍃" /></button> */}
        </box>
    </box>) as any;
}