import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FC, useState, memo, useEffect } from 'react';
import { AnimateCssTransition } from '../transitions/amimate';
import { BouncingInOut } from '@/app/functions/amimetion_dialog'
import { deleteDeliverGoodsStore } from '../redux/features/deliverGoods/deliverGoodsSlice';
import { useAppDispatch } from '../hooks';
interface Props {
    id: string,
    deleteOpen: boolean;
    onClose: () => void;
}

const DeleteComponent: FC<Props> = React.memo(({ id, deleteOpen, onClose }) => {
    const [open, setOpen] = React.useState(false);
    const [animationKey, setAnimationKey] = React.useState(0);
    // const handleCloseDialog = () => setOpen(false);

    React.useEffect(() => {
        setOpen(deleteOpen);
    }, [deleteOpen]);

    const handleClose = async () => {
        setOpen(false);
        // setIsError(false);
        // await setValueDefault();
    };

    const dispatch = useAppDispatch();
    const handleDelete = async (id: string) => {
        await dispatch(deleteDeliverGoodsStore(id))
        onClose();
    }

    return (
        <React.Fragment>
            {/* <IconButton aria-label="delete" onClick={() => setOpen(true)} >
                <DeleteIcon />
            </IconButton> */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slots={{
                    transition: AnimateCssTransition
                }}
                slotProps={{
                    transition: {
                        in: open,
                        className: BouncingInOut(open),
                        key: animationKey
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"ลบรายการ"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        คุณแน่ใจว่าต้องการลบรายการนี้
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>ปิด</Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(id)} autoFocus>
                        ลบ
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
});

export default DeleteComponent;