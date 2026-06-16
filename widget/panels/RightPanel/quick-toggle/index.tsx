import BluetoothToggle from "./bluetooth";
import WifiToggle from "./wifi";

export function QuickToggles() {
    return (<box class="quick-toggles-grid" spacing={10} homogeneous={true}>
        <WifiToggle />
        <BluetoothToggle />
    </box>)  as any;
}