import AstalIO from "gi://AstalIO?version=0.1"
import { RevealerModuleProps } from "./RevealerModuleProps";
import { Gtk } from "ags/gtk4";

const { Variable } = AstalIO
export function RevealerModule({ icon, classNamespace, contentWidget }: RevealerModuleProps) {
    const isExpanded = new Variable({ value: false});
    return (<button
        class={`bar-module-btn ${classNamespace}-btn`}
        onClicked={() => {
            isExpanded.set_value(!isExpanded.get_value())
        }}>
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={6} valign={Gtk.Align.CENTER}>
                
                {/* SLOT 1: El Disparador (Icono/Label) */}
                <label class={`bar-module-trigger-icon ${classNamespace}-icon`} label={icon} />

                {/* SLOT 2: El Contenido Líquido Expandible */}
                <revealer
                    transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                    transitionDuration={250}
                    $={(self) => {
                        // Bindeo seguro por señal nativa
                        isExpanded.connect("changed", () => {
                            self.set_reveal_child(isExpanded.get_value() as boolean);
                        });
                    }}
                >
                    {/* Inyectamos el widget de contenido directamente en el árbol de C */}
                    <box class={`bar-module-content-wrapper ${classNamespace}-content`}>
                        {contentWidget}
                    </box>
                </revealer>

            </box>
    </button>);
}