import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { BoxProps, GrowProps, InputLabel, Slide, SlideProps } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import 'animate.css';
import { Backdrop, BackdropProps, PaperProps } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { IDropdownScheduled, DropdownScheduledLineList } from '@/app/interfaces/dropdown_scheduled_list'
import dropdownScheduledLineData from '@/app/data/dropdown_scheduled_list'
import { AnimateCssTransition } from '@/app/transitions/amimate'
import { BouncingInOut, ShakeX } from '../functions/amimetion_dialog';
import DatePickerComponent from './DatePicker';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { defaultDeliverGoods, UpdateDeliverGoods } from '../interfaces/api/deliverGoods';
import { delay, stringToDate, stringToDateTime } from '../functions/time';
import { defaultUpdateProduct, GetProduct, GetProductDropDown, GetProductDropDownList, GetProductList } from '../interfaces/api/product';
import { Pagination } from '../interfaces/api/common';
import { createDeliverGoods, updateDeliverGoodsStore } from '../redux/features/deliverGoods/deliverGoodsSlice';
import { useAppDispatch } from '../hooks';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { selectDeliverGoods } from '../redux/features/deliverGoods/deliverGoodsSelectors';

dayjs.extend(utc)
dayjs.extend(timezone)
// const CustomTransition2: React.ElementType<SlideProps> = ({ ref, ...props }) => (
//     <Slide ref={ref} direction="up" in={props.in} mountOnEnter unmountOnExit>
//         <div className={`animate__animated animate__fadeIn`}>
//             {props.children}
//         </div>
//     </Slide>
// );

