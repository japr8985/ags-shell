import { toggleChatWindow } from "./ChatWindow";

function AIChatButton() {
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

export default AIChatButton;