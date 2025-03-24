import { Box, Button, FormControl, InputLabel, MenuItem, Stack, TextField, IconButton, Paper } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid2';
import React, { } from "react";
import DeliverGoodsAddComponent from "@/app/components/DeliverGoodsAdd";
import DeliverGoodsTable from "@/app/components/DeliverGoodTable";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InputAdornment from '@mui/material/InputAdornment';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchDeliverGoodsDatas } from '../redux/features/deliverGoods/deliverGoodsSlice';
// import DeleteIcon from '@mui/icons-material/Delete';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import { styled } from '@mui/material/styles';
import { defaultDateRangePicker, defaultEndDate, defaultEndDateISOString, defaultStartDate, defaultStartDateISOString, stringToDate, stringToDateThai } from "../functions/time";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { exportExcel } from '@/app/functions/exportExcel'
// import { exportExcelTest } from '@/app/functions/exportExcelTest'
import { selectDeliverGoodsList, selectDeliverGoodsLoading } from '@/app/redux/features/deliverGoods/deliverGoodsSelectors';
import { GetDeliverGoods } from "../interfaces/api/deliverGoods";
import { createExcelFileJS } from "../functions/exportExcelJs";
import { GetSellerDropDownList, Seller, SellerList } from "../interfaces/api/sellser";
import { Pagination } from "../interfaces/api/common";
const DatePickerRangePaper = styled(Paper)(({ theme }) => ({
    width: "auto",
    height: "auto",
    boxShadow: theme.shadows[3],
    position: "absolute",
    zIndex: 999,
    marginTop: '60px',
    // padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'start',

}));

const DeliverGoodsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = React.useState(false);
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();
    const startDateISO = defaultStartDateISOString();
    const endDateISO = defaultEndDateISOString();
    const defautfDateRangePicker = defaultDateRangePicker(startDateISO, endDateISO);
    const [dateRangePicker, setDateRangePicker] = React.useState<string | null>(defautfDateRangePicker);
    const [isSelectDate, setIsSelectDate] = React.useState(false);
    const deliverGoodsList = useSelector(selectDeliverGoodsList);
    const [selectDate, setSelectDate] = React.useState<{
        startDate: string | null
        endDate: string | null
    }>({
        startDate: null,
        endDate: null,
    });
    const [dateRange, setDateRange] = React.useState([
        {
            startDate: defaultStartDate(),
            endDate: defaultEndDate(),
            key: "selection",
        },
    ]);
    const [dropdownSellerList, setDropdownSellerList] = React.useState<GetSellerDropDownList>([])
    const [sellerId, setSellerId] = React.useState<string>();
    const [isSearched, setIsSearched] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const preventScroll = (event: Event) => {
            event.preventDefault();
        };
        if (open) {
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
        } else {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        }

        return () => {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        };
    });
    const handleSelect = (ranges: RangeKeyDict) => {
        const { selection } = ranges;
        const selectDateRange = [{
            startDate: selection.startDate as Date,
            endDate: selection.endDate as Date,
            key: "selection",
        }]
        setDateRange(selectDateRange)
        // setOpen(false)
        if (selection.startDate !== selection.endDate && (selection.startDate !== undefined && selection.endDate !== undefined)) {
            setOpen(false)
            setIsSelectDate(true);
            setDateRangePicker(`${stringToDateThai(selection.startDate.toString())} ~ ${stringToDateThai(selection.endDate.toString())}`)
            setSelectDate({
                startDate: selection.startDate?.toISOString() as string,
                endDate: selection.endDate?.toISOString() as string
            });
        }


    };

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setSellerId(event.target.value);
    }
    const handleDropDownFocus = async () => {
        async function fetchProductList(): Promise<Pagination<Seller>> {
            const response = await fetch('https://localhost:7287/api/sellers');
            if (!response.ok) {
                throw new Error('Failed to fetch product list');
            }
            return response.json();
        }

        fetchProductList().then((data) => {
            const mapDropDown = data.items.map(item => ({
                label: `${item.seller_name}`,
                value: item.id
            })) as GetSellerDropDownList
            setDropdownSellerList(mapDropDown)
        })
    };
    const handleClick = () => {
        setOpen(!open)
        if (dateRangePicker === "") {
            setDateRangePicker('วว/ดด/ปป');
        }
        if (!isSelectDate && open) {
            setDateRangePicker("");
        }
    }
    const handleCilckSearch = () => {
        // setIsSearched(true);
        dispatch(fetchDeliverGoodsDatas({
            sellerId: sellerId,
            startDate: selectDate.startDate as string,
            endDate: selectDate.endDate as string
        }));
    }

    const convertDateToExcel = (dateBefore: string, date: string) => {
        if (stringToDate(dateBefore) == stringToDate(date)) {
            return '';
        }
        else {
            return stringToDateThai(date)
        }
    }
    const handleClickExport = () => {
        const datas: Array<{ [key: string]: string | number }> = []
        deliverGoodsList?.items.forEach((element: GetDeliverGoods, index: number) => {
            const dateBefore = deliverGoodsList?.items[index - ((index !== 0) ? 1 : 0)].deliver_good_date;
            datas.push({
                date: (index === 0) ?
                    stringToDateThai(element.deliver_good_date) :
                    convertDateToExcel(dateBefore, element.deliver_good_date),
                item: element.product_name,
                amount: (element.leftovers === 0) ? element.amount.toString() : `${element.amount}-${element.leftovers}` as string,
                wholesalePrice: element.wholesale_price,
                totalPrice: element.wholesale_price * (element.amount - element.leftovers)
            });
        });
        createExcelFileJS({ data: datas, sellerName: deliverGoodsList?.items[0].seller_name, dateRange: dateRangePicker });
    }

    return (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
            <Grid
                container
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: '10px',
                }}
            >
                <Box>
                    <h1>รายการส่งสินค้า</h1>
                </Box>

                <Box>
                    <Stack direction="row" spacing={2}>
                        <Box>
                            <DeliverGoodsAddComponent
                                startDate={selectDate.startDate ?? dateRange[0].startDate.toISOString()}
                                endDate={selectDate.endDate ?? dateRange[0].endDate.toISOString()}
                                sellerId={sellerId} />
                            {sellerId && <Button
                                sx={{ marginLeft: '3px' }}
                                variant="outlined"
                                startIcon={<ArrowUpwardIcon />}
                                onClick={handleClickExport}>
                                EXPORT EXCEL
                            </Button>}
                        </Box>
                    </Stack>
                </Box>
            </Grid>
            <Stack direction="row" spacing={1} sx={{ marginBottom: '5px' }}>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">ผู้ฝากขาย</InputLabel>
                        <Select
                            // labelId="demo-simple-select-label"
                            // id="demo-simple-select"
                            value={sellerId || ''}
                            label="ผู้ฝากขาย"
                            onFocus={handleDropDownFocus}
                            onChange={handleChangeSelect}
                        >
                            {dropdownSellerList.map((element) => (
                                <MenuItem key={element.value} value={element.value}>
                                    {element.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Stack>
                    <TextField
                        id="outlined-basic"
                        label="วันที่ส่งสินค้า"
                        variant="outlined"
                        value={dateRangePicker}
                        slotProps={{
                            inputLabel: {
                                shrink: (dateRangePicker === "") ? false : true
                            },
                            input: {
                                endAdornment:
                                    <IconButton aria-label="delete" onClick={handleClick}>
                                        <InsertInvitationIcon />
                                    </IconButton>,
                            },
                        }} />
                    {/* {open && <DateRangePicker
                        ranges={dateRange}
                        onChange={(ranges) => handleSelect(ranges)}
                        // showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        direction="horizontal"

                    />} */}
                    {open &&
                        <DatePickerRangePaper variant="elevation">
                            <DateRangePicker
                                ranges={dateRange}
                                onChange={(ranges) => handleSelect(ranges)}
                                // showSelectionPreview={true}
                                // showMonthAndYearPickers={false}
                                // editableDateInputs={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                direction="horizontal"
                                inputRanges={[]}
                            />
                        </DatePickerRangePaper>}
                </Stack>
                {/* <Box>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<FilterAltIcon />}
                        onClick={handleCilckSearch}
                    >
                        ค้นหา
                    </Button>
                </Box> */}
            </Stack>
            <DeliverGoodsTable
                startDate={selectDate.startDate ?? dateRange[0].startDate.toISOString()}
                endDate={selectDate.endDate ?? dateRange[0].endDate.toISOString()}
                sellerId={sellerId} />
        </Box>
    )

}
export default DeliverGoodsPage;