import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import 'animate.css';
import { useTheme } from "@mui/material/styles";
import { IDropdownScheduled, DropdownScheduledLineList } from '@/app/interfaces/dropdown_scheduled_list'
import { AnimateCssTransition } from '@/app/transitions/amimate'
import { BouncingInOut, ShakeX } from '../functions/amimetion_dialog';
import PaperDialog from './PaperDialog';
import { CreateSeller, Seller, UpdateSeller } from '../interfaces/api/sellser';
import { createSeller, updateSeller, fetchSellerData } from '@/app/redux/features/seller/sellerSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import React, { useEffect, useCallback } from "react";
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
interface SellerEditLProps {
    editOpen: boolean;
    editIsError: boolean;
    onClose: () => void;
}

const SellerEditComponent: React.FC<SellerEditLProps> = React.memo(({ editOpen, editIsError, onClose }) => {
    const [open, setOpen] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [sellerCodeNull, setSellerCodeNull] = React.useState(false);
    const [sellerNameNull, setSellerNameNull] = React.useState(false);
    const [animationKey, setAnimationKey] = React.useState(0);
    const { seller, loading, error } = useSelector((state: RootState) => state.seller);
    const dispatch = useDispatch<AppDispatch>();
    const [sellerUpdate, setSeller] = React.useState<Seller>({
        id: '',
        seller_code: '',
        seller_name: '',
    });

    useEffect(() => {
        setOpen(editOpen)
        setIsError(editIsError)
        setSeller(seller)
    }, [editOpen, seller]);

    // async function handleFunctionAsync() {
    //     console.log('strat')
    //     console.log('end')
    //     console.log(`open ${open}`)
    // }

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
    const handleUpdateSeller = async (id: string, seller: Seller) => {
        if (seller.seller_code === '' || seller.seller_name === '') {
            setIsError(true);
            setSellerCodeNull(handleValueisNull(seller.seller_code))
            setSellerNameNull(handleValueisNull(seller.seller_name))
            setAnimationKey((prevKey) => prevKey + 1)
        }
        else {
            const updateSellerDb = {
                id: id,
                updateSeller: {
                    seller_code: seller.seller_code,
                    seller_name: seller.seller_name
                }

            }
            await onClose();
            dispatch(updateSeller(updateSellerDb))
            setIsError(false);

        }
    }

    const handleEdit = async (seller: Seller) => {
        handleUpdateSeller(seller.id, seller);
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
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <TextField
                                    error={sellerCodeNull}
                                    fullWidth
                                    required
                                    label="Seller Code"
                                    variant="outlined"
                                    name='seller_code'
                                    value={sellerUpdate?.seller_code}
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
                                    value={sellerUpdate.seller_name}
                                    onChange={handleChange}
                                    helperText={sellerNameNull ? "Incorrect seller name." : ""}
                                />
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Close</Button>
                    <Button variant="contained" color="warning" onClick={() => handleEdit(sellerUpdate)} autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default SellerEditComponent;