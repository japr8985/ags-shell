import { Gdk, Astal, Gtk } from "ags/gtk4";
import AstalIO from "gi://AstalIO?version=0.1";
import app from "ags/gtk4/app";
import { UserInfoBox } from "./user-info";
import { QuickToggles } from "./quick-toggle";
import { TabNavigation } from "./tabs/navigation";
import { TabContentArea } from "./tabs/content";
import { LockScreen } from "../session/lockscreen";
import { SuspendBtn } from "../session/suspend";
import { CloseSession } from "../session/close-session";
import { PowerOffBtn } from "../session/poweroff";


interface RightSideBarProps {
    gdkmonitor: Gdk.Monitor;
    monitorIndex: number;
}
const { Variable } = AstalIO;

const rightPanelInstances = new Map<number, any>();

export function toggleRightPanel(monitorIndex = 0) {
    const panel = rightPanelInstances.get(monitorIndex);
    if (panel) {
        const isVisible = panel.get_visible();
        const nextState = !isVisible;

        panel.visible = nextState;

        if (nextState) {
            panel.set_property('keymode', Astal.Keymode.ON_DEMAND);
            panel.present();
        } else {
            panel.set_property('keymode', Astal.Keymode.NONE);
        }
    }
}
export default function RightPanel({ gdkmonitor, monitorIndex }: RightSideBarProps) {
    const { TOP, BOTTOM, RIGHT } = Astal.WindowAnchor;
    // const activeTab = Variable.new({ index: 0 });

    return (<window
        visible={false}
        name={`right-panel-${monitorIndex}`}
        namespace="right-panel"
        class="RightPanel"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.NORMAL}
        anchor={TOP | BOTTOM | RIGHT}
        application={app}
        $={(self) => {
            rightPanelInstances.set(monitorIndex, self)
        }}>
        {/* User Header */}
        <box
            class="panel-container"
            orientation={Gtk.Orientation.VERTICAL}
            spacing={16}
            widthRequest={360}
            heightRequest={900}>
            {UserInfoBox()}
            {/* Quick Toggles */}
            <QuickToggles />
            {/* Tabs */}
            <TabNavigation />
            {/* Tabs Content */}
            <TabContentArea />

            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12} class="session-row" halign={Gtk.Align.CENTER}>
                {/* Bloquear pantalla (Si usas hyprlock) */}
                {LockScreen()}

                {/* Suspender */}
                {SuspendBtn()}

                {/* Cerrar Sesión Hyprland */}
                {CloseSession()}

                {/* Apagar */}
                {PowerOffBtn()}
            </box>
        </box>


    </window>);
}