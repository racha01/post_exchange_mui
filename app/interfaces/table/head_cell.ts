export interface HeadCell<T> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
    numeric: boolean;
}

export interface HeadCellKeyString<T> {
    disablePadding: boolean;
    id: keyof T | string;
    label: string;
    numeric: boolean;
}
