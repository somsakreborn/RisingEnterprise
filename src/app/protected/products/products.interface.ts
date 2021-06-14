export interface Product {
    index: number;
    productId: number;
    productPDId: string;
    productName: string;
    productCodename: string;
    productBarcode: string;
    productTag: string;
    productImage: string;
    productComment: string;
    productDetail: string;
    productStatus: boolean;
    productLastupdate: any;
    productCreated: any;
    categoryId: number;
    warehouseId: number;
    productCategory: string;
    productInventory: any;
    productCost: any;
    productPiece: any;
    productTotal: any;
    productHold: any;
    productRemain: any;
    productMinimum: any;
    productWeight: any;
    historys: Historys[];
}

export interface Historys {
    hisName: string;
    hisRemark: string;
    sellerId: number;
    sellerName: string;
    lastUpdate: any;
}
