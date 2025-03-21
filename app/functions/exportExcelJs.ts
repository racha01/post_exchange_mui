import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
interface ExportExcelProp {
    data: Array<{ [key: string]: string | number }>,
    sellerName?: string,
    dateRange: string | null
}
export const createExcelFileJS = async ({
    data,
    sellerName,
    dateRange
}: ExportExcelProp) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sample Sheet');
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = `รายการส่งสินค้า ${sellerName ?? 'ทั้งหมด'} ${(dateRange === '') ? '' : `ประจำวันที่ ${dateRange}`}`;
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').font = { bold: true, size: 16 };

    const headerRow = worksheet.addRow(['ว.ด.ป.', 'รายการ', 'จำนวน', 'ราคา', 'รวมราคา']);
    headerRow.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { bold: true, size: 14 };
    });


    worksheet.columns = [
        { key: 'date', width: 10 },
        { key: 'item', width: 20 },
        { key: 'amount', width: 7 },
        { key: 'wholesalePrice', width: 7 },
        { key: 'totalPrice', width: 10 },
    ];
    data.forEach((element) => {
        const row = worksheet.addRow([
            element.date,
            element.item,
            element.amount,
            element.wholesalePrice,
            element.totalPrice,
        ]);
        row.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
    });

    const lastRowNumber = worksheet.lastRow?.number ?? 0;
    const sumCell = worksheet.getCell(`E${lastRowNumber + 1}`);
    sumCell.value = { formula: `SUM(E2:E${lastRowNumber})`, result: 0 };

    worksheet.getCell(`A${lastRowNumber + 1}`).value = 'รวมทั้งหมด';
    worksheet.mergeCells(`A${lastRowNumber + 1}:D${lastRowNumber + 1}`);
    worksheet.getCell(`A${lastRowNumber + 1}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`A${lastRowNumber + 1}`).font = { bold: true };
    sumCell.alignment = { horizontal: 'right', vertical: 'middle' };

    worksheet.getCell('A1').font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'example.xlsx');
};