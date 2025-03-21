import * as XLSX from 'xlsx';

interface ExportExcelProp {
    data: Array<{ [key: string]: any }>
}

export function exportExcel({
    data,
}: ExportExcelProp) {
    // const insertRowAtTop = (data: any, newRow: any) => {
    //     data.splice(0, 0, newRow);
    // };

    // const newRow = ["NewHeader1", "NewHeader2", "NewHeader3"];
    // insertRowAtTop(data, newRow);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    const range = ws['!ref'];
    let lastRow = 0;
    if (range) {
        const [start, end] = range.split(':');
        lastRow = parseInt(end.match(/\d+/)?.[0] || '1');
        console.log(`The last row is at position: ${lastRow}`);
    }
    const expandSheetRange = (worksheet: XLSX.WorkSheet, rowsToAdd: number) => {
        const currentRef = worksheet['!ref'];
        if (!currentRef) {
            throw new Error("Worksheet does not have a defined range");
        }

        const [start, end] = currentRef.split(':');
        const endCol = end.match(/[A-Z]+/g)?.[0] || 'A'; // คอลัมน์สุดท้าย เช่น B
        const endRow = parseInt(end.match(/\d+/)?.[0] || '1'); // แถวสุดท้าย เช่น 4

        const newEndRow = endRow + rowsToAdd;

        const newRef = `${start}:${endCol}${newEndRow}`;
        worksheet['!ref'] = newRef;
    };
    expandSheetRange(ws, 2);

    ws[`A${lastRow + 2}`] = { t: 's', v: 'รวม' };
 
    ws[`E${lastRow + 2}`] = { t: 's', v: 'รวม', f: `SUM(E3:E${lastRow})` };
    ws['A1'] = { t: 's', v: 'รายการส่งสินค้า' };
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        { s: { r: (lastRow + 1), c: 0 }, e: { r: (lastRow + 1), c: 3 } },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'data.xlsx');

}