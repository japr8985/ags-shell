// widget/bar/components/MusicModule.tsx
import { Astal, Gtk } from "ags/gtk4";
import AstalIO from "gi://AstalIO?version=0.1";
// import { Variable } from "";
import Mpris from "gi://AstalMpris?version=0.1";
const { Variable } = AstalIO
const mpris = Mpris.get_default();

export function MusicSimpleModule() {
    const isExpanded = new Variable({ value: false });
    const title = new Variable({ value: "" });
    const artist = new Variable({ value: "" });

    const syncMetadata = () => {
        const player = mpris.get_players()[0];
        if (player) {
            title.set_value(player.title || "Sin título");
            artist.set_value(player.artist || "Desconocido");
        } else {
            title.set_value("Sin medios");
            artist.set_value("");
        }
    };

    mpris.connect("player-added", syncMetadata);
    mpris.connect("player-closed", syncMetadata);

    if (mpris.get_players()[0]) {
        syncMetadata();
    }

    return (
        <button
            class="bar-music-simple-btn"
            onClicked={() => {
                syncMetadata();
                isExpanded.set_value(!isExpanded.get_value());
            }}
        >
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={6} valign={Gtk.Align.CENTER}>

                {/* Icono fijo */}
                <label class="bar-music-simple-icon" label="󰎈" />

                {/* El Revealer */}
                <revealer
                    transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                    transitionDuration={300}
                    $={(self) => {
                        isExpanded.connect("changed", () => {
                            // Forzamos a TS a reconocerlo como booleano
                            self.set_reveal_child(isExpanded.get_value() as boolean);
                        });
                    }}
                >
                    <box class="bar-music-simple-text" margin_end={4}>

                        {/* Título de la canción */}
                        <label
                            class="bar-music-simple-title"
                            maxWidthChars={22}
                            ellipsize={3}
                            $={(self) => {
                                const update = () => self.set_label(` ${title.get_value()}`);
                                title.connect("changed", update);
                                update();
                            }}
                        />

                        {/* Artista de la canción */}
                        <label
                            class="bar-music-simple-artist"
                            maxWidthChars={14}
                            ellipsize={3}
                            $={(self) => {
                                const update = () => {
                                    const art = artist.get_value();
                                    self.set_label(art ? ` • ${art}` : "");
                                };
                                artist.connect("changed", update);
                                update();
                            }}
                        />

                    </box>
                </revealer>
            </box>
        </button>
    ) as any;
}