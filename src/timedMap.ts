interface IMapItem {
    item: any,
    expires: number  // ms since epoch
};

class ITimedMap {
    [key: string]: IMapItem
};

/**
 * TimedMap: implements a timed map where the keys expire after some
 * configurable amount of time. If an item is requested after that time, then
 * null is returned, and the key and value are removed to save some space.
 * There's probably a more efficient way to do this (to avoid triggering garbage
 * collection too often, for example), but we're not there yet.
 */
export class TimedMap {
    items: ITimedMap;
    timeout: number;

    /**
     * Timeout should be in milliseconds, > 0. Any value < 0 will be set to 0 rendering
     * this mostly useless. BE WARNED.
     * @constructor
     * @param timeout {number} Time in milliseconds until any value in this map is expired.
     */
    constructor(timeout: number) {
        if (timeout < 0) {
            timeout = 0;
        }
        this.timeout = timeout;
        this.items = {};
    }

    /**
     * @public
     * @method
     * Add a new item to the map. If the key is already in use, then the value is overwritten
     * with the value passed to this method. If the value is the same, then it functionally just
     * resets the clock on its timeout.
     * @param key {string} the key to put in the map
     * @param item {any} the item to put in the map
     */
    put(key: string, item: any) {
        let currentMillis = new Date().getTime();
        this.items[key] = {
            item: item,
            expires: currentMillis + this.timeout
        };
    }

    /**
     * @public
     * @method
     * Return the value associated with the key. If the key doesn't exist in the map, or the value
     * has expired, then null is returned.
     * @param key {string} the key for which to look up the value.
     */
    get(key: string): any {
        if (key in this.items) {
            let item = this.items[key];
            let currentMillis = new Date().getTime();
            if (currentMillis < item.expires) {
                return item.item;
            }
            else {
                delete this.items[key];
            }
        }
        return null;
    }
};