const CustomPaper = React.memo((props: any) => {
    return (
        <Paper
            {...props}
            style={{
                width: '600px',
                ...props.style,
            }}
        >
            {props.children}
        </Paper>
    );
});
interface DeliverGoodsEditProps {
    editOpen: boolean;
    editIsError: boolean;
    onClose: () => void;
}
export default function DeliverGoodsEditComponent({ editOpen, editIsError, onClose }: DeliverGoodsEditProps) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    // const [isVisible, setIsVisible] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    // const [taktTime, settaktTime] = React.useState('');
    const [animationKey, setAnimationKey] = React.useState(0);
    const [selectedValue, setSelectedValue] = React.useState<GetProductDropDown | null>(null);
    const [deliverGoodsDate, setdeliverGoodsDate] = React.useState<Dayjs | null>(null);
    const [updateDeliverGoods, setUpdateDeliverGoods] = React.useState<UpdateDeliverGoods>(defaultDeliverGoods);
    const [productIdIsNull, setProductIdIsNull] = React.useState(false);
    const [wholesalePriceIsZero, setWholesalePriceIsZero] = React.useState(false)
    const [cashPriceIsZero, setCashPriceIsZero] = React.useState(false)
    const [accrualsPriceIsZero, setAccrualsPriceIsZero] = React.useState(false)
    const [amountIsZero, setAmountIsZero] = React.useState(false)
    const [leftoversIsZero, setLeftoversIsZero] = React.useState(false)
    const [deliverGoodsDateIsNull, setDeliverGoodsDateIsNull] = React.useState(false)
    const [dropdownProductList, setDropdownProductList] = React.useState<GetProductDropDownList>([])
    const [productData, setProductData] = React.useState<GetProduct | null>()
    // const { deliverGoods } = useSelector((state: RootState) => state.deliverGoods);


    // const [updateDeliverGoods, setUpdateDeliverGoods] = React.useState<UpdateDeliverGoods>(defaultDeliverGoods);
    async function handleWaitDataAsync() {
        setLoading(true);
    }

    const futureDate = dayjs()

    function handleDateChange(newValue: Dayjs | null) {
        setdeliverGoodsDate(newValue)
    }

    const dropdownList: DropdownScheduledLineList = dropdownScheduledLineData.map(item => ({
        ...item,
        label: item.name,
        value: item.scheduledLineCode
    }));
    // const deliverGoods = useSelector((state: RootState) => state.deliverGoods.deliverGoods)};
    const deliverGoods = useSelector((state: RootState) => selectDeliverGoods(state));
    React.useEffect(() => {
        setOpen(editOpen)
        setIsError(editIsError)
        setUpdateDeliverGoods(deliverGoods!);
        setdeliverGoodsDate(dayjs(deliverGoods!.deliver_good_date));
        setSelectedValue({
            value: deliverGoods!.product_id,
            label: "(" + deliverGoods!.seller_name + ") " + deliverGoods!.product_name
        });
    }, [editOpen, deliverGoods]);

    const handleSelect = (
        event: React.SyntheticEvent<Element, Event>,
        value: GetProductDropDown | null,
        reason: string
    ) => {
        if (typeof value?.value === "undefined") {
            setSelectedValue(null);
            setUpdateDeliverGoods(defaultDeliverGoods)
        }
        else {
            async function fetchProductList(): Promise<GetProduct> {
                const response = await fetch(`https://localhost:7287/api/products/${value?.value}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product list');
                }
                return response.json();
            }
            fetchProductList().then((data) => {
                setUpdateDeliverGoods({
                    product_id: value.value,
                    wholesale_price: data.wholesale_price,
                    cash_price: data.cash_price,
                    accruals_price: data.accruals_price,
                    amount: updateDeliverGoods.amount,
                    leftovers: updateDeliverGoods.leftovers,
                    deliver_good_date: updateDeliverGoods.deliver_good_date,
                })
            })
            setWholesalePriceIsZero(false)
            setCashPriceIsZero(false)
            setAccrualsPriceIsZero(false)
            setProductIdIsNull(false)
            setSelectedValue(value);
        }

    };

    const handleDropDownFocus = async () => {
        async function fetchProductList(): Promise<Pagination<GetProduct>> {
            const response = await fetch('https://localhost:7287/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch product list');
            }
            return response.json(); // TypeScript ensures this matches GetProductList
        }
        console.log(fetchProductList)

        fetchProductList().then((data) => {
            const mapDropDown = data.items.map(item => ({
                label: `(${item.seller_name}) ${item.product_name}`,
                value: item.id
            })) as GetProductDropDownList;
            setDropdownProductList(mapDropDown)
        })
    };

    async function handleGetDataAsync() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOpen(true);
        setLoading(false);
    }

    async function handleFunctionAsync() {
        await handleWaitDataAsync();
        await handleGetDataAsync();
    }

    const [closing, setClosing] = React.useState(false);
    const setValueDefault = async () => {
        setSelectedValue(null);
        setUpdateDeliverGoods({
            product_id: '',
            wholesale_price: 0,
            cash_price: 0,
            accruals_price: 0,
            amount: 0,
            leftovers: 0,
            deliver_good_date: dayjs().format("MM/DD/YYYY")
        });
        setProductIdIsNull(false)
        setWholesalePriceIsZero(false)
        setCashPriceIsZero(false)
        setAccrualsPriceIsZero(false)
        setAmountIsZero(false)
        await delay(100);
    }

    const handleClose = async () => {
        setOpen(false);
        setIsError(false);
        await setValueDefault();
    };
    const handleValueisNull = (value: string) => {
        if (!value) {
            return true
        }
        else {
            return false
        }
    }
    const handleValueIsZero = (value: number) => {
        if (value === 0) {
            return true
        }
        else {
            return false
        }
    }
    const dispatch = useAppDispatch();
    const handleUpdate = async (id: string, deliverGoods: UpdateDeliverGoods) => {
        if (deliverGoods.product_id === '' ||
            deliverGoods.wholesale_price === 0 ||
            deliverGoods.cash_price === 0 ||
            deliverGoods.accruals_price === 0 ||
            deliverGoods.amount === 0) {
            setIsError(true);
            setProductIdIsNull(handleValueisNull(deliverGoods.product_id))
            setWholesalePriceIsZero(handleValueIsZero(deliverGoods.wholesale_price))
            setCashPriceIsZero(handleValueIsZero(deliverGoods.cash_price))
            setAccrualsPriceIsZero(handleValueIsZero(deliverGoods.accruals_price))
            setAmountIsZero(handleValueIsZero(deliverGoods.amount))
            setAnimationKey((prevKey) => prevKey + 1)
        }
        else {
            updateDeliverGoods.deliver_good_date = dayjs(deliverGoodsDate)?.tz('Asia/Bangkok').toISOString() || dayjs().tz('Asia/Bangkok').toISOString()
            await setValueDefault();
            setOpen(false);
            setIsError(false);
            dispatch(updateDeliverGoodsStore({ id: id, updateDeliverGoods: deliverGoods }))
        }
    }

    type CustomComponentProps = {
        component: React.ElementType;
    };

    const CustomComponent: React.ElementType<BackdropProps> = (props) => {
        return (
            <Backdrop
                {...props}
                sx={{
                    backgroundColor: 'rgba(181, 21, 21, 0.7)',
                    backdropFilter: 'blur(3px)',
                    ...props.sx,
                }}
            />
        );
    };

    const CustomBackdrop: React.ElementType<BackdropProps> = (props) => {
        return (<Backdrop {...props} sx={{ transition: "none" }} />)
    };
    const [value, setValue] = React.useState('');
    const [name, setName] = React.useState('Cat in the Hat');

    const setValueIsDefaultWhenNameIsNull: { [K in keyof UpdateDeliverGoods]: () => void } = {
        product_id: () => setProductIdIsNull(false),
        wholesale_price: () => setWholesalePriceIsZero(false),
        cash_price: () => setCashPriceIsZero(false),
        accruals_price: () => setAccrualsPriceIsZero(false),
        amount: () => setAmountIsZero(false),
        leftovers: () => setLeftoversIsZero(false),
        deliver_good_date: () => setDeliverGoodsDateIsNull(false),
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setValueIsDefaultWhenNameIsNull[name as keyof UpdateDeliverGoods]?.();

        const convertedValue =
            name === 'wholesale_price' || name === 'cash_price' || name === 'accruals_price'
                ? parseInt(value) || 0
                : value;

        setUpdateDeliverGoods((prevState) => ({
            ...prevState,
            [name]: convertedValue,
        }));
    };
    const theme = useTheme();

    return (
        <React.Fragment>
            {/* <Button
                onClick={handleFunctionAsync}
                loading={loading}
                loadingPosition="start"
                color="success"
                variant="outlined"
                startIcon={<AddTwoToneIcon />}>Create
            </Button> */}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'lg'}
                slots={{
                    paper: CustomPaper,
                    transition: AnimateCssTransition
                }}
                slotProps={{
                    transition: {
                        in: open,
                        className: isError ? ShakeX : BouncingInOut(open),
                        key: animationKey
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"แก้ไขรายการส่งสินค้า"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 1 }}>
                        <Box sx={{ marginTop: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1 }}>
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <Autocomplete
                                    disablePortal
                                    options={dropdownProductList}
                                    value={selectedValue}
                                    onFocus={handleDropDownFocus}
                                    onChange={handleSelect}
                                    renderInput={(params) =>
                                        <TextField
                                            error={productIdIsNull}
                                            {...params} label="Product Name"
                                            helperText={productIdIsNull ? "Incorrect product name." : ""}
                                        />}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={wholesalePriceIsZero}
                                    fullWidth
                                    required
                                    type='number'
                                    label="Wholesale Price"
                                    name='wholesale_price'
                                    variant="outlined"
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateDeliverGoods.wholesale_price}
                                    onChange={handleChange}
                                    helperText={wholesalePriceIsZero ? "Incorrect wholesale price." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={cashPriceIsZero}
                                    fullWidth
                                    required
                                    type='number'
                                    label="Cash Price"
                                    name='cash_price'
                                    variant="outlined"
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateDeliverGoods.cash_price}
                                    onChange={handleChange}
                                    helperText={cashPriceIsZero ? "Incorrect cash price." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={accrualsPriceIsZero}
                                    fullWidth
                                    required
                                    type='number'
                                    label="Accruals Price"
                                    name='accruals_price'
                                    variant="outlined"
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateDeliverGoods.accruals_price}
                                    onChange={handleChange}
                                    helperText={accrualsPriceIsZero ? "Incorrect accruals price." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={amountIsZero}
                                    fullWidth
                                    required
                                    type='number'
                                    label="Amount"
                                    name='amount'
                                    variant="outlined"
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateDeliverGoods.amount}
                                    onChange={handleChange}
                                    helperText={amountIsZero ? "Incorrect amount." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    type='number'
                                    fullWidth
                                    id="filled-basic"
                                    label="Leftovers"
                                    name='leftovers'
                                    variant="outlined"
                                    defaultValue={0}
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        },
                                    }}
                                    value={updateDeliverGoods.leftovers}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <DatePickerComponent
                                    disabled={false}
                                    name='deliver_good_date'
                                    label='Deliver Goods Date'
                                    date={deliverGoodsDate ?? dayjs()}
                                    handleDateChange={() => handleDateChange(deliverGoodsDate)}
                                />
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker sx={{ width: '100%' }}
                                        // disabled={disabled}
                                        name='deliver_good_date'
                                        value={dayjs(updateDeliverGoods.deliver_good_date) ?? dayjs()}
                                        label='Deliver Goods Date'
                                        onChange={(newValue) => handleDateChange(newValue)}
                                    />
                                </LocalizationProvider> */}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>ปิด</Button>
                    <Button variant="contained" color="warning" onClick={() => handleUpdate(deliverGoods.id, updateDeliverGoods)} autoFocus>
                        แก้ไข
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}

