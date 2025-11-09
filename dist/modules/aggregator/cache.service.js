import NodeCache from 'node-cache';
class CacheService {
    constructor() {
        // TTL: 1 hour (3600 seconds) for API responses
        this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value, ttl) {
        if (ttl) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }
    del(key) {
        return this.cache.del(key);
    }
    flush() {
        this.cache.flushAll();
    }
    generateKey(prefix, params) {
        if (typeof params !== 'object' || params === null) {
            return `${prefix}:${String(params)}`;
        }
        const filteredParams = {};
        Object.keys(params).forEach((key) => {
            const value = params[key];
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
//# sourceMappingURL=cache.service.js.map