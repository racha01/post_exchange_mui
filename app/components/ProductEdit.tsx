import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import 'animate.css';
import { AnimateCssTransition } from '@/app/transitions/amimate'
import { BouncingInOut, ShakeX } from '../functions/amimetion_dialog';
import PaperDialog from './PaperDialog';
import { Seller, SellerList } from '../interfaces/api/sellser';
import React, { useEffect } from "react";
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { defaultUpdateProduct, UpdateProduct } from '../interfaces/api/product';
import { Autocomplete } from '@mui/material';
import { updateProduct } from '../redux/features/product/productSlice';
interface SellerEditLProps {
    editOpen: boolean;
    editIsError: boolean;
    onClose: () => void;
}

const ProductEditComponent: React.FC<SellerEditLProps> = React.memo(({ editOpen, editIsError, onClose }) => {
    const [open, setOpen] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [sellerNameNull, setSellerNameNull] = React.useState(false);
    const [productCodeNull, setProductCodeNull] = React.useState(false);
    const [productNameNull, setProductNameNull] = React.useState(false);
    const [wholesalePriceNull, setWholesalePriceNull] = React.useState(false);
    const [cashPriceNull, setCashPriceNull] = React.useState(false);
    const [accrualsPriceNull, setAccrualsPriceNull] = React.useState(false);
    const [animationKey, setAnimationKey] = React.useState(0);
    const { seller } = useSelector((state: RootState) => state.seller);
    const { sellerList } = useSelector((state: RootState) => state.seller);
    const { productData } = useSelector((state: RootState) => state.product);
    console.log(`productData: ${productData}`)
    const dropdownList: SellerList = sellerList?.items.map(item => ({
        ...item,
        label: `(${item.seller_code}) ${item.seller_name}`,
        value: item.id
    })) ?? [];

    const [selectedValue, setSelectedValue] = React.useState<Seller | null>(null);
    const [updateProductModel, setUpdateProductModel] = React.useState<UpdateProduct>(defaultUpdateProduct);

    const dispatch = useDispatch<AppDispatch>();
    const [sellerUpdate, setSeller] = React.useState<Seller>({
        id: seller.id,
        seller_code: seller.seller_code,
        seller_name: seller.seller_name,
    });

    // const API_URL = "https://localhost:7287/api/sellers";
    useEffect(() => {
        setOpen(editOpen)
        setIsError(editIsError)
        setSelectedValue(dropdownList.find((item) =>
            item.id === seller.id) ?? null)
        setUpdateProductModel(productData)
        // console.log(seller)
        // setSelectedValue(seller);
        // dispatch(fetchSellerDatas(API_URL))
        // dispatch(fetchProductById(id))
        // setUpdateProduct(productData)
        // setSelectedValue({
        //     id: '',
        //     seller_code: '',
        //     seller_name: '',
        // })
    }, [editOpen, seller, productData]);

    // async function handleFunctionAsync() {
    //     console.log('strat')
    //     console.log('end')
    //     console.log(`open ${open}`)
    // }

    const setValueIsDefaultWhenNameIsNull: { [K in keyof UpdateProduct]: () => void } = {
        seller_id: () => setSellerNameNull(false),
        product_code: () => setProductCodeNull(false),
        product_name: () => setProductNameNull(false),
        wholesale_price: () => setWholesalePriceNull(false),
        cash_price: () => setCashPriceNull(false),
        accruals_price: () => setAccrualsPriceNull(false)
    };

    type NumberFields = {
        [K in keyof UpdateProduct]: UpdateProduct[K] extends number ? K : never;
    }[keyof UpdateProduct];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setValueIsDefaultWhenNameIsNull[name as keyof UpdateProduct]?.();

        const convertedValue =
            name === 'wholesale_price' || name === 'cash_price' || name === 'accruals_price'
                ? parseInt(value) || 0
                : value;

        setUpdateProductModel((prevState) => ({
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

    const handleSelect = (
        event: React.SyntheticEvent<Element, Event>,
        value: Seller | null,
        reason: string
    ) => {
        console.log("select value")
        console.log(value)

        setSellerNameNull(false);
        setSelectedValue(value)
        setUpdateProductModel((prevState) => ({
            ...prevState,
            seller_id: value?.id ?? ""
        }));
    };

    const delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const handleValueIsZero = (value: number) => {
        if (value === 0) {
            return true
        }
        else {
            return false
        }
    }

    const setValueDefault = async () => {
        setSelectedValue(null);
        setUpdateProductModel({
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

    const handleUpdateProduct = async (id: string, product: UpdateProduct) => {
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
            await onClose();
            await dispatch(updateProduct({ id: id, updateProduct: product }))
            setIsError(false);
        }
    }

    const handleClickOpen = async () => {
        setOpen(true);
    };
    const handleCloseDialog = () => setOpen(false);
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
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
                    {"Edit Seller"}
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
                                    value={updateProductModel.product_code}
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
                                    value={updateProductModel?.product_name}
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
                                    value={updateProductModel.wholesale_price}
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
                                    value={updateProductModel.cash_price}
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
                                    value={updateProductModel.accruals_price}
                                    onChange={handleChange}
                                    helperText={accrualsPriceNull ? "Incorrect accruals price." : ""}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Close</Button>
                    <Button variant="contained" color="warning" onClick={() => handleUpdateProduct(productData.id, updateProductModel)} autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default ProductEditComponent;