import moment from 'moment';

export const sortByDate = (arr: any) => {
    if (!arr) return;
    return arr.sort(dateCompare);
};

export const dateCompare = (a: any, b: any) => {
    return moment(a.x, 'DD/MM/YYYY').diff(moment(b.x, 'DD/MM/YYYY'));
};

export const sortByDateMilliseconds = (arr: any) => {
    if (!arr) return;
    return arr.sort((a: any, b: any) => {
        return moment(a.x).diff(moment(b.x));
    });
};

export const sortByNumber = (arr: any, propertyName: string, asc?: boolean) => {
    if (!arr) return;
    return arr.sort((a: any, b: any) => {
        return asc ? a[propertyName] - b[propertyName] : b[propertyName] - a[propertyName];
    });
};
