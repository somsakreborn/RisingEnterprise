import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {count} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor() { }

    exportExcelKerry(orders): void {
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Co.,Ltd. Easyship Template'];
        const templateHeader = [
            'No', 'Recipient Name', 'Mobile No.', 'Email', 'Address #1', 'Address #2',
            'Zip Code', 'COD Amt (Baht)', 'Remark'
        ];
        const headers = [
            'No', 'Recipient Name', 'Mobile No.', 'Email', 'Address #1', 'Address #2',
            'Zip Code', 'COD Amt (Baht)', 'Remark'
        ];
        let no = 0;
        const rows = orders.map((order) => {
            const customer = order.customer;
            no = no + 1;
            return [
                // order.code, customer.name, customer.phone, '', customer.address1,
                // customer.address2, customer.zipcode, order.total, order.seller
                `${no}`, customer.orderCustomerNameSurname, customer.orderCustomerTel, '', customer.orderCustomerIdhome,
                customer.orderCustomerAddress, customer.orderCustomerZipcode, order.orderTotal, ''
            ];
        });

        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const data = [templateNull, templateTitle, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows];
        const fileName = `rising_export-${date}.xlsx`;
        const fileSheet = `rising_export-${date}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }

    // export for productsAll //
    exportExcelOrdersAll(orders, channels, shipments): void {
        const countAll = orders.length;
        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const dateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}.${now.getMinutes()}`;
        const dateTimefileReport = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}:${this.leftpad(now.getMinutes(), 2)}:${this.leftpad(now.getMilliseconds(), 2)}`;
        const dateTimefileName = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const dateTimefileSheet = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Co.,Ltd. (Orders Template)'];
        const templateDetail = ['จำนวนคำสั่งซื้อทั้งหมด ' + countAll + ' รายการ ' + '|| วันที่ส่งออก (' + dateTimefileReport + ')'];
        const templateHeader = [
            // 'ลำดับ', 'SKU', 'ชื่อสินค้า', 'ราคาต้นทุน/ชิ้น', 'ราคาขาย/ชิ้น', 'สต็อกทั้งหมด/ชิ้น',
            // 'ยอดจองสินค้า/ชิ้น', 'สินค้าพร้อมขาย/ชิ้น', 'วันที่สร้างสินค้า', 'productId'
        ];
        const headers = [
            // 'ลำดับ', 'SKU', 'ชื่อสินค้า', 'ราคาต้นทุน/ชิ้น', 'ราคาขาย/ชิ้น', 'สต็อกทั้งหมด/ชิ้น',
            // 'ยอดจองสินค้า/ชิ้น', 'สินค้าพร้อมขาย/ชิ้น', 'วันที่สร้างสินค้า', 'productId'
            'No', 'Channel', 'Order Number', 'Social name', 'Customer name', 'Telephone',
            'Status', 'Payment', 'Carrier', 'Sale Staff', 'Discount', 'Total',
            'Shipping Price', 'Created Date', 'Address', 'Postcode', 'Customer SKU', 'Product Name',
            'Product Unit Price', 'Product Discount', 'Product Quantity', 'TotalByProduct', 'Product Total', 'Note'

            // 'ยอดจองสินค้า/ชิ้น', 'สินค้าพร้อมขาย/ชิ้น', 'วันที่สร้างสินค้า', 'productId'
        ];
        let no = 0;
        const rows = orders.map((order) => {
            const Dorder = order;
            var Xcode = '';
            var Xname = '';
            var Xprice = '';
            var Xamount = '';
            var XamountTotal = '';
            var channelName = '';
            var shipmentName = '';
            let xxx = 0;
            let XsumTotal = 0;
            const DorderProductsLength = order.products.length;
            const createdTime = this.dateAsYYYYMMDDHHNNSS(new Date(order.orderCreated));
            const cusAddressFull = (order.customer.orderCustomerIdhome + '\n' + order.customer.orderCustomerAddress);
            channels.map(ch => {
                if (ch.channelId === order.orderChannelId) {
                    channelName = ch.channelName;
                }

            } );
            shipments.map(sh => {
                if (sh.shipmentId === order.payment.orderShipmentId) {
                    shipmentName = sh.shipmentName;
                }

            } );
            no = no + 1;
            order.products.map(x => {
                xxx++;
                XsumTotal = XsumTotal + (x.price * x.amount);
                if (xxx === DorderProductsLength) {
                    XamountTotal += `${x.price * x.amount}`;
                    Xcode += `${x.code}`;
                    Xname += `${x.name}`;
                    Xprice += `${x.price}`;
                    Xamount += `${x.amount} (${x.price * x.amount})`;
                } else {
                    XamountTotal += `${x.price * x.amount}\n`;
                    Xcode += `${x.code}\n`;
                    Xname += `${x.name}\n`;
                    Xprice += `${x.price}\n`;
                    Xamount += `${x.amount} (${x.price * x.amount})\n`;
                }
            });
            return [
                `${no}`, channelName, order.orderODId, order.customer.orderCustomerSocial, Dorder.customer.orderCustomerNameSurname, Dorder.customer.orderCustomerTel,
                Dorder.orderStatusName, Dorder.payment.method, shipmentName, Dorder.orderSellerName, order.orderDiscount, order.orderTotal,
                order.delivery.price, createdTime, cusAddressFull, order.customer.orderCustomerZipcode, `${Xcode}`, `${Xname}`,
                `${Xprice}`, ``, `${Xamount}`, `${XamountTotal}`, XsumTotal, order.orderRemark
            ];
        });

        // const data = [templateTitle, templateDetail, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows];
        const data = [templateTitle, templateDetail, headers, ...rows];
        const fileName = `exportOrders-${dateTimefileName}.xlsx`;
        const fileSheet = `exportOrders-${dateTimefileSheet}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }

    exportCSV(orders): void {
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Easyship Template'];
        const templateHeader = [
            'No', 'Recipient Name', 'Mobile No.', 'Email', 'Address #1', 'Address #2',
            'Zip Code', 'COD Amt (Baht)', 'Remark'
        ];
        const headers = [
            'No', 'Recipient Name', 'Mobile No.', 'Email', 'Address #1', 'Address #2',
            'Zip Code', 'COD Amt (Baht)', 'Remark'
        ];
        let no = 0;
        const rows = orders.map((order) => {
            const customer = order.customer;
            no = no + 1;
            return [
                // order.code, customer.name, customer.phone, '', customer.address1,
                // customer.address2, customer.zipcode, order.total, order.seller
                `${no}`, customer.orderCustomerNameSurname, customer.orderCustomerTel, '', customer.orderCustomerIdhome,
                customer.orderCustomerAddress, customer.orderCustomerZipcode, order.orderTotal, order.orderSellerName
            ];
        });

        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const data = [templateNull, templateTitle, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows];
        const fileName = `rising_export-${date}.xlsx`;
        const fileSheet = `rising_export-${date}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }

    // export for productsAll //
    exportExcelProductsAll(products): void {
        const countAll = products.length;
        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const dateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}.${now.getMinutes()}`;
        const dateTimefileReport = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}:${this.leftpad(now.getMinutes(), 2)}:${this.leftpad(now.getMilliseconds(), 2)}`;
        const dateTimefileName = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const dateTimefileSheet = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Co.,Ltd. (Customers Template)'];
        const templateDetail = ['จำนวนสินค้าทั้งหมด ' + countAll + ' รายการ ' + '|| วันที่ส่งออก (' + dateTimefileReport + ')'];
        const templateHeader = [
            'ลำดับ', 'SKU', 'ชื่อสินค้า', 'ราคาต้นทุน/ชิ้น', 'ราคาขาย/ชิ้น', 'สต็อกทั้งหมด/ชิ้น',
            'ยอดจองสินค้า/ชิ้น', 'สินค้าพร้อมขาย/ชิ้น', 'วันที่สร้างสินค้า', 'productId'
        ];
        const headers = [
            'ลำดับ', 'SKU', 'ชื่อสินค้า', 'ราคาต้นทุน/ชิ้น', 'ราคาขาย/ชิ้น', 'สต็อกทั้งหมด/ชิ้น',
            'ยอดจองสินค้า/ชิ้น', 'สินค้าพร้อมขาย/ชิ้น', 'วันที่สร้างสินค้า', 'productId'
        ];
        let no = 0;
        const rows = products.map((product) => {
            const Dproduct = product;
            const productRemain = (product.productTotal - product.productHold);
            const curTime = this.dateAsYYYYMMDDHHNNSS(new Date(product.productCreated));
            no = no + 1;
            return [
                `${no}`, Dproduct.productCodename, Dproduct.productName, Dproduct.productCost, product.productPiece, Dproduct.productTotal,
                Dproduct.productHold, productRemain, curTime, product.productId
            ];
        });

        const data = [templateTitle, templateDetail, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows];
        const fileName = `exportProducts-${dateTimefileName}.xlsx`;
        const fileSheet = `exportProducts-${dateTimefileSheet}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }

    // function date for export products  //
    dateAsYYYYMMDDHHNNSS(date): string {
        return date.getFullYear()
            + '-' + this.leftpad(date.getMonth() + 1, 2)
            + '-' + this.leftpad(date.getDate(), 2)
            + ' ' + this.leftpad(date.getHours(), 2)
            + ':' + this.leftpad(date.getMinutes(), 2)
            + ':' + this.leftpad(date.getSeconds(), 2);
    }
    leftpad(val, resultLength = 2, leftpadChar = '0'): string {
        return (String(leftpadChar).repeat(resultLength)
            + String(val)).slice(String(val).length);
    }
    // function date for export products  //

    // export for customersAll //
    exportExcelCustomersAll(customers, channels): void {
        const countAll = customers.length;
        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const dateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}.${now.getMinutes()}`;
        const dateTimefileReport = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}:${this.leftpad(now.getMinutes(), 2)}:${this.leftpad(now.getMilliseconds(), 2)}`;
        const dateTimefileName = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const dateTimefileSheet = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Co.,Ltd. (Customers Template)'];
        const templateDetail = ['จำนวนลูกค้าทั้งหมด ' + countAll + ' ราย ' + '|| วันที่ส่งออก (' + dateTimefileReport + ')'];
        const templateHeader = [
            'ลำดับ', 'ช่องทาง', 'ชื่อ-สกุลลูกค้า', 'โทรศัพท์', 'บ้านเลขที่/อาคาร/ซอย/ถนน', 'ที่อยู่-ลูกค้า',
            'รหัสไปรษณีย์', 'อีเมลล์', 'วันที่สร้าง', 'customerId'
        ];
        const headers = [
            'ลำดับ', 'ช่องทาง', 'ชื่อ-สกุลลูกค้า', 'โทรศัพท์', 'บ้านเลขที่/อาคาร/ซอย/ถนน', 'ที่อยู่-ลูกค้า',
            'รหัสไปรษณีย์', 'อีเมลล์', 'วันที่สร้าง', 'customerId'
        ];
        let no = 0;
        var channelName = '';
        const rows = customers.map((customer) => {
            const Data = customer;
            channels.map(ch => {
                if (ch.channelId === customer.customerChannelId) {
                    channelName = ch.channelName;
                }
            });
            const curTime = this.dateAsYYYYMMDDHHNNSS(new Date(customer.customerCreated));
            no = no + 1;
            return [
                `${no}`, channelName, Data.customerNameSurname, Data.customerTel, customer.customerIdhome, Data.customerAddress,
                Data.customerZipcode, Data.customerEmail, curTime, customer.customerId
            ];
        });

        const data = [templateTitle, templateDetail, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows];
        const fileName = `exportCustomers-${dateTimefileName}.xlsx`;
        const fileSheet = `exportCustomers-${dateTimefileSheet}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }

    // export for reportSaleProductsAll //
    exportExcelReportSaleProductsAll(rproducts): void {
        const countAll = rproducts.length;
        let sumTotal = 0;
        rproducts.map((saleproduct) => { sumTotal += saleproduct.productsTotalPrice; });
        const sumTotalPrices = [
            ``, '', '', '', '', '',
            '', 'ยอดรวมทั้งสิ้น', sumTotal
        ];
        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const dateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}.${now.getMinutes()}`;
        const dateTimefileReport = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}:${this.leftpad(now.getMinutes(), 2)}:${this.leftpad(now.getMilliseconds(), 2)}`;
        const dateTimefileName = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const dateTimefileSheet = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Co.,Ltd. (reportSaleProducs Template)'];
        const templateDetail = ['จำนวนยอดขายสินค้าทั้งหมด ' + countAll + ' ราย ' + '|| วันที่ส่งออก (' + dateTimefileReport + ')'];
        const templateHeader = [
            'ลำดับ', 'SKU', 'ชื่อสินค้า', 'คงคลัง', 'จอง', 'พร้อมขาย',
            'จำนวนสินค้าที่ขายได้', 'จำนวนออเดอร์', 'ยอดรวมสินค้า(ไม่หักส่วนลด-ค่าขนส่ง)'
        ];
        const headers = [
            'ลำดับ', 'SKU', 'ชื่อสินค้า', 'คงคลัง', 'จอง', 'พร้อมขาย',
            'จำนวนสินค้าที่ขายได้', 'จำนวนออเดอร์', 'ยอดรวมสินค้า(ไม่หักส่วนลด-ค่าขนส่ง)'
        ];
        let no = 0;
        // var channelName = '';
        const rows = rproducts.map((saleproduct) => {
            const Data = saleproduct;
            // channels.map(ch => {
            //     if (ch.channelId === customer.customerChannelId) {
            //         channelName = ch.channelName;
            //     }
            // });
            // const curTime = this.dateAsYYYYMMDDHHNNSS(new Date(customer.customerCreated));
            no = no + 1;
            return [
                `${no}`, Data.productCodename, Data.productName, Data.productTotal, Data.productHold, Data.productRemain,
                Data.productsAmount, Data.productsSumCount, Data.productsTotalPrice
            ];
        });

        const data = [templateTitle, templateDetail, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows, sumTotalPrices];
        const fileName = `exportRPSaleProducs-${dateTimefileName}.xlsx`;
        const fileSheet = `RPSaleProducs-${dateTimefileSheet}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }

    // export for reportSaleProductsAll //
    exportExcelReportSaleChannelsAll(rchannels): void {
        const countAll = rchannels.length;
        let sumCountOrder = 0;
        let sumTotal = 0;
        let sumDiscount = 0;
        let sumDelivery = 0;
        rchannels.map((rchannel) => {
            sumCountOrder += rchannel.channelsSumCount;
            sumTotal += rchannel.channelsTotal;
            sumDiscount += rchannel.channelsDiscount;
            sumDelivery += rchannel.channelsDelivery;
        });
        const sumTotalPrices = [
            `รวมทั้งสิ้น`, '--', sumCountOrder, sumTotal, sumDiscount, sumDelivery
        ];
        const now = new Date();
        const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const dateTime = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}.${now.getMinutes()}`;
        const dateTimefileReport = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}:${this.leftpad(now.getMinutes(), 2)}:${this.leftpad(now.getMilliseconds(), 2)}`;
        const dateTimefileName = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const dateTimefileSheet = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${this.leftpad(now.getHours(), 2)}-${this.leftpad(now.getMinutes(), 2)}`;
        const templateNull = [];
        const templateTitle = ['RisingEnterprise Co.,Ltd. (reportSaleProducs Template)'];
        const templateDetail = ['จำนวนยอดขายสินค้าทั้งหมด ' + countAll + ' ราย ' + '|| วันที่ส่งออก (' + dateTimefileReport + ')'];
        const templateHeader = [
            'ลำดับ', 'ชื่อช่องทาง', 'จำนวนออเดอร์', 'ยอดรวมตามช่องทาง(หักส่วนลด-ค่าส่งรวมแล้ว)', 'ส่วนลดรวม', 'ค่าส่งรวม'
        ];
        const headers = [
            'ลำดับ', 'ชื่อช่องทาง', 'จำนวนออเดอร์', 'ยอดรวมตามช่องทาง(หักส่วนลด-ค่าส่งรวมแล้ว)', 'ส่วนลดรวม', 'ค่าส่งรวม'
        ];
        let no = 0;
        // var channelName = '';
        const rows = rchannels.map((rchannel) => {
            const Data = rchannel;
            // channels.map(ch => {
            //     if (ch.channelId === customer.customerChannelId) {
            //         channelName = ch.channelName;
            //     }
            // });
            // const curTime = this.dateAsYYYYMMDDHHNNSS(new Date(customer.customerCreated));
            no = no + 1;
            return [
                `${no}`, Data.channelName, Data.channelsSumCount, Data.channelsTotal, Data.channelsDiscount, Data.channelsDelivery
            ];
        });

        const data = [templateTitle, templateDetail, templateNull, templateHeader, templateNull, templateNull, templateNull, headers, ...rows, sumTotalPrices];
        const fileName = `exportRPSaleChannels-${dateTimefileName}.xlsx`;
        const fileSheet = `RPSaleChannels-${dateTimefileSheet}`;
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        // XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A8' });
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.utils.sheet_add_aoa(ws, data);
        XLSX.utils.book_append_sheet(wb, ws, fileSheet);
        XLSX.writeFile(wb, fileName);
    }
}
