'use client';

import { Autocomplete, Avatar, Box, Button, Divider, IconButton, Skeleton, Step, StepConnector, stepConnectorClasses, StepIconProps, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import PrintIcon from '@mui/icons-material/Print';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Check, Clear, KeyOff, Margin, Scale } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import dropdownScheduledLineList from "../data/dropdown_scheduled_list";
import DatePickerComponent from "../components/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import LineDatas, { LineData } from "../data/line_data";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface LineDetailPaperProps {
    height: string
}

const LineDetailPaper = styled(Paper)<LineDetailPaperProps>(({ theme, height }) => ({
    width: '100%',
    height: height,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    '& h4': {
        color: 'blue',
        textAlign: 'start'
    },
    '& h2': {
        textAlign: 'start'
    },
    '& #product-detail-value': {
        fontWeight: 'bold'
    },
    '& .line-detail-content': {
        paddingTop: '10px'
    },
    '& .line-detail-content div': {
        display: 'flex',
        justifyContent: 'space-between',
    },
    '& #test': {
        textAlign: 'start'
    }
}));

const steps = [
    'assign transporter',
    'prepare product',
    'delivering',
    'completed',
];

// enum TrackingEnum {
//     AssignTransporter = 'assign transporter',
//     Down = 'DOWN',
//     Left = 'LEFT',
//     Right = 'RIGHT'
// }

const items = [{
    id: 0,
    name: "Moplen EP400L 25 kg bag",
}]

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#04CE13',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#04CE13',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
        ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[800],
        }),
    },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme }) => ({
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        '& .QontoStepIcon-completedIcon': {
            color: '#04CE13',
            zIndex: 1,
            fontSize: 25,
        },
        '& .QontoStepIcon-circle': {
            width: 15,
            height: 15,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[700],
        }),
        variants: [
            {
                props: ({ ownerState }) => ownerState.active,
                style: {
                    color: '#F70000',
                },
            },
        ],
    }),
);

function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className, error } = props;
    console.log("completed");
    console.log(completed);
    console.log("error");
    console.log(error);
    console.log("active");
    console.log(active);
    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {error ? <Clear className="QontoStepIcon-clearIcon" /> : completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}
const dropdownList = dropdownScheduledLineList?.map(item => ({
    ...item,
    label: item.name,
    value: item.name
})) ?? [];

const stepOfPage: number = 0;

interface LineDetailProps {
    id: number,
    clickBack: (pathName: string) => void;
}

