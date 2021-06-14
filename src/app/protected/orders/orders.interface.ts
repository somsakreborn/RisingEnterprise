export interface Order {
    index: number;
    orderId: any;
    orderODId: string;
    orderChannelId: number;
    orderLastupdate: any;
    orderCreated: any;
    products: Products[];
    payment: Payment;
    delivery: Delivery;
    customer: Customer;
    historys: Historys[];

    orderStatusCode: number;
    orderStatusName: string;
    orderStatus: boolean;
    orderCheckedPrint: boolean;
    orderSelectedPrint: boolean;
    orderSellerId: number;
    orderSellerName: string;
    orderDiscount: any;
    orderTotal: number;
    orderRemark: string;
    orderTracking: string;

    code: string;
    channel: string;
    discount: any;
    notice: any;
    status: string;
    seller: string;
    total: number;

    tel: any;
    tracking: string;

}

export interface Products {
    id: number;
    name: string;
    code: string;
    amount: number;
    remain: number;
    max: number;
    checkamount: number;
    price: number;
    total: number;
    image: any;
}

export interface Payment {
    method: string;
    orderShipmentId: number;
    orderBankId: number;
    orderPaymentDate: any;
    orderPaymentTime: any;
    orderPaymentImage: string;
}

export interface Delivery {
    price: number;
    orderShipmentId: number;
    orderTracking: string;
    name: string;
}

export interface Customer {
    orderCustomerId: string;
    customerCMId: string;
    orderCustomerChannelId: any;
    orderCustomerSocial: string;
    orderCustomerTel: string;
    orderCustomerNameSurname: string;
    orderCustomerIdhome: string;
    orderCustomerAddress: string;
    orderCustomerZipcode: string;
    orderCustomerChannelName: any;
    // add (orderCustomerChannelName) for map data //
}

export interface Historys {
    hisName: string;
    hisRemark: string;
    sellerId: number;
    sellerName: string;
    lastUpdate: any;
}
