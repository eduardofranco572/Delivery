import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DistanceService {
    constructor(private http: HttpClient) {}

    async calculateDistance(originAddress: string, destAddress: string): Promise<number> {
        try {
            const originCoords = await this.getCoordinates(originAddress);
            const destCoords = await this.getCoordinates(destAddress);

            if (!originCoords || !destCoords) {
                throw new Error('Não foi possível encontrar as coordenadas dos endereços.');
            }

            const distanceKm = await this.getDrivingDistance(originCoords, destCoords);
            return distanceKm;
        } catch (error) {
            console.error('Erro ao calcular distância:', error);
            throw error;
        }
    }

    private async getCoordinates(address: string): Promise<{lat: number, lon: number} | null> {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
        const response = await firstValueFrom(this.http.get<any[]>(url));

        if (response && response.length > 0) {
            return {
                lat: parseFloat(response[0].lat),
                lon: parseFloat(response[0].lon)
            };
        }
        return null;
    }

    private async getDrivingDistance(origin: {lat: number, lon: number}, dest: {lat: number, lon: number}): Promise<number> {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?overview=false`;
        const response = await firstValueFrom(this.http.get<any>(url));

        if (response && response.routes && response.routes.length > 0) {
            const distanceMeters = response.routes[0].distance;
            return distanceMeters / 1000;
        }
        throw new Error('Rota não encontrada.');
    }
}