
import { EnvironmentalData } from '../src/types';

export const getEnvironmentalData = async (lat: number, lon: number): Promise<EnvironmentalData> => {
  try {
    // Simulasi delay jaringan
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Logika variasi data agar terasa "real-time"
    // Kita gunakan waktu saat ini sebagai benih acak sederhana
    const now = new Date();
    const secondFactor = now.getSeconds() / 10;
    
    // Base values yang dipengaruhi koordinat + variasi waktu
    const baseAqi = Math.floor((Math.abs(lat) + Math.abs(lon)) % 80) + 20;
    const aqiVariation = Math.floor(Math.random() * 5) - 2; // +/- 2
    
    const baseTemp = 28 + (Math.abs(lat) % 5);
    const tempVariation = (Math.random() * 0.8) - 0.4;
    
    const baseHumidity = 65 + Math.floor(Math.abs(lon) % 15);
    const humVariation = Math.floor(Math.random() * 3) - 1;

    return {
      aqi: Math.max(0, baseAqi + aqiVariation),
      temp: parseFloat((baseTemp + tempVariation).toFixed(1)),
      humidity: Math.round(Math.max(0, Math.min(100, baseHumidity + humVariation))),
      condition: (baseTemp + tempVariation) > 31 ? 'Cerah Terik' : 'Berawan Sejuk',
      location: 'Area Lokal Anda' 
    };
  } catch (error) {
    console.error("Error fetching environmental data", error);
    throw error;
  }
};
