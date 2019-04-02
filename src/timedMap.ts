/**
 * TimedMap: implements a timed map where the keys expire after some
 * configurable amount of time. If an item is requested after that time, then
 * null is returned.
 */

interface IMapItem {
    item: any,
    expires: number  // ms since epoch
};

interface ITimedMap {
    [key: string]: IMapItem
};

export class TimedMap {
    items: ITimedMap;
    timeout: number;

    // timeout should be in milliseconds, > 0. Any value < 0 will be set to 0,
    // rendering this mostly useless. BE WARNED.
    constructor(timeout: number) {
        if (timeout < 0) {
            timeout = 0;
        }
        this.timeout = timeout;
        this.items = {};
    }

    put(key: string, item: any) {
        let currentMillis = new Date().getTime();
        this.items[key] = {
            item: item,
            expires: currentMillis + this.timeout
        };
    }

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
