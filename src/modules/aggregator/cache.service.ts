import NodeCache from 'node-cache';

class CacheService {
	private cache: NodeCache;

	constructor() {
		// TTL: 1 hour (3600 seconds) for API responses
		this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
	}

	get<T>(key: string): T | undefined {
		return this.cache.get<T>(key);
	}

	set<T>(key: string, value: T, ttl?: number): boolean {
		if (ttl) {
			return this.cache.set(key, value, ttl);
		}
		return this.cache.set(key, value);
	}

	del(key: string): number {
		return this.cache.del(key);
	}

	flush(): void {
		this.cache.flushAll();
	}

	generateKey(prefix: string, params: unknown): string {
		if (typeof params !== 'object' || params === null) {
			return `${prefix}:${String(params)}`;
		}
		const filteredParams: Record<string, unknown> = {};
		Object.keys(params as Record<string, unknown>).forEach((key) => {
			const value = (params as Record<string, unknown>)[key];
			if (value !== undefined && value !== null) {
				filteredParams[key] = value;
			}
		});
		const sortedParams = Object.keys(filteredParams)
			.sort()
			.map((key) => `${key}:${String(filteredParams[key])}`)
			.join('|');
		return `${prefix}:${sortedParams}`;
	}
}

export const cacheService = new CacheService();

