import { Gtk } from "ags/gtk4";

export interface RevealerModuleProps {
    icon: string;
    classNamespace: string;
    hoverColorClass?: string;
    contentWidget: Gtk.Widget;
}