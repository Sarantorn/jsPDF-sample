import {Component, OnInit} from '@angular/core';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {ExcelService} from "./service/ExcelService.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8'
  })



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent   {
  products = [
    {
      name: 'Apples',
      price: 0.99,
      remark: "test",
    },
    {
      name: 'Bread',
      price: 2.49,
      remark: "test",
    },
    {
      name: 'Milk.',
      price: 1.79,
      remark: "test",
    },
    {
      name: 'Eggs',
      price: 1.49,
      remark: "test",
    },
    {
      name: 'Cheese',
      price: 3.99,
      remark: "test",
    },
  ];

  JSON = JSON
  data:any
  col:any

  constructor (
    private http:HttpClient,
    private excelService:ExcelService) {

  }
  generateExcel(){
    console.time('generateExcel');
    let heading = [
      ["Name", "Price", "Remark"],
    ];

    //this.excelService.exportExcel(this.products,heading,"test")










    // this.http.get(`./assets/generated.json`).subscribe((res: any) => {
    //   this.data = res
    //   this.excelService.exportExcel(this.data,heading,"test")
    // });




















    let url = "https://jsonplaceholder.typicode.com/photos"
    this.http.get<any>(url).subscribe((res)=>{
      //console.log(res)
      this.data = res;

      //this.excelService.exportExcel(res,heading,"test")
    })

  }








  generateExcelV2(){
    console.time('generateExcel');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
    //
    // worksheet.columns = [
    //   { header: 'Name', key: 'remark' },
    //   { header: 'Price', key: 'name' },
    // ];
    //
    // products.forEach(product => {
    //   worksheet.addRow(product);
    // });
    //
    // workbook.xlsx.writeBuffer().then(buffer => {
    //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   saveAs(blob, 'Products.xlsx');
    // });


    let url = "https://data.wa.gov/api/views/f6w7-q2d2/rows.json?accessType=DOWNLOAD"
    this.http.get<any>(url).subscribe((res)=>{

      //console.log(res)
      this.data = res.data;
      this.col = res.meta.view.columns

      const columns = this.col.map((col:any) => ({
        header: col.name,
        key: this.camelCase(col.name),
      }));

      worksheet.columns = columns

      let mappedData = this.data.map((row:any) => {
        let obj:any = {};
        row.forEach((val:any, index:any) => {
          obj[columns[index].key] = val;
        });
        worksheet.addRow(obj);
        return obj;
      });

      console.log(this.col)
      console.log(columns)
      console.log(mappedData)



      // mappedData.forEach((data:any) => {
      //   worksheet.addRow(data);
      // });

      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'test.xlsx');
        console.timeEnd('generateExcel');
      });
    })


  }










  camelCase(str:any) {
    return str
      .replace(/\s(.)/g, function(a:any) {
        return a.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, function(b:any) {
        return b.toLowerCase();
      });
  }
















  generatePDF() {
    // Create a new instance of jsPDF
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a7' // Set the format to a7 (74 x 105 mm)
    });

    // Add header content
    doc.setFontSize(20);
    doc.text('Header', doc.internal.pageSize.width / 2, 10,{
      align: 'center'
    });


    // Add content to the PDF
    doc.setFontSize(14);
    doc.text('Hello, world!', 10, 30);

    // // Add footer content
    doc.setFontSize(12);
    doc.text('Footer', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: 'center'
    });


    // Save the PDF
    doc.save('sample.pdf');
  }

  tempData (redata:any, recol:any,realign:any) {
    let data = { content: redata, colSpan: recol, styles: { halign: realign } }

    return data
  }


  async generatePDFTableTest() {

    let height:number = 0
    let hHeader:number = 0
    let textHeightHeader: number = 0
    let startY:number = 10
    let marginY:number = 5
    let body:any = []

    let test:number = 0
    //
    // for (let i = 0; i < 1000; i++) {
    //   products.push(products[7])
    //   products.push(products[2])
    //   products.push(products[4])
    // }

    ////console.log(products)

      await Promise.all(
        this.products.map((data, index) => {
          let row: any = []
          row.push(this.tempData(index + 1, 1, 'left'))
          row.push(this.tempData(data.name, 1, 'left'))
          row.push(this.tempData(data.price, 1, 'center'))

          body.push(row)
        }
      )).then(value => {
        ////console.log(body)

          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a7' // Set the format to a7 (74 x 105 mm)
          });

          // // Add header content
          doc.setFontSize(20);
          doc.text('Header', doc.internal.pageSize.width / 2 , startY,{
            align: 'center'
          });

          //console.log(doc.getTextDimensions("Header"))



          autoTable(doc, {

            showHead: 'firstPage',

            //margin: { left: 5 ,top:0,bottom:0},

           margin: { left: 5,top: startY + marginY },

            // head: [['index','name','price']]
            head: [
              [
                { content: 'index', colSpan: 1, styles: { halign: 'left' } },
                { content: 'name', colSpan: 1, styles: { halign: 'center' } },
                { content: 'price', colSpan: 1, styles: { halign: 'left' } },
              ],
            ],

            columnStyles: {
              0: {cellWidth: 20, }, //index
              1: {cellWidth: 25, }, //name
              2: {cellWidth: 20, }, //price
            },

            // body: [
            //   [
            //     { content: 'Text1', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } },
            //     { content: 'Text2', colSpan: 1, rowSpan: 1, styles: { halign: 'left' } }
            //   ],
            // ],

            body: body,

            didDrawPage: (d) =>{

              doc.setFontSize(20);
              doc.text('Header', doc.internal.pageSize.width / 2 , startY,{
                align: 'center'
              });

              test += d.cursor?.y!
              //console.log("cursor y ",d.cursor?.y)


              if (d.pageNumber === 1) {



                height += d.table.head[0].height;
                //console.log("head",height)

                for(let i=0; i < d.table.body.length; i++){
                  ////console.log(d.table.body[i].height)

                  height += d.table.body[i].height;
                }

              }
            },


          })


          doc.save('table.pdf')


        //console.log("height table",height)
        //console.log("cursor y " , test)

        //console.log(doc.internal.pageSize.width)
        //console.log(doc.internal.pageSize.height)
        //console.log(doc.internal.pages)
        // let newHeight = height + hHeader + 2*(marginY + startY) + textHeightHeader
        //
        // //console.log(newHeight)

        const doc2 = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [74,height + 30]
          //format: [74,330]
        });

        doc2.setFontSize(20);
        doc2.text('Header', doc2.internal.pageSize.width / 2 , startY,{
          align: 'center'
        });


        autoTable(doc2, {
          margin: { left: 5,top:startY + marginY,bottom:0 },
          head: [
            [
              { content: 'index', colSpan: 1, styles: { halign: 'left' } },
              { content: 'name', colSpan: 1, styles: { halign: 'center' } },
              { content: 'price', colSpan: 1, styles: { halign: 'left' } },
            ],
          ],

          columnStyles: {
            0: {cellWidth: 20, }, //index
            1: {cellWidth: 25, }, //name
            2: {cellWidth: 20, }, //price
          },

          body: body,
            didDrawPage: (d) =>{


              test += d.cursor?.y!
              //console.log("cursor y ",d.cursor?.y)


              if (d.pageNumber === 1) {

                doc.setFontSize(20);
                doc.text('Header', doc.internal.pageSize.width / 2 , startY,{
                  align: 'center'
                });


                height += d.table.head[0].height;
                //console.log("head",height)

                for(let i=0; i < d.table.body.length; i++){
                  ////console.log(d.table.body[i].height)

                  height += d.table.body[i].height;
                }

              }
            },
        }



        )

          //console.log(doc2)
//

        doc2.save('newTable.pdf')
          doc2.autoPrint();
          doc2.output('dataurlnewwindow');
        }
      )
  }

}


