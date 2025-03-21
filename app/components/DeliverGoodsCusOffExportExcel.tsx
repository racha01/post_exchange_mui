import * as React from 'react';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Stack from '@mui/material/Stack';
import { ExcelSchemaBuilder } from '@chronicstone/typed-xlsx'
import * as XLSX from 'xlsx';
interface ExportExcelProp {
  data: []
}

export default function DeliverGoodsCusOffExportExcelComponent({
  data,
}: ExportExcelProp) {
  // const data = [
  //   { name: 'John', age: 28, city: 'New York' },
  //   { name: 'Alice', age: 24, city: 'Los Angeles' },
  //   { name: 'Bob', age: 32, city: 'Chicago' },
  // ];


  const handleCilck = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    // const ws = XLSX.utils.aoa_to_sheet([[]]); 

    // ws['!ref'] = 'A1:E4';
    ws['A1'] = { t: 's', v: 'ว.ด.ป.' };
    ws['B1'] = { t: 's', v: 'รายการ' };
    ws['C1'] = { t: 's', v: 'จำนวน' };
    ws['D1'] = { t: 's', v: 'ราคาส่ง' };
    ws['E1'] = { t: 's', v: 'ราคารวม' };
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    console.log(ws)
    XLSX.writeFile(wb, 'data.xlsx');
  }
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" startIcon={<ArrowUpwardIcon />} onClick={handleCilck}>
        Export
      </Button>
    </Stack>
  );
}