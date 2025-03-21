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
import top100Films from './../datas/data';
import dropdownScheduledLineList from './../data/dropdown_scheduled_list';
import 'animate.css';
import { Backdrop, BackdropProps, PaperProps } from '@mui/material';
// import Slide from "@mui/material/Slide";
import { styled } from '@mui/material/styles';
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Fade from '@mui/material/Fade';
import { CSSTransition } from 'react-transition-group';
import Transition, { TransitionProps } from 'react-transition-group/Transition';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { red } from '@mui/material/colors';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import CustomSlideProps from '@/app/components/CustomSlide'
import Grow from '@mui/material/Grow';
import { IDropdownScheduled, DropdownScheduledLineList } from '@/app/interfaces/dropdown_scheduled_list'
import dropdownScheduledLineData from '@/app/data/dropdown_scheduled_list'
import { AnimateCssTransition } from '@/app/transitions/amimate'
import { BouncingInOut } from '../functions/amimetion_dialog';

const CustomTransition2: React.ElementType<SlideProps> = ({ ref, ...props }) => (
    <Slide ref={ref} direction="up" in={props.in} mountOnEnter unmountOnExit>
        <div className={`animate__animated animate__fadeIn`}>
            {props.children}
        </div>
    </Slide>
);

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

interface OptionType {
    label: string;
    value: number;
}

export default function LineAddComponent() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [taktTime, settaktTime] = React.useState('');
    const [animationKey, setAnimationKey] = React.useState(0);
    const [selectedValue, setSelectedValue] = React.useState<IDropdownScheduled | null>(null);
    async function handleWaitDataAsync() {
        setLoading(true);
    }

    const options: OptionType[] = [
        { label: "Option 1", value: 1 },
        { label: "Option 2", value: 2 },
        { label: "Option 3", value: 3 },
    ];

    const dropdownList: DropdownScheduledLineList = dropdownScheduledLineData.map(item => ({
        ...item,
        label: item.name,
        value: item.scheduledLineCode
    }));

    // const handleSelect = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     value: DropdownScheduledLineList | null
    // ) => {
    //     setSelectedValue(value);
    //     console.log("Selected Value:", value);
    // };
    const handleSelect = (
        event: React.SyntheticEvent<Element, Event>,
        value: IDropdownScheduled | null,
        reason: string
    ) => {
        setSelectedValue(value);
    };

    const AnimetionDialog = (open: boolean): string => {
        return open ?
            "animate__animated animate__bounceIn" :
            "animate__animated animate__bounceOut"
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

    const handleClose = () => {
        setOpen(false);
        setIsError(false);
    };

    const handleCreate = () => {
        if (value === '') {
            setIsError(true);
            setAnimationKey((prevKey) => prevKey + 1)
        }
        else {
            setOpen(false);
            setIsError(false);
        }
    }


    // const CustomBackdrop: React.ElementType<BackdropProps> = (props) => {
    //     return (
    //         <Backdrop
    //             {...props}
    //             sx={{
    //                 backgroundColor: 'rgba(108, 106, 106, 0.19)',
    //                 backdropFilter: 'blur(3px)',
    //                 ...props.sx,
    //             }}
    //         />
    //     );
    // };

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
    // const handleSelect = (event: any, value: React.SetStateAction<null>) => {
    //     setSelectedValue(value); // เก็บค่าที่เลือกไว้ใน state
    //     console.log("Selected Value:", value); // หรือใช้ค่าที่เลือก
    // };


    const CustomBackdrop: React.ElementType<BackdropProps> = (props) => {
        return (<Backdrop {...props} sx={{ transition: "none" }} />)
    };
    const [value, setValue] = React.useState('');
    const [name, setName] = React.useState('Cat in the Hat');
    const handleChange = () => {
        setValue(value);
    };
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
                // onError={}
                // classes={''}
                slots={{
                    paper: CustomPaper,
                    transition: AnimateCssTransition
                }}
                slotProps={{
                    transition: {
                        in: open,
                        className: isError ? 'animate__animated animate__shakeX' : BouncingInOut(open),
                        key: animationKey
                    }
                }}
            // transitionDuration={{
            //     enter: 1000,
            //     exit: 1000
            // }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Create Line"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 1 }}>
                        <Box sx={{ marginTop: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1 }}>
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <TextField fullWidth id="outlined-basic" label="Line Name" variant="outlined" />
                            </Box>
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <Autocomplete
                                    disablePortal
                                    options={dropdownList}
                                    onChange={handleSelect}
                                    renderInput={(params) => <TextField {...params} label="ScheduledLine" />}
                                // isOptionEqualToValue={(option, value) => option.name === value?.name}
                                />
                            </Box>
                            <Box sx={{ gridColumn: 'span 12' }}>
                                <TextField
                                    error={isError}
                                    fullWidth
                                    id="filled-basic"
                                    label="Takt Time"
                                    variant="outlined"
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value)
                                    }}
                                    helperText={isError ? "Incorrect takt time." : ""}
                                />
                            </Box>

                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                    <Button variant="contained" color="success" onClick={handleCreate} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment >
    );
}
