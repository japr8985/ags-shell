import { toggleChatWindow } from "../ChatWindow";

export function AIChatButton() {
  return (
    <button
      class="ai-chat-btn"
      tooltipText="Abrir asistente IA"
      onClicked={() => toggleChatWindow()}
    >
      <label label="󰚩 " />
    </button>
  );
}