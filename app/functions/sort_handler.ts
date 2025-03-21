export const createSortHandler =
    <T>(property: keyof T,
        onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void) =>
        (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

export type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function descendingNestedComparator(a: any, b: any): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

export function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string | boolean | null | any },
    b: { [key in Key]: number | string | boolean | null | any },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

type ValidKey = string | number;
export type NestedKeys<T> = {
    [K in keyof T]: K extends ValidKey
    ? T[K] extends object
    ? `${K}` | `${K}.${NestedKeys<T[K]>}`
    : `${K}`
    : never;
}[keyof T];

type Decrement<N extends number> = N extends 1
    ? never
    : N extends 2
    ? 1
    : N extends 3
    ? 2
    : 1;

function getValueByPath<T>(obj: T, path: string): any {
    return path.split('.').reduce((acc, key) => acc && (acc as Record<string, any>)[key], obj);
}

export function getNestedComparator<T>(
    order: 'asc' | 'desc',
    orderBy: NestedKeys<T>
): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingNestedComparator(getValueByPath(b, orderBy), getValueByPath(a, orderBy))
        : (a, b) => -descendingNestedComparator(getValueByPath(a, orderBy), getValueByPath(b, orderBy));
}



