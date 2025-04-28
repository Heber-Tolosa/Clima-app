import axios from "axios";
import { z } from "zod";
/* import { object, string, number, parse } from "valibot"; */
import { SearchType } from "../types";
import { useMemo, useState } from "react";

const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

/* 
VALIBOT
const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number(),
  }),
}); */

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    setLoading(true);
    setWeather(initialState);
    try {
      const apiID = import.meta.env.VITE_API_KEY;
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiID}`;
      const { data } = await axios(geoUrl);
      if (!data[0]) {
        setNotFound(true);
        return;
      }
      const lat = data[0].lat;
      const lon = data[0].lon;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiID}`;
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      /*     const { data: weatherResult } = await axios(weatherUrl);
      const result = parse(WeatherSchema, weatherResult); */
      if (result.success) {
        setWeather(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    loading,
    notFound,
    hasWeatherData,
    fetchWeather,
  };
}
