// widget/popups/notification/popup-card.tsx
import { Gtk } from "ags/gtk4";
import { dismissNotification } from "../../panels/RightPanel/tabs/tabs-content/notifd/notifd";

function getPopupIcon(appName: string): string {
    const name = appName?.toLowerCase() || "";
    if (name.includes("steam")) return "󰓓";
    if (name.includes("discord")) return "󰙯";
    if (name.includes("telegram")) return "󰔁";
    if (name.includes("firefox") || name.includes("chrome") || name.includes("brave")) return "󰖟";
    if (name.includes("terminal") || name.includes("kitty")) return "󰞷";
    return "󰂚";
}

export function createPopupCard(n: any): Gtk.Widget {
    const iconLabel = getPopupIcon(n.appName || n.appIcon);

    // 1. CONTENEDOR PRINCIPAL: Caja estructural con márgenes fijos para respirar
    const card = new Gtk.Box({ 
        orientation: Gtk.Orientation.HORIZONTAL, 
        spacing: 14,
        hexpand: true,
        vexpand: false
    });
    card.get_style_context().add_class("popup-notif-card");
    // Añadimos paddings directos en C por si el SCSS tarda en compilar
    card.set_margin_bottom(6);

    // 2. ICONO APP: Envoltorio para evitar deformaciones
    const iconBox = new Gtk.Box({ valign: Gtk.Align.CENTER, halign: Gtk.Align.CENTER });
    const icon = new Gtk.Label({ label: iconLabel });
    icon.get_style_context().add_class("popup-notif-icon");
    iconBox.append(icon);

    // 3. COLUMNA CENTRAL DE TEXTOS: Obligamos a expandir y alineamos a la izquierda
    const textContainer = new Gtk.Box({ 
        orientation: Gtk.Orientation.VERTICAL, 
        spacing: 4, 
        hexpand: true,
        valign: Gtk.Align.CENTER
    });

    const title = new Gtk.Label({ 
        label: n.summary || "Notificación", 
        halign: Gtk.Align.START, // <--- CRUCIAL: Fuerza el texto a ir a la izquierda
        hexpand: true,
        ellipsize: 3, // Pone "..." si el título es ridículamente largo
        max_width_chars: 26
    });
    title.get_style_context().add_class("popup-notif-title");

    const body = new Gtk.Label({ 
        label: n.body || "", 
        halign: Gtk.Align.START, // <--- CRUCIAL: Alínea el cuerpo a la izquierda
        hexpand: true,
        wrap: true, // Permite saltos de línea ordenados
        max_width_chars: 28,
        lines: 3 // Evita que una notificación gigante rompa el tamaño de tu pantalla
    });
    body.get_style_context().add_class("popup-notif-body");

    textContainer.append(title);
    textContainer.append(body);

    // 4. COLUMNA DERECHA: Botón de cierre aislado (Evita que se encime con el texto)
    const actionContainer = new Gtk.Box({ 
        valign: Gtk.Align.START, 
        halign: Gtk.Align.END 
    });
    
    // Usamos una etiqueta limpia y removemos cualquier child por defecto extraño de GTK
    const closeBtn = new Gtk.Button({
        valign: Gtk.Align.CENTER,
        halign: Gtk.Align.CENTER
    });
    closeBtn.set_child(new Gtk.Label({ label: "󰅖" }));
    closeBtn.get_style_context().add_class("popup-notif-close");
    closeBtn.connect("clicked", () => dismissNotification(n.id));
    actionContainer.append(closeBtn);

    // Ensamblaje modular limpio
    card.append(iconBox);
    card.append(textContainer);
    card.append(actionContainer);

    return card;
}