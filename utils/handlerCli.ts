import { execAsync } from "ags/process";
import { toggleChatWindow } from "../widget/bar/components/AIChat/ChatWindow";
import { toggleRightPanel } from "../widget/panels/RightPanel";
import { toggleLauncher } from "../widget/launcher/launcher";


enum CLI_REQUEST {
    TOGGLE_RIGHT_PANEL = 'toggle-right',
    TOGGLE_AI_CHAT = 'toggle-ai-chat',
    RANDOM_WALLPAPER = 'random-wallpaper',
    TOGGLE_APP_LAUNCHER = 'app-launcher'
}
const handlerRequest = (request: string) => {
    const [command, ...params] = request.split(' ');
    console.log(command)
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
        case CLI_REQUEST.TOGGLE_APP_LAUNCHER:
            toggleLauncher()
            break;
        default:
            console.log('marcar error')
            break;
    }
}

export default { handlerRequest, CLI_REQUEST}