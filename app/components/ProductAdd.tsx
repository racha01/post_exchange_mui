import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import 'animate.css';
import { useTheme } from "@mui/material/styles";
import { IDropdownScheduled, DropdownScheduledLineList } from '@/app/interfaces/dropdown_scheduled_list'
import { AnimateCssTransition } from '@/app/transitions/amimate'
import { BouncingInOut, RotateInOut, ShakeX } from '../functions/amimetion_dialog';
import PaperDialog from './PaperDialog';
import { CreateSeller, Seller, SellerList } from '../interfaces/api/sellser';
import { fetchSellerDatas } from '../redux/features/seller/sellerSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason, SnackbarOrigin } from '@mui/material/Snackbar';
import { Autocomplete } from '@mui/material';
import dropdownScheduledLineData from '@/app/data/dropdown_scheduled_list'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GetProduct, GetProductKeys, UpdateProduct } from '../interfaces/api/product';
import { createProduct } from '../redux/features/product/productSlice';
interface ProductAddProps {
    createOpen: boolean;
    onClose: () => void;
}

const ProductAddComponent = () => {
    const [open, setOpen] = React.useState(false);
    // const [sellerCode, setSellerCode] = React.useState('');
    // const [sellerName, setSellerName] = React.useState('');
    const [loading1, setLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [sellerNameNull, setSellerNameNull] = React.useState(false);
    const [productCodeNull, setProductCodeNull] = React.useState(false);
    const [productNameNull, setProductNameNull] = React.useState(false);
    const [wholesalePriceNull, setWholesalePriceNull] = React.useState(false);
    const [cashPriceNull, setCashPriceNull] = React.useState(false);
    const [accrualsPriceNull, setAccrualsPriceNull] = React.useState(false);
    const [animationKey, setAnimationKey] = React.useState(0);
    // const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [updateProduct, setUpdateProduct] = React.useState<UpdateProduct>({
        seller_id: '',
        product_code: '',
        product_name: '',
        wholesale_price: 0,
        cash_price: 0,
        accruals_price: 0
    });
    const dispatch = useAppDispatch();
    const { sellerList, loading } = useSelector((state: RootState) => state.seller);
    const API_URL = "https://localhost:7287/api/sellers";
    React.useEffect(() => {
        dispatch(fetchSellerDatas(API_URL))
    }, [dispatch]);
    async function handleWaitDataAsync() {
        setLoading(true);
    }

    async function handleGetDataAsync() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOpen(true);
        setLoading(false);
    }

    // const handleSnackbarClose = (
    //     event?: React.SyntheticEvent | Event,
    //     reason?: SnackbarCloseReason,
    // ) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }

    //     setOpenSnackBar(false);
    // };

    async function handleFunctionAsync() {
        await handleWaitDataAsync();
        await handleGetDataAsync();
    }

    const handleClose = async () => {
        setOpen(false);
        setIsError(false);
        await setValueDefault();
    };

    const delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const setValueDefault = async () => {
        setSelectedValue(null);
        setUpdateProduct({
            seller_id: '',
            product_code: '',
            product_name: '',
            wholesale_price: 0,
            cash_price: 0,
            accruals_price: 0
        });
        setSellerNameNull(false)
        setProductCodeNull(false)
        setProductNameNull(false)
        setWholesalePriceNull(false)
        setCashPriceNull(false)
        setAccrualsPriceNull(false)
        await delay(100);
    }

    const setValueIsDefaultWhenNameIsNull: { [K in keyof UpdateProduct]: () => void } = {
        seller_id: () => setSellerNameNull(false),
        product_code: () => setProductCodeNull(false),
        product_name: () => setProductNameNull(false),
        wholesale_price: () => setWholesalePriceNull(false),
        cash_price: () => setCashPriceNull(false),
        accruals_price: () => setAccrualsPriceNull(false)
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setValueIsDefaultWhenNameIsNull[name as keyof UpdateProduct]?.();

        const convertedValue =
            name === 'wholesale_price' || name === 'cash_price' || name === 'accruals_price'
                ? parseInt(value) || 0
                : value;

        setUpdateProduct((prevState) => ({
            ...prevState,
            [name]: convertedValue,
        }));
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

    const handleCreate = async (product: UpdateProduct) => {

        console.log(product)
        if (product.seller_id === '' ||
            product.product_code === '' ||
            product.product_name === '' ||
            product.wholesale_price === 0 ||
            product.cash_price === 0 ||
            product.accruals_price === 0) {
            setIsError(true);
            setSellerNameNull(handleValueisNull(product.seller_id))
            setProductCodeNull(handleValueisNull(product.product_code))
            setProductNameNull(handleValueisNull(product.product_name))
            setWholesalePriceNull(handleValueIsZero(product.wholesale_price))
            setCashPriceNull(handleValueIsZero(product.cash_price))
            setAccrualsPriceNull(handleValueIsZero(product.accruals_price))
            setAnimationKey((prevKey) => prevKey + 1)
        }
        else {
            await setValueDefault();
            setOpen(false);
            setIsError(false);
            await dispatch(createProduct(product))
        }
    }
    const [value, setValue] = React.useState('');
    const [name, setName] = React.useState('Cat in the Hat');

    // const handleChange = () => {
    //     setValue(value);
    // };
    const theme = useTheme();

    const [selectedValue, setSelectedValue] = React.useState<Seller | null>(null);
    const dropdownList: SellerList = sellerList?.items.map(item => ({
        ...item,
        label: `(${item.seller_code}) ${item.seller_name}`,
        value: item.id
    })) ?? [];

    const handleSelect = (
        event: React.SyntheticEvent<Element, Event>,
        value: Seller | null,
        reason: string
    ) => {

        setSellerNameNull(false);
        setSelectedValue(value)
        setUpdateProduct((prevState) => ({
            ...prevState,
            seller_id: value?.id ?? ""
        }));
    };

    return (
        <React.Fragment>
            <Button
                onClick={handleFunctionAsync}
                loading={loading}
                loadingPosition="start"
                color="success"
                variant="outlined"
                startIcon={<AddTwoToneIcon />}>Create
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={'lg'}
                slots={{
                    paper: PaperDialog,
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
                    {"Create Product"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 1 }}>
                        <Box sx={{ marginTop: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1 }}>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <Autocomplete
                                    disablePortal
                                    options={dropdownList}
                                    value={selectedValue}
                                    onChange={handleSelect}
                                    renderInput={(params) =>
                                        <TextField
                                            error={sellerNameNull}
                                            {...params}
                                            label="Seller Name"
                                            required
                                            helperText={sellerNameNull ? "Incorrect seller name." : ""} />}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={productCodeNull}
                                    fullWidth
                                    required
                                    label="Product Code"
                                    variant="outlined"
                                    name='product_code'
                                    value={updateProduct.product_code}
                                    onChange={handleChange}
                                    helperText={productCodeNull ? "Incorrect product code." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={productNameNull}
                                    fullWidth
                                    required
                                    label="Product Name"
                                    variant="outlined"
                                    name='product_name'
                                    value={updateProduct?.product_name}
                                    onChange={handleChange}
                                    helperText={productNameNull ? "Incorrect product name." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={wholesalePriceNull}
                                    type='number'
                                    fullWidth
                                    required
                                    label="Wholesale Price"
                                    variant="outlined"
                                    name='wholesale_price'
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateProduct.wholesale_price}
                                    onChange={handleChange}
                                    helperText={wholesalePriceNull ? "Incorrect wholesale price." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={cashPriceNull}
                                    type='number'
                                    fullWidth
                                    required
                                    label="Cash Price"
                                    variant="outlined"
                                    name='cash_price'
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateProduct.cash_price}
                                    onChange={handleChange}
                                    helperText={cashPriceNull ? "Incorrect cash price." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 6' }}>
                                <TextField
                                    error={accrualsPriceNull}
                                    type='number'
                                    fullWidth
                                    required
                                    label="Accruals Price"
                                    variant="outlined"
                                    name='accruals_price'
                                    slotProps={{
                                        htmlInput: {
                                            min: 0
                                        }
                                    }}
                                    value={updateProduct.accruals_price}
                                    onChange={handleChange}
                                    helperText={accrualsPriceNull ? "Incorrect accruals price." : ""}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                    <Button variant="contained" color="success" onClick={() => handleCreate(updateProduct)} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}

export default ProductAddComponent
