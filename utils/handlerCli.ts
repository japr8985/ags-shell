import { execAsync } from "ags/process";
import { toggleChatWindow } from "../widget/custtom-bar-nodes/ChatWindow";
import { toggleRightPanel } from "../widget/panels/RightPanel";


enum CLI_REQUEST {
    TOGGLE_RIGHT_PANEL = 'toggle-right',
    TOGGLE_AI_CHAT = 'toggle-ai-chat',
    RANDOM_WALLPAPER = 'random-wallpaper'
}
const handlerRequest = (request: string) => {
    const [command, ...params] = request.split(' ');

    switch(command) {
        case CLI_REQUEST.TOGGLE_RIGHT_PANEL:
            toggleRightPanel();
            break;
        case CLI_REQUEST.TOGGLE_AI_CHAT:
            toggleChatWindow();
            break
        case CLI_REQUEST.RANDOM_WALLPAPER:
            execAsync(['waypaper', '--random'])
            break;
        default:
            console.log('marcar error')
            break;
    }
}

export default { handlerRequest, CLI_REQUEST}