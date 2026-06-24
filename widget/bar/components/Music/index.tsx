// widget/bar/components/MusicBarContent.tsx
import { Gtk } from "ags/gtk4";
import Mpris from "gi://AstalMpris?version=0.1";

const mpris = Mpris.get_default();

export function MusicBarContent(): Gtk.Widget {
    const mainBox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL,
        spacing: 8,
        valign: Gtk.Align.CENTER
    });

    const updateMetadata = () => {
        // Limpiamos hijos anteriores
        while (mainBox.get_first_child()) {
            mainBox.remove(mainBox.get_first_child()!);
        }

        const player = mpris.get_players()[0];

        if (!player) {
            mainBox.append(new Gtk.Label({ label: "Sin medios", css_classes: ["bar-music-empty"] }));
            return;
        }

        // Label de Título de canción
        const titleLabel = new Gtk.Label({
            label: player.title || "Unknown Title",
            max_width_chars: 18,
            ellipsize: 3, // Pango.EllipsizeMode.END
            css_classes: ["bar-music-title"]
        });

        // Label de Artista
        const artistLabel = new Gtk.Label({
            label: player.artist ? ` • ${player.artist}` : "",
            max_width_chars: 12,
            ellipsize: 3,
            css_classes: ["bar-music-artist"]
        });

        // Controles rápidos si pones el mouse encima o haces scroll (Opcional)
        mainBox.append(titleLabel);
        mainBox.append(artistLabel);

        // Escuchamos mutaciones de la canción en vivo para actualizar los labels internos
        player.connect("notify::title", () => { titleLabel.set_label(player.title || "Unknown Title"); });
        player.connect("notify::artist", () => { artistLabel.set_label(player.artist ? ` • ${player.artist}` : ""); });
    };

    mpris.connect("player-added", updateMetadata);
    mpris.connect("player-closed", updateMetadata);
    updateMetadata();

    return mainBox;
}