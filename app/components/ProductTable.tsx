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
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { StyledTableRow } from "@/app/functions/style_table";
import { fetchProductById, fetchProductDatas } from '@/app/redux/features/product/productSlice'
import { fetchSellerData } from '@/app/redux/features/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { CreateInfo, Pagination, UpdateInfo } from '../interfaces/api/common';
import { getComparator, Order } from '../functions/sort_handler';
import { Seller } from '../interfaces/api/sellser';
import FullScreenLoading from './FullScreenLoading';
import SellerEditComponent from './SellerEdit';
import { GetProduct } from '../interfaces/api/product';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/redux/store';
import ProductEditComponent from '@/app/components/ProductEdit'
import { delay } from '@/app/functions/time';
interface HeadCell {
    disablePadding: boolean;
    id: keyof GetProduct;
    label: string;
    numeric: boolean;
}
const headCells: readonly HeadCell[] = [
    {
        id: 'seller_code',
        numeric: false,
        disablePadding: true,
        label: 'Seller Code',
    },
    {
        id: 'seller_name',
        numeric: false,
        disablePadding: false,
        label: 'Seller Name',
    },
    {
        id: 'product_code',
        numeric: false,
        disablePadding: true,
        label: 'Product Code',
    },
    {
        id: 'product_name',
        numeric: false,
        disablePadding: false,
        label: 'Product Name',
    },
    {
        id: 'wholesale_price',
        numeric: true,
        disablePadding: false,
        label: 'wholesale_price',
    },
    {
        id: 'cash_price',
        numeric: true,
        disablePadding: false,
        label: 'cash_price',
    },
    {
        id: 'accruals_price',
        numeric: true,
        disablePadding: false,
        label: 'accruals_price',
    },

];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof GetProduct) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof GetProduct) => (event: React.MouseEvent<unknown>) => {
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
interface EnhancedTableToolbarProps {
    numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.mode,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
export default function ProductTable() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof GetProduct>('seller_code');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectId, setSelectId] = React.useState('');
    const [editOpen, setEditOpen] = React.useState(false);
    const [editIsError, setEditIsError] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.product);
    React.useMemo(() => {
        dispatch(fetchProductDatas())
    }, [dispatch]);

    const [maxHeight, setMaxHeight] = React.useState<string>('500px');

    React.useEffect(() => {
        const updateHeight = () => {
            const height = window.innerHeight - 225;
            setMaxHeight(`${height}px`);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const rows: Pagination<Seller> | null = data;
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof GetProduct,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const [loadinggg, setLoading] = React.useState(false);

    const toggleLoading = () => {
        setLoading(!loadinggg);
        setTimeout(() => setLoading(false), 3000);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rows?.items.length ?? 0)) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...data?.items || []]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, data],
    );

    const handleEditOpen = () => {
        setEditOpen(true)
    }
    if (loading) return <FullScreenLoading loading={loading} />

    const handleClickOpen = async (id: string, sellerId: string) => {
        console.log("start click")
        console.log(sellerId)
        setSelectId(id)
        setEditOpen(true)
        await dispatch(fetchProductById(id));
        await dispatch(fetchSellerData(sellerId));
    };
    
    const handleClose = async () => {
        setEditIsError(false)
        setEditOpen(false);
        await delay(500);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: maxHeight }}>
                    <Table
                        stickyHeader
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.items.length || 0}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <StyledTableRow key={row.id || index}
                                    >
                                        <TableCell padding="checkbox">
                                            <Stack direction="row" spacing={-1.5}>
                                                <IconButton
                                                    onClick={() => handleClickOpen(row.id, row.seller_id)}
                                                    aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                                {(selectId == row.id) &&
                                                    <ProductEditComponent
                                                        editOpen={editOpen}
                                                        editIsError={editIsError}
                                                        onClose={handleClose}
                                                    />}
                                                <IconButton aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.seller_code}
                                        </TableCell>
                                        <TableCell align='left'>{row.seller_name}</TableCell>
                                        <TableCell align='left'>{row.product_code}</TableCell>
                                        <TableCell align='left'>{row.product_name}</TableCell>
                                        <TableCell align='right'>{row.wholesale_price}</TableCell>
                                        <TableCell align='right'>{row.cash_price}</TableCell>
                                        <TableCell align='right'>{row.accruals_price}</TableCell>
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
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows?.items.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
