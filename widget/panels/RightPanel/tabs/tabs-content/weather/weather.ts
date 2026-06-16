// widget/panels/RightPanel/tabs/tabs-content/weather/weather.ts
import AstalIO from "gi://AstalIO?version=0.1";
import { execAsync } from "ags/process";

const { Variable } = AstalIO;

export interface WeatherData {
    temp: string;
    condition: string;
    icon: string;
    humidity: string;
    wind: string;
}

// Estado reactivo que guardará el clima actual
export const weatherInfo = Variable.new<WeatherData | null>(null) as any;

/**
 * Obtiene el clima actual de Lechería mediante wttr.in en formato JSON de forma asíncrona
 */
export function fetchWeather() {
    // Pedimos el clima de Lechería, Venezuela en formato JSON limpio (?format=j1)
    const cmd = "curl -s 'https://wttr.in/Lecheria?format=j1'";

    execAsync(["bash", "-c", cmd])
        .then((res) => {
            const data = JSON.parse(res);
            const current = data.current_condition[0];
            
            // Mapeo básico de códigos de wttr a iconos de Nerd Fonts
            const code = current.weatherCode;
            let icon = "󰖕"; // Default nublado
            if (["113"].includes(code)) icon = "󰖙"; // Despejado / Sol
            if (["116", "119", "122"].includes(code)) icon = "󰖕"; // Nublado
            if (["143", "248", "260"].includes(code)) icon = "󰖑"; // Neblina
            if (["176", "293", "296", "302", "308"].includes(code)) icon = "󰖗"; // Lluvia
            if (["386", "389"].includes(code)) icon = "󰙝"; // Tormenta

            weatherInfo.set_value({
                temp: `${current.temp_C}°C`,
                condition: current.lang_es?.[0]?.value || current.weatherDesc[0].value,
                icon: icon,
                humidity: `󰖔 ${current.humidity}%`,
                wind: `󰙦 ${current.windspeedKmph} km/h`
            });
        })
        .catch((err) => {
            console.error("[WeatherService] Error al obtener el clima:", err);
        });
}