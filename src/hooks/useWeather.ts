import axios from "axios";
import { SearchType } from "../types";

export default function useWeather() {
  const fetchWeather = async (search: SearchType) => {
    try {
      const apiID = import.meta.env.VITE_API_KEY;
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiID}`;
      const { data } = await axios(geoUrl);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    fetchWeather,
  };
}
