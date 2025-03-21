import dayjs from "dayjs";

export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const stringToDateTime = (datetime: string) => {
    return dayjs(datetime).format("MM-DD-YYYY HH:mm:ss")
}

export const stringToDate = (datetime: string) => {
    return dayjs(datetime).format("MM-DD-YYYY")
}

export const stringToDateThai = (datetime: string) => {
    const date = new Date(datetime);
    const monthNames = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const month = monthNames[date.getMonth()];
    const year = (date.getFullYear() + 543).toString().slice(-2);
    const day = date.getDate();
    return `${day}-${month}-${year}`
}

export const defaultStartDateISOString = () => {
    const startDate = dayjs().set('date', 7);
    return startDate.toISOString();
}
export const defaultEndDateISOString = () => {
    const endDate = dayjs().add(1, 'month').set('date', 6);
    return endDate.toISOString();
}
export const defaultStartDate = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 7);
    return startDate;
}
export const defaultEndDate = () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 6);
    return endDate;
}

export const defaultDateRangePicker = (startDate: string, endDate: string) => {
    return `${stringToDateThai(startDate)} ~ ${stringToDateThai(endDate)}`
}