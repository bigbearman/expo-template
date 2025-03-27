import { APP_CONSTANTS } from '../constants';

class ApiService {
  private static instance: ApiService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), APP_CONSTANTS.API.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }

  async get<T>(endpoint: string, useCache = true): Promise<T> {
    const url = `${APP_CONSTANTS.API.BASE_URL}${endpoint}`;
    
    if (useCache) {
      const cached = this.cache.get(url);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
    }

    const response = await this.fetchWithTimeout(url);
    const data = await response.json();

    if (useCache) {
      this.cache.set(url, { data, timestamp: Date.now() });
    }

    return data;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const apiService = ApiService.getInstance(); 