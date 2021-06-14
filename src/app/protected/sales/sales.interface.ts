export interface SaleProduct {
    _id: {
        idO: number;
        codeO: number;
    };
    productsTotal: number;
    productsDiscount: number;
    productsDelivery: number;
    productsAmount: number;
    productsSumCount: number;
    productsTotalPrice: number;

    // add products //
    index: number;
    productId: number;
    // productPDId: string;
    productName: string;
    productCodename: string;
    // productBarcode: string;
    // productTag: string;
    // productImage: string;
    // productComment: string;
    // productDetail: string;
    // productStatus: boolean;
    productLastupdate: any;
    productCreated: any;
    // categoryId: number;
    // warehouseId: number;
    // productCategory: string;
    // productInventory: any;
    // productCost: any;
    productPiece: any;
    productTotal: any;
    productHold: any;
    productRemain: any;
    // productMinimum: any;
    // productWeight: any;
    // add products //
}

export interface SaleChannel {
    _id: {
        channelId: number;
        channelName: string;
    };
    channelsTotal: number;
    channelsDiscount: number;
    channelsDelivery: number;
    channelsSumCount: number;
    channelsTotalPrice: number;

    // add channels //
    index: number;
    channelId: number;
    channelName: string;
}

export interface SaleUser {
    _id: {
        userId: number;
        userName: string;
        userLevel: string;
    };
    usersTotal: number;
    usersDiscount: number;
    usersDelivery: number;
    usersSumCount: number;

    // add users //
    index: number;
    userId: number;
    userName: string;
    userLevel: string;
    userComm: number;
}
