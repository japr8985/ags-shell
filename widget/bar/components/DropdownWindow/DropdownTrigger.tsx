// widget/bar/components/DropdownTrigger.tsx
import { Gtk } from "ags/gtk4";
import { togglePopup } from "../../../launcher/popupManager";


export interface DropdownTriggerProps {
    icon: string;
    namespace: string;
    classNamespace: string;
}

export function DropdownTrigger({ icon, namespace, classNamespace }: DropdownTriggerProps) {
    return (
        <button
            class={`bar-dropdown-trigger-btn ${classNamespace}-btn`}
            onClicked={(self) => {
                // Al hacer click, le avisamos al manager que conmute la ventana de este namespace
                togglePopup(namespace, self);
            }}
        >
            <label label={icon} class={`${classNamespace}-icon`} />
        </button>
    ) as any;
}