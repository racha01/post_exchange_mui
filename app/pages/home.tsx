
'use client';
import { useRouter } from 'next/navigation'
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
import LineDatas from '@/app/data/line_data'
import { Line, LineList } from '@/app/interfaces/line'
import DeleteComponent from '@/app/components/DeleteComponent'
import { createSortHandler, getComparator, Order } from '../functions/sort_handler';
import { HeadCell } from '../interfaces/table/head_cell';
import { increment, decrement, incrementByAmount } from '@/app/redux/features/counterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
// import { store } from '@/app/redux/store';
// import { fetchData } from '@/app/redux/features/apiSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks';
const API_URL = 'https://localhost:7287/api/deliver-goods';
const rows: LineList = LineDatas;

const headCells: readonly HeadCell<Line>[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'scheduledLineName',
        numeric: false,
        disablePadding: false,
        label: 'Scheduled Line Name',
    },
    {
        id: 'taktTime',
        numeric: false,
        disablePadding: false,
        label: 'Takt Time',
    },
    {
        id: 'createdOn',
        numeric: false,
        disablePadding: false,
        label: 'Created On',
    },
    {
        id: 'createdBy',
        numeric: false,
        disablePadding: false,
        label: 'Created By',
    },
    {
        id: 'modifiedOn',
        numeric: false,
        disablePadding: false,
        label: 'Modified On',
    },
    {
        id: 'modifiedBy',
        numeric: false,
        disablePadding: false,
        label: 'Modified By',
    },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Line) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}



function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, numSelected, rowCount, onRequestSort } =
        props;

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
                            onClick={createSortHandler(headCell.id, onRequestSort)}
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
interface HomePageProps {
    pathNameFromComponent: (pathName: string, id: number) => void;
}



export default function EnhancedTable({ pathNameFromComponent }: HomePageProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Line>('name');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const toPathName = (pathName: string, id: number) => {
        pathNameFromComponent(pathName, id);
    };
    const router = useRouter();
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Line,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    const [receivedData, setReceivedData] = React.useState("");
    const handleReceiveData = (dataFromB: string) => {
        setReceivedData(dataFromB);
        setDialogOpen(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickOpenLineDetail = (id: number) => {
        router.push(`/line-detail?id=${id}`)
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...rows]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage],
    );
    // const dispatch = useDispatch();
    // const count = useSelector((state: RootState) => state.counter.value);

    const dispatch = useAppDispatch();
    // const { data, loading, error } = useAppSelector((state) => state.fetchDeliverGoodsDatas);

    React.useEffect(() => {
        // dispatch(fetchData(API_URL));
    }, [dispatch]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            // onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                // const isItemSelected = selected.includes(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <StyledTableRow

                                        // hover={true}
                                        onClick={(event) => handleClick(event, row.lineId)}
                                        role="checkbox"
                                        // aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                    // selected={isItemSelected}
                                    // sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Stack direction="row" spacing={-1.5}>
                                                <IconButton aria-label="delete" onClick={() => toPathName('/line-detail-test', row.lineId)}>
                                                    <VisibilityTwoToneIcon />
                                                </IconButton>
                                                {/* <DeleteComponent line={row} /> */}
                                            </Stack>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align='left'>{row.scheduledLineName}</TableCell>
                                        <TableCell align='left'>{row.taktTime}</TableCell>
                                        <TableCell align='left'>{row.createdOn}</TableCell>
                                        <TableCell align='left'>{row.createdBy}</TableCell>
                                        <TableCell align='left'>{row.modifiedOn}</TableCell>
                                        <TableCell align='left'>{row.modifiedBy}</TableCell>
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
                    count={rows.length}
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
