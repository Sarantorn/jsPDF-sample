import * as XLSX from 'xlsx';
import {Injectable} from "@angular/core";
import * as XLSXStyle from 'xlsx-style';
@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  exportExcel(list:any,heading:any,fileName:any): void {

    /* generate workbook and add the worksheet */
    let wb: XLSX.WorkBook = XLSX.utils.book_new();

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(list);
    /* for change name header */
    // let ws = XLSX.utils.json_to_sheet(list, {skipHeader: true});
    // XLSX.utils.sheet_add_aoa(ws, heading);

    /* add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
   XLSX.writeFile(wb, `${fileName}.xlsx`)
    console.timeEnd('generateExcel');
  }













  // exportExcel() {
  //   import("xlsx").then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet(this.sales); // Sale Data
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, "sales");
  //   });
  // }
  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   import("file-saver").then(FileSaver => {
  //     let EXCEL_TYPE =
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //     let EXCEL_EXTENSION = ".xlsx";
  //     const data: Blob = new Blob([buffer], {
  //       type: EXCEL_TYPE
  //     });
  //     FileSaver.saveAs(
  //       data,
  //       fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
  //     );
  //   });
  // }
}
