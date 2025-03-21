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
import { BouncingInOut, ShakeX } from '../functions/amimetion_dialog';
import PaperDialog from './PaperDialog';
import { CreateSeller, Seller } from '../interfaces/api/sellser';
import { createSeller } from '@/app/redux/features/seller/sellerSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import Snackbar, { SnackbarCloseReason, SnackbarOrigin } from '@mui/material/Snackbar';
interface OptionType {
    label: string;
    value: number;
}

export default function SellerAddComponent() {
    const [open, setOpen] = React.useState(false);
    const [sellerCode, setSellerCode] = React.useState('');
    const [sellerName, setSellerName] = React.useState('');
    const [loading1, setLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [sellerCodeNull, setSellerCodeNull] = React.useState(false);
    const [sellerNameNull, setSellerNameNull] = React.useState(false);
    const [animationKey, setAnimationKey] = React.useState(0);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [seller, setSeller] = React.useState<CreateSeller>({
        seller_code: '',
        seller_name: '',
    });
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.seller);
    async function handleWaitDataAsync() {
        setLoading(true);
    }

    async function handleGetDataAsync() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setOpen(true);
        setLoading(false);
    }

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackBar(false);
    };

    async function handleFunctionAsync() {
        await handleWaitDataAsync();
        await handleGetDataAsync();
    }

    const handleClose = () => {
        setOpen(false);
        setIsError(false);
        setSeller({
            seller_code: '',
            seller_name: '',
        });
        setSellerCodeNull(false)
        setSellerNameNull(false)
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name == 'seller_code') {
            setSellerCodeNull(false)
        }
        if (name == 'seller_name') {
            setSellerNameNull(false)
        }

        setSeller((prevState) => ({
            ...prevState,
            [name]: value,
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

    const handleCreate = (seller: CreateSeller) => {

        if (seller.seller_code === '' || seller.seller_name === '') {
            setIsError(true);
            setSellerCodeNull(handleValueisNull(seller.seller_code))
            setSellerNameNull(handleValueisNull(seller.seller_name))
            setAnimationKey((prevKey) => prevKey + 1)
        }
        else {
            dispatch(createSeller(seller))
            setOpen(false);
            setIsError(false);
            setSeller({
                seller_code: '',
                seller_name: '',
            });
        }
    }
    const [value, setValue] = React.useState('');
    const [name, setName] = React.useState('Cat in the Hat');

    // const handleChange = () => {
    //     setValue(value);
    // };
    const theme = useTheme();

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
                    {"Create Seller"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 1 }}>
                        <Box sx={{ marginTop: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1 }}>
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <TextField
                                    error={sellerCodeNull}
                                    fullWidth
                                    required
                                    label="Seller Code"
                                    variant="outlined"
                                    name='seller_code'
                                    value={seller?.seller_code}
                                    onChange={handleChange}
                                    helperText={sellerCodeNull ? "Incorrect seller code." : ""}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <TextField
                                    error={sellerNameNull}
                                    fullWidth
                                    required
                                    label="Seller Name"
                                    variant="outlined"
                                    name='seller_name'
                                    value={seller.seller_name}
                                    onChange={handleChange}
                                    helperText={sellerNameNull ? "Incorrect seller name." : ""}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                    <Button variant="contained" color="success" onClick={() => handleCreate(seller)} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}
