import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';

interface DatePickerProps {
    name: string
    label: string
    date: Dayjs
    disabled: boolean
    handleDateChange: (value: Dayjs | null) => void
}

const DatePickerComponent: React.FC<DatePickerProps> = ({ name, label, date, disabled, handleDateChange }) => {
    const [dateValue, setDateValue] = React.useState<Dayjs | null>(dayjs(date));

    React.useEffect(() => {
        setDateValue(date);
    }, [date]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker sx={{ width: '100%' }}
                disabled={disabled}
                name={name}
                value={dateValue}
                label={label}
                onChange={(newValue) => handleDateChange(newValue)}
            />
        </LocalizationProvider>
    );
}

export default DatePickerComponent;
