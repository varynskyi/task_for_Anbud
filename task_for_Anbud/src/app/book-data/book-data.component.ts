import { Component, OnInit, Input } from '@angular/core';
import { BookService, Book } from '../service/book.service';
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

@Component({
  selector: 'app-book-data',
  templateUrl: './book-data.component.html',
  styleUrls: ['./book-data.component.css'],
})
export class BookDataComponent implements OnInit {

  books: any[] = [];
  cols: any[] = [];
  _selectedColumns: any[] = [];
  priceTotal: number | undefined;

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.bookService.getBooks().
      then(data => this.books = data);
    this.cols = [
      { field: 'name', header: 'Name of Book', dataKey: 'name'},
      { field: 'price', header: 'Price in USD', dataKey: 'price'},
      { field: 'author', header: 'Author of book', dataKey: 'author'}
    ];
    this.books = [
      {"num": "1", "name": "name1", "price": 10, "author": "author1"},
      {"num": "2", "name": "name2", "price": 15, "author": "author2"},
      {"num": "3", "name": "name3", "price": 20, "author": "author3"},
      {"num": "4", "name": "name4", "price": 25, "author": "author4"},
      {"num": "5", "name": "name5", "price": 30, "author": "author4"},
      {"num": "6", "name": "name6", "price": 35, "author": "author4"}        
  ]

    this._selectedColumns = this.cols;
    this.calculatePriceTotal();
   }

   calculatePriceTotal() {
    let total = 0;
    for(let book of this.books) {
        total += book.price;
    }

    this.priceTotal = total;
  }



  onEditInit(event: any): void {
    console.log(this.books);
    console.log('Edit Init Event Called');
  }

  onEditCancel(event: any): void {
    console.log(this.books);
    console.log('Edit Cancel Event Called');
  }


  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }


  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.books);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "books");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  exportPdf() {
 
    const doc = new jsPDF('p','pt');
    
    autoTable(doc, {
      columns: this._selectedColumns,
      body: this.books,
      didDrawPage: (dataArg) => { 
       doc.text('Books', dataArg.settings.margin.left, 10);
      }
 }); 
    doc.save('books.pdf');
}


}




