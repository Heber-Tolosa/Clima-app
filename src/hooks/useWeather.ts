import axios from "axios";
import { z } from "zod";
import { object, string, number, InferOutput, parse } from "valibot";
import { SearchType } from "../types";

/* const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});
type Weather = z.infer<typeof Weather>;
*/
const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number(),
  }),
});

type Weather = InferOutput<typeof WeatherSchema>;

export default function useWeather() {
  const fetchWeather = async (search: SearchType) => {
    try {
      const apiID = import.meta.env.VITE_API_KEY;
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiID}`;
      const { data } = await axios(geoUrl);
      const lat = data[0].lat;
      const lon = data[0].lon;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiID}`;
      /* 
      ZOD
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult); */
      const { data: weatherResult } = await axios(weatherUrl);
      const result = parse(WeatherSchema, weatherResult);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    fetchWeather,
  };
}
