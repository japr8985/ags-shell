import WirePlumber from "gi://AstalWirePlumber";


export const wp = WirePlumber.get_default();
export const speaker = wp?.speaker;

export function toggleMute() {
    if (speaker) {
        speaker.mute = !speaker.mute;
    }
}