export default function LineDetail({ id, clickBack }: LineDetailProps) {

    const [deliverGoodsDate, setdeliverGoodsDate] = React.useState<Dayjs | null>(dayjs(dayjs().format("MM/DD/YYYY")));
    const [stepActive, setStepActive] = React.useState(0);
    const [isActive, setIsActive] = React.useState(false);
    const [lineData, setLineData] = React.useState<LineData | null>(null)
    const searchParams = useSearchParams();
    const [loding, setLoding] = React.useState(true);
    // const lineId: number = id;
    const stepReject: number = -1;

    const isStepFailed = (step: number) => {
        return step === stepReject;
    };

    const searchByLineId = (lineId: number): LineData => {
        return LineDatas.find((item) => item.lineId === lineId) as LineData;
    };

    React.useEffect(() => {
        stepOfPage === stepActive ? setIsActive(true) : setIsActive(false);
        setLineData(searchByLineId(id));
        setTimeout(() => {
            setLoding(false)
        }, 1000);
    }, [id, stepOfPage, stepActive]);



    const handleChangeStepActive = () => {
        setStepActive((i) => {
            let step = i + 1;
            if (step > steps.length) {
                step = 0;
            }
            return step;
        });
    }

    function handleDateChange(newValue: Dayjs | null) {
        setdeliverGoodsDate(newValue)
    }
    return (
        <React.Fragment>
            <Grid container spacing={2} padding={2} columnSpacing={{ md: 3 }}>
                <Grid size={12}
                    container
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}>
                    {loding ? (<Skeleton height='2em'>
                        <h2>Scheduled Line Code {lineData?.scheduledLineCode}</h2>
                    </Skeleton>)
                        : (<Stack direction="row" spacing={0} sx={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <IconButton aria-label="delete" size="large" onClick={() => clickBack("/home")}>
                                <ArrowBackIcon />
                            </IconButton>
                            <h2>Scheduled Line Code {lineData?.scheduledLineCode}</h2>
                        </Stack>)}
                    <Button variant="contained" startIcon={<PrintIcon />} onClick={handleChangeStepActive}>
                        Print Document
                    </Button>
                </Grid>
                <Grid size={9}>
                    <LineDetailPaper className="content" height='100%' elevation={2} variant="elevation">
                        <Stack
                            direction="column"
                            divider={<Divider orientation="horizontal" flexItem sx={{
                                borderWidth: 1
                            }} />}
                            spacing={1}
                        >
                            <Grid size={12}>
                                <Box sx={{ marginBottom: '10px' }}>
                                    <h4>Transport Oder Status</h4>
                                </Box>
                                <Grid size={5}>
                                    {loding ? (
                                        <Skeleton variant="rectangular" width="100%">
                                            <div style={{ paddingTop: '10.5%' }} />
                                        </Skeleton>
                                    ) : (<Box sx={{ width: '100%' }}>
                                        <Stepper alternativeLabel activeStep={stepActive} connector={<QontoConnector />}>
                                            {steps.map((label, index) => {
                                                const labelProps: {
                                                    optional?: React.ReactNode;
                                                    error?: boolean;
                                                } = {};
                                                if (isStepFailed(index)) {
                                                    labelProps.optional = (
                                                        <Typography variant="caption" color="error">
                                                            กรุณาติดต่อ Admin
                                                        </Typography>
                                                    );
                                                    labelProps.error = true;
                                                }

                                                return (
                                                    <Step key={label}>
                                                        <StepLabel  {...labelProps} slots={{
                                                            stepIcon: QontoStepIcon
                                                        }}
                                                        >{label}</StepLabel>
                                                    </Step>
                                                );
                                            }
                                            )}
                                        </Stepper>
                                    </Box>)}
                                </Grid>
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ marginBottom: '10px' }}>
                                    <h4>Register driver and plate car number</h4>
                                </Box>
                                <Grid size={12} direction="row" container spacing={2}>
                                    <Grid size={12} container spacing={2}>
                                        <Grid size={{ sm: 12, md: 4 }}>
                                            <TextField
                                                disabled={!isActive}
                                                fullWidth
                                                label="Line Name"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={{ sm: 12, md: 4 }}>
                                            <TextField
                                                disabled={!isActive}
                                                type="number"
                                                fullWidth
                                                label="Tikt Time"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={{ sm: 12, md: 4 }}>
                                            <Autocomplete
                                                disablePortal
                                                options={dropdownList}
                                                fullWidth
                                                disabled={!isActive}
                                                // value={selectedValue}
                                                // onChange={handleSelect}
                                                renderInput={(params) =>
                                                    <Grid size={{  xs: 28,sm: 24, md: 12 }}>
                                                        <TextField
                                                            // error={productIdIsNull}
                                                            {...params} label="Scheduled Line Name"
                                                        // helperText={productIdIsNull ? "Incorrect product name." : ""}
                                                        />
                                                    </Grid>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid size={12} container spacing={2}>
                                        <Grid size={6}>
                                            <TextField
                                                disabled={!isActive}
                                                fullWidth
                                                label="Seal No"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                disabled={!isActive}
                                                fullWidth
                                                label="Tare Weight"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid size={12} container spacing={2}>
                                        <Grid size={6}>
                                            <TextField
                                                disabled={!isActive}
                                                fullWidth
                                                label="Time slot"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <DatePickerComponent
                                                disabled={!isActive}
                                                name='deliver_good_date'
                                                label='Location Date'
                                                date={deliverGoodsDate ?? dayjs()}
                                                handleDateChange={() => handleDateChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {isActive &&
                                            <Button variant="contained" onClick={handleChangeStepActive} >
                                                Assign
                                            </Button>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={12} sx={{ textAlign: 'start' }} >
                                <Box>
                                    <h4>Shipping Address</h4>
                                </Box>
                                <Grid size={12} container spacing={1} >
                                    <Grid size={6} container direction="column" spacing={1} >
                                        <Stack direction="column" spacing={0}>
                                            <Box>
                                                {loding ? (<Skeleton height={15}>
                                                    <span style={{ fontSize: '11px' }}>Sold To</span>
                                                </Skeleton>) : (<span style={{ fontSize: '11px' }}>Sold To</span>)}
                                            </Box>
                                            <Box>
                                                {loding ? (<Skeleton height={20}>
                                                    <span style={{ fontSize: '14px' }}>Apex Plastech Co.,ltd</span>
                                                </Skeleton>) : (<span style={{ fontSize: '14px' }}>Apex Plastech Co.,ltd</span>)}

                                            </Box>
                                        </Stack>
                                        <Stack direction="column" spacing={0}>
                                            <Box>
                                                {loding ? (<Skeleton height={15}>
                                                    <span style={{ fontSize: '11px' }}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
                                                </Skeleton>) : (
                                                    <span style={{ fontSize: '11px' }}>634 ถนนบางขุนเทียน-ชายทะเล แขวงท่าข้าม เขตบางขุนเทียน กรุงเทพฯ 10150</span>
                                                )}
                                            </Box>
                                            <Box>
                                                {loding ? (<Skeleton height={15}>
                                                    <span style={{ fontSize: '11px', paddingRight: '10%' }}>XXXXXXXXXXXXXXXXX</span>
                                                </Skeleton>) : (
                                                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Sold To Code: 906038</span>
                                                )}
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton aria-label="delete" color="info">
                                            <CompareArrowsIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid size={5} container direction="column" spacing={1} >
                                        <Stack direction="column" spacing={0}>
                                            <Box>
                                                {loding ? (<Skeleton height={15}>
                                                    <span style={{ fontSize: '11px' }}>Sold To</span>
                                                </Skeleton>) : (<span style={{ fontSize: '11px' }}>Sold To</span>)}
                                            </Box>
                                            <Box>
                                                {loding ? (<Skeleton height={20}>
                                                    <span style={{ fontSize: '14px' }}>Apex Plastech Co.,ltd</span>
                                                </Skeleton>) : (<span style={{ fontSize: '14px' }}>Apex Plastech Co.,ltd</span>)}

                                            </Box>
                                        </Stack>
                                        <Stack direction="column" spacing={0} className="stack-span" >
                                            <Box >
                                                {loding ? (<Skeleton height={15}>
                                                    <span style={{ fontSize: '11px' }}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
                                                </Skeleton>) : (
                                                    <span style={{ fontSize: '11px', textAlign: 'start' }}>634 ถนนบางขุนเทียน-ชายทะเล แขวงท่าข้าม เขตบางขุนเทียน กรุงเทพฯ 10150</span>
                                                )}
                                            </Box>
                                            <Box>
                                                {loding ? (<Skeleton height={15}>
                                                    <span style={{ fontSize: '11px', paddingRight: '10%' }}>XXXXXXXXXXXXXXXXX</span>
                                                </Skeleton>) : (
                                                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Sold To Code: 906038</span>
                                                )}
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={12} sx={{ textAlign: 'start' }}>
                                <Box>
                                    <h4>Product Detail</h4>
                                </Box>
                                <Box marginLeft={3}>
                                    <ul>
                                        {items.map((item, index) => (
                                            <React.Fragment key={index}>
                                                {loding ? (
                                                    <Skeleton height='3em'>
                                                        <li key={index}>{item.name}</li>
                                                    </Skeleton>
                                                ) : (<li key={index}>{item.name}</li>)}

                                                <Stack direction="row" spacing={10}>
                                                    <Box>{loding ? (<React.Fragment>
                                                        <Skeleton height='2em'>
                                                            <span>Product No: </span><span id='product-detail-value'>610033.0025</span>
                                                        </Skeleton>
                                                    </React.Fragment>) : (<React.Fragment>
                                                        <span>Product No: </span><span id='product-detail-value'>610033.0025</span>
                                                    </React.Fragment>)}</Box>
                                                    <Box>{loding ? (<React.Fragment>
                                                        <Skeleton height='2em'>
                                                            <span>Log No: </span><span id='product-detail-value'>60136344</span>
                                                        </Skeleton>
                                                    </React.Fragment>) : (<React.Fragment>
                                                        <span>Log No: </span><span id='product-detail-value'>60136344</span>
                                                    </React.Fragment>)}</Box>
                                                    <Box>{loding ? (<React.Fragment>
                                                        <Skeleton height='2em'>
                                                            <span>Storage Location/WH: </span><span id='product-detail-value'>GCL-STN</span>
                                                        </Skeleton>
                                                    </React.Fragment>) : (<React.Fragment>
                                                        <span>Storage Location/WH: </span><span id='product-detail-value'>GCL-STN</span>
                                                    </React.Fragment>)}</Box>
                                                </Stack>
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                </Box>
                            </Grid>
                        </Stack>
                    </LineDetailPaper>
                </Grid>
                <Grid size={3}>
                    <LineDetailPaper height='70%' elevation={2} variant="elevation">
                        <h4>Line Detail</h4>
                        <Stack
                            direction="column"
                            divider={<Divider orientation="horizontal" flexItem sx={{
                                borderWidth: 1
                            }} />}
                            spacing={1}
                        >
                            <Stack
                                direction="column"
                                className="line-detail-content"
                                spacing={3}
                            >
                                <div>
                                    <span>Name</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.name}</span>)}

                                </div>
                                <div>
                                    <span>Scheduled Line Name</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.scheduledLineName}</span>)}
                                </div>
                                <div>
                                    <span>Takt Time</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.taktTime}</span>)}
                                </div>
                                <div>
                                    <span>Create On</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.createdOn}</span>)}
                                </div>
                                <div>
                                    <span>Create By</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.createdBy}</span>)}
                                </div>
                                <div>
                                    <span>Modifiled On</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.modifiedOn}</span>)}
                                </div>
                                <div>
                                    <span>Modifiled By</span>
                                    {loding ? (<Skeleton height={20}>
                                        <span>XXXXXXXXXXXXXX</span>
                                    </Skeleton>) :
                                        (<span>{lineData?.modifiedBy}</span>)}
                                </div>
                            </Stack>
                            <Box><h5>Remark</h5></Box>
                        </Stack>
                    </LineDetailPaper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}