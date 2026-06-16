
import Wp from "gi://AstalWp";
// Obtenemos el singleton del servicio de PipeWire a través de WirePlumber
export const wp = Wp.get_default();
console.log(wp)
// Exportamos el endpoint por defecto de las cornetas/audífonos de salida principal
export const speaker = wp.audio.default_speaker;

/**
 * Conmuta el estado de silencio (Mute) del dispositivo de salida principal
 */
export function toggleMute() {
    if (speaker) {
        // Modificar la propiedad nativa en C dispara automáticamente el evento reactivo en GTK4
        speaker.mute = !speaker.mute;
        console.info(`[AudioService] Mute cambiado a: ${speaker.mute}`);
    } else {
        console.warn("[AudioService] No se pudo conmutar el mute: Dispositivo no encontrado");
    }
}

/**
 * Ajusta el volumen a un nivel específico (Garantizando límites seguros entre 0.0 y 1.0)
 * @param value Nivel de volumen flotante
 */
export function setVolume(value: number) {
    if (speaker) {
        const safeVolume = Math.max(0, Math.min(1, value));
        speaker.volume = safeVolume;
    }
}