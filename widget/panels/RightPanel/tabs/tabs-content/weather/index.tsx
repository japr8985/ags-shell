// widget/panels/RightPanel/tabs/tabs-content/weather/index.tsx
import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import { weatherInfo, fetchWeather } from "./weather";

export function WeatherTabContent(): Gtk.Widget {
    // Forzamos el fetch asíncrono inicial de Lechería
    fetchWeather();

    // Creamos un contenedor Box plano que siempre será un 'Node' válido y estático para GTK
    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={20} class="weather-tab-container" vexpand hexpand valign={Gtk.Align.CENTER}>
            
            {/* Usamos el bindeo de forma interna sobre cada propiedad de los labels individuales */}
            <box orientation={Gtk.Orientation.VERTICAL} spacing={20} class="weather-card">
                
                {/* Bloque Principal: Icono y Temperatura */}
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20} halign={Gtk.Align.CENTER}>
                    <label 
                        class="weather-big-icon" 
                        label={createBinding(weatherInfo, "value")((data) => data ? data.icon : "󰖕")} 
                    />
                    <label 
                        class="weather-temp" 
                        label={createBinding(weatherInfo, "value")((data) => data ? data.temp : "--°C")} 
                    />
                </box>

                {/* Condición Textual */}
                <label 
                    class="weather-condition" 
                    halign={Gtk.Align.CENTER} 
                    label={createBinding(weatherInfo, "value")((data) => data ? data.condition : "Cargando reporte...")} 
                />

                {/* Detalles secundarios */}
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={30} halign={Gtk.Align.CENTER} class="weather-details">
                    <label label={createBinding(weatherInfo, "value")((data) => data ? data.humidity : "󰖔 --%")} />
                    <label label={createBinding(weatherInfo, "value")((data) => data ? data.wind : "󰙦 -- km/h")} />
                </box>

                {/* Botón de recarga */}
                <button class="weather-refresh-btn" onClicked={() => {
                    weatherInfo.set_value(null);
                    fetchWeather();
                }} halign={Gtk.Align.CENTER}>
                    <label label="󰑐  Actualizar" />
                </button>

            </box>
            
        </box>
    ) as any;
}