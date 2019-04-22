import * as Moment from 'moment';

/**
 * @public
 * @method
 * Formats timestamps to either an exact date or a fuzzy relative date. Both are in the
 * local context.
 *
 * An exact date (forceable by setting exact === true) will have the format (MMM D, YYYY) where
 * MMM is the 3-character month (Jan, Feb, etc.), D = the numerical day, and YYYY = the 4-digit
 * year (2019).
 *
 * The fuzzy date is relative to the current date. So, a minute ago, 3 months ago, 2 weeks ago.
 * If the date is over 4 months ago, this always returns the exact date.
 * @param timeStamp {string} An ISO timestamp (or other that's parseable by Moment)
 * @param exact {boolean} if true, always return the exact date (Dec 10, 2018). If false, return a relative time (2 months ago)
 */
const DATE_FORMAT = 'MMM D, YYYY';
export function getTimeStampStr(timeStamp: string, exact: boolean) : string {
    let date = Moment(timeStamp);
    if (!date.isValid()) {
        return null;
    }
    if (exact) {
        return date.format(DATE_FORMAT);
    }
    else {
        if (date.diff(Moment(), 'months', true) > 4) {
            return date.format(DATE_FORMAT);
        }
        else {
            return date.fromNow();
        }
    }
}
