export interface Report {
    _id: string;
    totalPrice: number;
    count: number;
    days: any;
    dayNum: number;
    dayStr: string;
}

export interface SaleReport {
    _id: string;
    sellerName: string;
    totalPrice: number;
    sumCount: number;
    days: any;
    dayNum: number;
    dayStr: string;
}
