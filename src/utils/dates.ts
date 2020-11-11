import moment, { unitOfTime } from 'moment';
import { ChartUnit } from '../global/enums';

export const generateMonths = (limit: number): Date[] => generateDates('month', limit);
export const generateWeeks = (limit: number): Date[] => generateDates('week', limit);
export const generateDays = (limit: number): Date[] => generateDates('day', limit);

const generateDates = (momentUnits: unitOfTime.DurationConstructor, limit: number): Date[] => {
    let dates: Date[] = [];
    for (let i = 0; i <= limit; i++) {
        dates.push(moment().subtract(i, momentUnits).toDate());
    }
    return dates;
};

export const getDayNumberFromUnixDate = (date: number): number => {
    return moment.unix(date).dayOfYear();
};

export const getWeekNumberFromUnixDate = (date: number): number => {
    return moment.unix(date).week();
};

export const getMonthNumberFromUnixDate = (date: number): number => {
    return moment.unix(date).month();
};

export const returnDateNumber = (date: number, unit: ChartUnit) => {
    switch (unit) {
        case ChartUnit.MONTH:
            return getMonthNumberFromUnixDate(date);
        case ChartUnit.WEEK:
            return getWeekNumberFromUnixDate(date);
        case ChartUnit.DAY:
            return getDayNumberFromUnixDate(date);
        default:
            break;
    }
};

export const converFromNumberToDate = (number: number, unit: ChartUnit, format: string): string => {
    switch (unit) {
        case ChartUnit.MONTH:
            return moment().month(number).format(format);
        case ChartUnit.WEEK:
            return moment().week(number).format(format);
        case ChartUnit.DAY:
            return moment().dayOfYear(number).format(format);
        default:
            return moment().format(format);
    }
};

export const converFromNumberToDateMilliseconds = (number: number, unit: ChartUnit): number => {
    switch (unit) {
        case ChartUnit.MONTH:
            return moment().month(number).valueOf();
        case ChartUnit.WEEK:
            return moment().week(number).valueOf();
        case ChartUnit.DAY:
            return moment().dayOfYear(number).valueOf();
        default:
            return moment().valueOf();
    }
};
