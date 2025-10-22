import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pcinfo } from 'src/app/pcinfo';
import { MainService } from 'src/app/services/main.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Workbook } from 'exceljs';
import * as ExcelJS from 'exceljs';
import * as fs from 'file-saver';
import { jsPDF } from "jspdf";
import { GuardService } from 'src/app/guards/services/guard.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnChanges {
  p: number = 1;
  count: number = 6;
  id: number;
  successShow: boolean = false;
  nameEdit: string;
  cityEdit: string;
  dateEdit: string;
  phoneEdit: string;
  purchaseEdit: number;
  saleEdit: number;
  items: Pcinfo[] = [];
  filters: Pcinfo[] = [];
  @Input() search: any;
  @Input() dt: string;
  //checked: boolean;
  confirmedOrderDate;
  confirmedOrderLocation;
  timeStart;
  timeEnd;
  orderUpdate: Pcinfo = {
    name: '',
    city: '',
    date: '',
    phone: '',
    purchasePrice: 0,
    salePrice: 0,
    quantity: 0,
    totalP: 0,
    status: '',
    modePayement: '',
    isConfirmed: false,
    orderDetails: [],
    societeCode: ''
  };
  orderDetail = {
    location: null,
    date: '',
    timeStart: '',
    timeEnd: '',
    description: ''
  };
  visible: boolean = false;
  orderDetailVisible: boolean = false;
  date: Date;
  endDate: Date;
  itemsCopy;
  totalRecords = 0;

  constructor(private mainService: MainService,
    private confirmationService: ConfirmationService,
    private guardService: GuardService
  ) { }

  confirmOrderDetails(data) {
    this.orderDetail = data?.orderDetails || null;
    this.orderDetail.date = this.orderDetail.date ? formatDate(new Date(this.orderDetail.date), 'MM/dd/yyyy', 'en-US') : '';
    this.orderDetailVisible = true;
  }

  showDialog(item) {
    this.orderUpdate = null;
    this.orderUpdate = item;
    this.visible = true;
  }

  ngOnInit(): void {
    this.visible = false;
    this.mainService.getDataForDelivery().subscribe((items) => {

      if (this.guardService.isAdmin())
        this.items = items;
      else        
        this.items = items.filter(vl => vl.deliveryManId?.toString() == this.guardService.getDeliveryManId()?.toString())


      this.itemsCopy = this.items;
      this.calculRecap(this.items);
      this.items.sort((a, b) => b._id - a._id);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const srch = changes['search'];
    const filter = changes['dt'];
    if (this.dt == 'clear') {
      this.ngOnInit();
      return;
    }
    else if (filter) {
      this.mainService.getOrders().subscribe((items) => {
        this.items = items.filter((i) => {
          if (!i.date || !this.dt) {
            return;
          }
          formatDate(i.date, 'dd/MM/yyyy', 'en-US') == formatDate(this.dt, 'dd/MM/yyyy', 'en-US');
        });
      })

    }
    else if (srch) {
      this.mainService.getOrders().subscribe((items) => {
        this.items = items.filter((i) => i.phone.includes(this.search))
        this.items.sort((a, b) => b._id - a._id)
      }
      )
    }
  }

  updateInfo(): void {
    if (this.visible)
      this.orderUpdate.status = 'Canceled';

    this.visible = false;
    this.mainService.updatePurchase(this.orderUpdate, this.orderUpdate._id).subscribe(() => {
      this.ngOnInit();
    });

    this.successShow = true;
  }

  toggleSuccess(): void {
    this.successShow = !this.successShow;
  }

  getId(order): void {
    this.orderUpdate = order;
  }

  calculRecap(data) {
    if (data && data.length > 0) {
      this.totalRecords = data.length;
    }
  }

  getSeverity(status) {
    switch (status.toLowerCase()) {
      case 'canceled':
        return 'danger';
      case 'confirmed':
        return 'info';
      case 'in progress':
        return 'warning';
      case 'delivered':
        return 'success';
      default: return null;
    }
  }

  confirm(event: Event, data) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Is this order successfully delevered?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderUpdate = data;
        this.orderUpdate.status = 'Delivered';
        this.updateInfo();
      },
    });
  }

  //#region filter
  clear(): void {
    this.date = null;
    this.endDate = null;
    this.search = null;
    this.items = this.itemsCopy;
  }

  filter(): void {
    this.items = this.itemsCopy;
    if (this.date || this.endDate) {
      this.items = this.items.filter((i) => {

        // Ensure dates are present
        if (!i.date || !this.date || !this.endDate) {
          return false;
        }

        // Convert dates to comparable format
        const orderDate = new Date(i.date);
        const startDate = new Date(this.date);
        const endDate = new Date(this.endDate);

        // Check if order date is within the range
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    if (this.search) {
      this.items = this.items.filter((i) => i.phone.includes(this.search))
      this.items.sort((a, b) => b._id - a._id)
    }
  }
  //#endregion filter

  //#region excel
  downloadExel(): void {
    let time = formatDate(new Date(), 'shortTime', 'en-Us');
    let date = formatDate(new Date(), 'fullDate', 'en-Us');
    let fullDate = date + ' ' + time;
    let workbook = new Workbook();

    // Set cell styles
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      border: {
        top: { style: 'thin' as ExcelJS.BorderStyle },
        left: { style: 'thin' as ExcelJS.BorderStyle },
        bottom: { style: 'thin' as ExcelJS.BorderStyle },
        right: { style: 'thin' as ExcelJS.BorderStyle }
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4ec3cf' } // Specify the hex color code here
      }
    };

    // Set column widths
    const cellStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' as ExcelJS.BorderStyle },
        left: { style: 'thin' as ExcelJS.BorderStyle },
        bottom: { style: 'thin' as ExcelJS.BorderStyle },
        right: { style: 'thin' as ExcelJS.BorderStyle }
      }
    };

    let worksheet = workbook.addWorksheet('Voyage');

    worksheet.getCell('A1').value = 'Delivery';
    worksheet.getCell('A1').font = { name: 'Open Sans Extrabold', family: 4, size: 24, underline: 'none', bold: true };
    worksheet.getCell('F1').value = 'Date : ' + fullDate;
    worksheet.mergeCells('A1:C1');
    worksheet.mergeCells('F1:H1');
    worksheet.addRow([]);
    //let titleRow = worksheet.addRow(['Voyages']);
    //titleRow.font = { family: 4, size: 19, bold: true };
    let header = ["Number", "Product Name", "Date", "City", "Phone number", "Price", "Status"];

    const head = worksheet.addRow(header);
    //style the Row header
    head.eachCell((cell) => {
      cell.font = headerStyle.font;
      cell.alignment = headerStyle.alignment;
      cell.border = headerStyle.border;
      cell.fill = headerStyle.fill
    })

    // Apply column widths
    header.forEach((width, columnIndex) => {
      const column = worksheet.getColumn(columnIndex + 1);
      column.width = 25;
    });

    for (let x1 of this.items) {
      if (x1.date) {
        x1.date = formatDate(x1.date, 'dd/MM/yyyy', 'en-US');
      }

      let data = {
        number: x1.number,
        name: x1.name,
        date: x1.date,
        city: x1.city,
        phone: x1.phone,
        purchase: x1.purchasePrice,
        status: x1.status,
      }

      let x2 = Object.keys(data);
      let temp = []
      for (let y of x2) {
        temp.push(x1[y]);
      }
      const vy = worksheet.addRow(temp);
      //style the Rows
      vy.eachCell((cell) => {
        cell.font = cellStyle.font;
        cell.alignment = cellStyle.alignment;
        cell.border = cellStyle.border;
      })
    }

    let fname = "Delivery";

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });

  }
  //#endregion excel

  //#region invoice start
  invoice(data) {
    const doc = new jsPDF();

    // Gradient Header using a pattern of rectangles to simulate a gradient effect
    for (let i = 0; i <= 50; i++) {
        let colorValue = 45 + i;
        doc.setFillColor(colorValue, 62, 80 + i);  // Gradual shift in color
        doc.rect(0, i * 0.8, 210, 0.8, "F");
    }

    // Adding Invoice Title with a large bold font
    doc.setFont("courier", "bold");
    doc.setTextColor(255, 255, 255);  // White color
    doc.setFontSize(34);
    doc.text("INVOICE", 14, 30);

    // Adding Subtitle with decorative line
    doc.setFont("times", "italic");
    doc.setFontSize(16);
    doc.text("Order Summary", 14, 40);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(14, 42, 70, 42);

    // Invoice Details with decorative text and varying font sizes
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${data.number}`, 140, 25, { align: "right" });
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 140, 32, { align: "right" });

    // Adding a rounded rectangle for the billing information background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(140, 50, 60, 40, 3, 3, "F");
    doc.setFont("times", "bold");
    doc.setTextColor(45, 62, 80);  // Dark slate blue color
    doc.setFontSize(14);
    doc.text("BILLING TO:", 142, 55);
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);  // Black color
    doc.text(`${data.orderDetails.location}, ${data.city}`, 142, 60);
    doc.text(data.phone, 142, 65);

    // Decorative shapes for the product table header
    doc.setFillColor(80, 115, 158);
    doc.triangle(14, 95, 30, 80, 46, 95, "F");
    doc.triangle(196, 95, 180, 80, 164, 95, "F");

    // Table Headers with custom fonts and styles
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("PRODUCT", 20.5, 92);
    doc.text("PRICE", 100, 92, { align: "center" });
    doc.text("QTY", 130, 92, { align: "right" });
    doc.text("TOTAL", 180, 92, { align: "center" });

    // Table Content with custom cell borders and background color
    let yPosition = 100;
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    
    const products = [
        { name: data.name, price: `DH ${data.sale}`, qty: 1, total: `DH ${data.sale}` }
    ];

    products.forEach(product => {
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(14, yPosition - 5, 182, 10, 2, 2, "F");
        
        doc.text(product.name, 18, yPosition);
        doc.text(product.price, 100, yPosition, { align: "right" });
        doc.text(product.qty.toString(), 130, yPosition, { align: "right" });
        doc.text(product.total, 182, yPosition, { align: "right" });

        // Create a dashed line under each product
        this.drawDashedLine(doc, 14, yPosition + 2, 196, yPosition + 2, 1);
        yPosition += 15;
    });

    // Subtotal, Tax, and Total with highlights
    yPosition += 5;
    doc.setFontSize(12);
    doc.setTextColor(45, 62, 80);  // Dark slate blue color
    doc.text("SUBTOTAL", 100, yPosition, { align: "right" });
    doc.text(`DH ${data.sale}`, 182, yPosition, { align: "right" });
    yPosition += 10;
    doc.text("TAX", 100, yPosition, { align: "right" });
    doc.text("0.00%", 182, yPosition, { align: "right" });
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 115, 158);  // Steel blue color for emphasis
    doc.text("TOTAL PRICE", 100, yPosition, { align: "right" });
    doc.text(`DH ${data.sale}`, 182, yPosition, { align: "right" });

    // Payment Information with decorative lines
    yPosition += 20;
    doc.setFont("times", "bold");
    doc.setTextColor(45, 62, 80);
    doc.setFontSize(12);
    doc.text("Payment Method:", 14, yPosition);
    //doc.line(50, yPosition + 1, 70, yPosition + 1);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Cash on Delivery", 75, yPosition);

    // Decorative box for order details
    yPosition += 10;
    doc.setDrawColor(80, 115, 158);  // Steel blue border
    doc.setLineWidth(0.5);
    doc.roundedRect(14, yPosition, 182, 35, 5, 5);
    doc.setFont("times", "bold");
    doc.setTextColor("#2E4053");  // Darker blue-gray color
    doc.setFontSize(14);
    doc.text("ORDER DETAILS:", 18, yPosition + 10);
    doc.setFont("times", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Description: ${data.orderDetails.description}`, 18, yPosition + 18);
    doc.text(`Location: ${data.orderDetails.location}`, 18, yPosition + 24);
    doc.text(`Delivery Time: ${data.orderDetails.timeStart} - ${data.orderDetails.timeEnd}`, 18, yPosition + 30);

    // Footer with a different gradient and text alignment
    yPosition += 40;
    for (let i = 0; i <= 50; i++) {
        let colorValue = 80 - i;
        doc.setFillColor(45, 62, colorValue);  // Reverse gradient
        doc.rect(0, yPosition + i * 0.8, 210, 0.8, "F");
    }
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("Thank You For Your Business!", 14, yPosition + 10);
    doc.text("Authorized Sign", 182, yPosition + 10, { align: "right" });

    // Save the PDF
    doc.save(`invoice_${data.number}.pdf`);
  }

// Function to simulate a dashed line
drawDashedLine(doc, x1, y1, x2, y2, dashLength) {
    let x = x1, y = y1;
    const slope = (y2 - y1) / (x2 - x1);
    const deltaX = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
    const deltaY = slope * deltaX;

    while (x <= x2 && y <= y2) {
        doc.line(x, y, x + deltaX, y + deltaY);
        x += 2 * deltaX;
        y += 2 * deltaY;
    }
}

  //#endregion invoice end

}
