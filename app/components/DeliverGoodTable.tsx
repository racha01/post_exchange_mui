import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import Stack from '@mui/material/Stack';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import { styled } from '@mui/material/styles';
import { StyledTableRow } from "@/app/functions/style_table";
import { DeliverGoodQueryParam, GetDeliverGoods } from '../interfaces/api/deliverGoods';
import { getComparator } from '../functions/sort_handler';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { selectDeliverGoodsList, selectDeliverGoodsLoading } from '@/app/redux/features/deliverGoods/deliverGoodsSelectors';
import { fetchDeliverGoodsDatas } from '../redux/features/deliverGoods/deliverGoodsSlice';
import { HeadCell, HeadCellKeyString } from '../interfaces/table/head_cell';
import { stringToDateTime, stringToDate, delay, stringToDateThai } from '@/app/functions/time'
import FullScreenLoading from './FullScreenLoading';
import DeliverGoodsEditComponent from './DeliverGoodEdit';
import EditIcon from '@mui/icons-material/Edit';
import { fetchProductById, fetchProductDatas } from '@/app/redux/features/product/productSlice'
import { fetchDeliverGoodsById } from '@/app/redux/features/deliverGoods/deliverGoodsSlice'
import DeleteComponent from './DeleteComponent';
type Order = 'asc' | 'desc';

