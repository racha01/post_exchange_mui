import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination } from '../interfaces/api/common';
import { DeliverGoodsCusOff, SumCusOff } from '../interfaces/api/deliverGoodsCutOff';
import { useTheme } from '@mui/material';

const TAX_RATE = 0.07;

function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
}

function priceRow(qty: number, unit: number) {
    return qty * unit;
}

function createRow(desc: string, qty: number, unit: number) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
}

interface Row {
    desc: string;
    qty: number;
    unit: number;
    price: number;
}

function subtotal(items: readonly Row[]) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
    createRow('Paperclips (Box)', 100, 1.15),
    createRow('Paper (Case)', 10, 45.99),
    createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;


interface DeliverGoodsCusOffTableProps {
    sellerId: string
}

export default function DeliverGoodsCutOffTable({ sellerId }: DeliverGoodsCusOffTableProps) {
    const [data, setData] = React.useState<Pagination<DeliverGoodsCusOff>>();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [sumCusOff, setSumCusOff] = React.useState<SumCusOff>();
    const theme = useTheme();
    React.useEffect(() => {
        const fetchDeliverGoodsCutOffData = async () => {
            try {
                const response = await fetch(`https://localhost:7287/api/deliver-goods/cut-off`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const result = await response.json() as Pagination<DeliverGoodsCusOff>;
                let sumTotalCost = 0;
                let sumTotalCashPrice = 0;
                let sumTotalAccruals = 0;
                let sumNetProfitCashPrice = 0;
                let sumNetProfitAccrualsPrice = 0;
                result.items.forEach(element => {
                    sumTotalCost += element.total_cost
                    sumTotalCashPrice += element.total_cash_price
                    sumTotalAccruals += element.total_accruals_price
                    sumNetProfitCashPrice += element.net_profit_cash_price
                    sumNetProfitAccrualsPrice += element.net_profit_accruals_price
                    setSumCusOff({
                        sum_total_cost: sumTotalCost,
                        sum_total_cash_price: sumTotalCashPrice,
                        sum_total_accruals_price: sumTotalAccruals,
                        sum_net_profit_cash_price: sumNetProfitCashPrice,
                        sum_net_profit_accruals_price: sumNetProfitAccrualsPrice
                    })
                });

                setData(result)
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDeliverGoodsCutOffData();
    }, [])
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead>
                    {/* <TableRow>
                        <TableCell align="center" colSpan={5}>
                            Details
                        </TableCell>
                        <TableCell align="right">Price</TableCell>
                    </TableRow> */}
                    <TableRow>
                        <TableCell>รหัสผู้ฝากขาย</TableCell>
                        <TableCell>ชื่อผู้ฝากขาย</TableCell>
                        <TableCell align="right">ยอดขายส่งรวม</TableCell>
                        <TableCell align="right">ยอดขายสดรวม</TableCell>
                        <TableCell align="right">ยอดขายเซ็นรวม</TableCell>
                        <TableCell align="right">กำไร</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.items.map((row) => (
                        <TableRow key={row.seller_id}>
                            <TableCell>{row.seller_code}</TableCell>
                            <TableCell>{row.seller_name}</TableCell>
                            <TableCell align="right">{row.total_cost}</TableCell>
                            <TableCell align="right">{row.total_cash_price}</TableCell>
                            <TableCell align="right">{row.total_accruals_price}</TableCell>
                            <TableCell align="right">{row.net_profit_cash_price} ~ {row.net_profit_accruals_price}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{backgroundColor: theme.palette.action.selected}}>
                        <TableCell colSpan={2} sx={{textAlign: 'center'}}><strong>รวม</strong></TableCell>
                        <TableCell align="right"><strong>{sumCusOff?.sum_total_cost}</strong></TableCell>
                        <TableCell align="right"><strong>{sumCusOff?.sum_total_cash_price}</strong></TableCell>
                        <TableCell align="right"><strong>{sumCusOff?.sum_total_accruals_price}</strong></TableCell>
                        <TableCell align="right"><strong>{sumCusOff?.sum_net_profit_cash_price} ~ {sumCusOff?.sum_net_profit_accruals_price}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell rowSpan={3} />
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>ยอดที่ต้องส่งคืนผู้ฝากขาย</TableCell>
                        <TableCell align="right">{sumCusOff?.sum_total_cost}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>ยอดที่ PX ได้กำไร</TableCell>
                        <TableCell align="right">{sumCusOff?.sum_net_profit_cash_price} ~ {sumCusOff?.sum_net_profit_accruals_price}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>ยอดรวมทั้งหมด</TableCell>
                        <TableCell align="right">{sumCusOff?.sum_total_cash_price} ~ {sumCusOff?.sum_total_accruals_price}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}