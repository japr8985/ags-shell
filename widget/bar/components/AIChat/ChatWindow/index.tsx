import app from "ags/gtk4/app";
import { Gtk, Gdk, Astal } from "ags/gtk4";

// Nuestra propia referencia segura controlada en JS
let chatWindowRef: any = null;

export function toggleChatWindow() {
  if (chatWindowRef) {
    const isVisible = chatWindowRef.get_visible();
    const nextState = !isVisible;
    
    // Aplicamos el keymode nativo usando set_property sobre nuestra referencia real
    if (nextState) {
      chatWindowRef.set_property("keymode", Astal.Keymode.ON_DEMAND);
    } else {
      chatWindowRef.set_property("keymode", Astal.Keymode.NONE);
    }

    chatWindowRef.set_visible(nextState);
  }
}

export function ChatWindow(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, LEFT } = Astal.WindowAnchor;

  return (
    <window
      name="chat-window"
      class="ChatWindow"
      gdkmonitor={gdkmonitor}
      visible={false} 
      exclusivity={Astal.Exclusivity.EXCLUSIVE} 
      anchor={TOP | BOTTOM | LEFT}
      application={app}
      keymode={Astal.Keymode.NONE}
      // El hook '$' nos da el objeto de la ventana real en el microsegundo de su creación
      $={(self) => {
        chatWindowRef = self;
      }}
    >
      <box class="chat-container" orientation={Gtk.Orientation.VERTICAL}>
        {/* Cabecera del Chat */}
        <box class="chat-header" orientation={Gtk.Orientation.HORIZONTAL}>
          <label class="chat-title" label="󰚩  Local AI Assistant" hexpand halign={Gtk.Align.START} />
          <button class="chat-close-btn" onClicked={() => toggleChatWindow()}>
            <label label="󰅖 " />
          </button>
        </box>

        {/* Área Central */}
        <box class="chat-messages-area" hexpand vexpand>
          <label label="El chat con tu modelo local aparecerá aquí..." halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} hexpand vexpand />
        </box>

        {/* Área Inferior (Input de texto) */}
        <box class="chat-input-area" orientation={Gtk.Orientation.HORIZONTAL} spacing={6}>
          <entry 
            class="chat-entry" 
            placeholderText="Pregúntale algo a la IA..." 
            hexpand 
            onActivate={(self) => {
              console.log("Enviar texto a Ollama:", self.text);
              self.text = ""; 
            }}
          />
          <button class="chat-send-btn">
            <label label="󰒡" />
          </button>
        </box>
      </box>
    </window>
  );
}