const headCells: readonly HeadCellKeyString<GetDeliverGoods>[] = [
    {
        id: 'deliver_good_date',
        numeric: false,
        disablePadding: true,
        label: 'วันที่ส่งสินค้า',
    },
    {
        id: 'seller_code',
        numeric: false,
        disablePadding: true,
        label: 'รหัสผู้ส่งสินค้า',
    },
    {
        id: 'seller_name',
        numeric: false,
        disablePadding: false,
        label: 'ชื่อผู้ส่งสินค้า',
    },
    {
        id: 'product_code',
        numeric: false,
        disablePadding: false,
        label: 'รหัสสินค้า',
    },
    {
        id: 'product_name',
        numeric: false,
        disablePadding: false,
        label: 'ชื่อสินค้า',
    },
    {
        id: 'wholesale_price',
        numeric: true,
        disablePadding: false,
        label: 'ราคาส่ง',
    },
    {
        id: 'cash_price',
        numeric: true,
        disablePadding: false,
        label: 'ราคาสด',
    },
    {
        id: 'accruals_price',
        numeric: true,
        disablePadding: false,
        label: 'ราคาเซ็น',
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'จำนวน',
    },
    {
        id: 'leftovers',
        numeric: true,
        disablePadding: false,
        label: 'จำหน่าย',
    },
    // {
    //     id: 'create_info.timestap',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Create Timestap',
    // },
    // {
    //     id: 'create_info.user_name',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Create User Name',
    // },
    // {
    //     id: 'update_info.timestap',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Update Timestap',
    // },
    // {
    //     id: 'update_info.user_name',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Update User Name',
    // },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof GetDeliverGoods | string) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof GetDeliverGoods | string) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox">
                </StyledTableCell>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        // align='center'
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.mode,
        // color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

interface Props {
    sellerId: string | undefined,
    startDate: string | null,
    endDate: string | null
}

export default function DeliverGoodsTable({ sellerId, startDate, endDate }: Props) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof GetDeliverGoods | string>('deliver_good_date');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [isDelete, setIsDelete] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [selectIdEdit, setSelectIdEdit] = React.useState('');
    const [selectIdDelete, setSelectIdDelete] = React.useState('');
    // const { data, loading, error } = useSelector((state: RootState) => state.product);
    // const deliverGoodsList = selectDeliverGoodsList;
    const deliverGoodsList = useSelector(selectDeliverGoodsList);
    const loading = useSelector(selectDeliverGoodsLoading);
    // const loading = useSelector(selectUserLoading);
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [editIsError, setEditIsError] = React.useState(false);
    React.useEffect(() => {
        dispatch(fetchDeliverGoodsDatas({}));
    }, [dispatch]);

    // const rows: Pagination<GetDeliverGoods> | null = deliverGoodsList;
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof GetDeliverGoods | string,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    //     const selectedIndex = selected.indexOf(id);
    //     let newSelected: readonly number[] = [];
    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1),
    //         );
    //     }
    //     setSelected(newSelected);
    // };
    const [receivedData, setReceivedData] = React.useState("");
    const handleReceiveData = (dataFromB: string) => {
        setReceivedData(dataFromB);
        setDialogOpen(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleClickDelete = () => {
        setIsDelete(true);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = async () => {
        setEditIsError(false)
        setEditOpen(false);
        await delay(500);
        const deliverGoodsParam: DeliverGoodQueryParam = {};

        if (sellerId !== undefined) {
            deliverGoodsParam.sellerId = sellerId;
        }
        if (startDate !== null && endDate !== null) {
            deliverGoodsParam.startDate = startDate;
            deliverGoodsParam.endDate = endDate;
        }

        const params: DeliverGoodQueryParam = { ...deliverGoodsParam };
        await dispatch(fetchDeliverGoodsDatas(params))
    };
    const handleDeleteClose = async () => {
        setDeleteOpen(false);
        const deliverGoodsParam: DeliverGoodQueryParam = {};

        if (sellerId !== undefined) {
            deliverGoodsParam.sellerId = sellerId;
        }
        if (startDate !== null && endDate !== null) {
            deliverGoodsParam.startDate = startDate;
            deliverGoodsParam.endDate = endDate;
        }

        const params: DeliverGoodQueryParam = { ...deliverGoodsParam };
        await dispatch(fetchDeliverGoodsDatas(params))
        await delay(500);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const handleClickOpen = async (id: string, productId: string) => {
        setSelectIdEdit(id)
        setEditOpen(true)
        await dispatch(fetchDeliverGoodsById(id));
    };
    const handleClickDeleteOpen = async (id: string) => {
        setSelectIdDelete(id)
        setDeleteOpen(true)
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (deliverGoodsList?.items.length ?? 0)) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...deliverGoodsList?.items || []]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, deliverGoodsList],
    );
    if (loading) return <FullScreenLoading loading={loading} />
    return (
        <Box sx={{ width: '100%', zIndex: 0 }}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table
                        stickyHeader
                        // sx={{ minWidth: 2100 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={deliverGoodsList?.items.length || 0}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                // const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <StyledTableRow key={row.id || index}>
                                        <TableCell padding="checkbox">
                                            <Stack direction="row" spacing={-1.5}>
                                                <IconButton
                                                    onClick={() => handleClickOpen(row.id, row.product_id)}
                                                    aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                                {(selectIdEdit == row.id) &&
                                                    <DeliverGoodsEditComponent
                                                        editOpen={editOpen}
                                                        editIsError={editIsError}
                                                        onClose={handleClose}
                                                    />}
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleClickDeleteOpen(row.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                {(selectIdDelete == row.id) &&
                                                    <DeleteComponent
                                                        id={selectIdDelete}
                                                        deleteOpen={deleteOpen}
                                                        // editIsError={editIsError}
                                                        onClose={handleDeleteClose}
                                                    />}
                                                {/* <DeleteComponent line={row} /> */}
                                            </Stack>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            // id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {stringToDateThai(row.deliver_good_date)}
                                        </TableCell>
                                        <TableCell align='left'>{row.seller_code}</TableCell>
                                        <TableCell align='left'>{row.seller_name}</TableCell>
                                        <TableCell align='left'>{row.product_code}</TableCell>
                                        <TableCell align='left'>{row.product_name}</TableCell>
                                        <TableCell align='right'>{row.wholesale_price}</TableCell>
                                        <TableCell align='right'>{row.cash_price}</TableCell>
                                        <TableCell align='right'>{row.accruals_price}</TableCell>
                                        <TableCell align='right'>{row.amount}</TableCell>
                                        <TableCell align='right'>{row.leftovers}</TableCell>

                                    </StyledTableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={deliverGoodsList?.items.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
        </Box>
    );
}
