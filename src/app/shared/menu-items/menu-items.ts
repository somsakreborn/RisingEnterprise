import {Injectable} from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}

export interface ChildrenItems {
    state: string;
    target?: boolean;
    name: string;
    type?: string;
    children?: ChildrenItems[];
}

export interface MainMenuItems {
    state: string;
    short_label?: string;
    main_state?: string;
    target?: boolean;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    children?: ChildrenItems[];
}

export interface Menu {
    label: string;
    main: MainMenuItems[];
}


const MENUITEMS = [
    {
        label: 'Navigation',
        main: [
            {
                state: 'dashboard',
                short_label: 'D',
                name: 'แผงควบคุม',
                type: 'link',
                icon: 'feather icon-home',
            }
        ]
    },
    {
        label: 'Sales',
        main: [
            {
                state: 'sales',
                short_label: 'S',
                name: 'รายงานการขาย',
                type: 'sub',
                icon: 'feather icon-layers',
                children: [
                    {
                        state: 'expanse',
                        name: 'ค่าใช้จ่าย'
                    },
                    {
                        state: 'individual',
                        name: 'ยอดขายรายบุคคล'
                    },
                    {
                        state: 'channel',
                        name: 'ยอดขายตามช่องทางขาย'
                    },
                    {
                        state: 'product',
                        name: 'ยอดขายตามสินค้า'
                    }
                ]
            },
            {
                state: 'orders',
                short_label: 'O',
                name: 'รายการสั่งซื้อ',
                type: 'link',
                icon: 'feather icon-package',
            },
            {
                state: 'manageorders',
                short_label: 'M',
                name: 'จัดการคำสั่งซื้อ',
                type: 'sub',
                icon: 'feather icon-check',
                children: [
                    {
                        state: 'orders-check',
                        name: 'ตรวจสอบคำสั่งซื้อ'
                    },
                    {
                        state: 'orders-check-tracking',
                        name: 'ตรวจสอบหมายเลขพัสดุ'
                    },
                    {
                        state: 'orders-import-tracking',
                        name: 'นำเข้าหมายเลขพัสดุ'
                    }
                ]
            },
            {
                state: 'customers',
                short_label: 'C',
                name: 'ลูกค้า',
                type: 'link',
                icon: 'feather icon-users',
            },
            {
                state: 'products',
                short_label: 'P',
                name: 'สินค้า',
                type: 'sub',
                icon: 'feather icon-calendar',
                children: [
                    {
                        state: 'category',
                        name: 'หมวดหมู่สินค้า'
                    },
                    {
                        state: 'product',
                        name: 'สินค้า'
                    }
                ]
            },
            // {
            //     state: 'stocks',
            //     short_label: 'S',
            //     name: 'สต๊อกสินค้า',
            //     type: 'sub',
            //     icon: 'feather icon-server',
            //     children: [
            //         {
            //             state: 'inventory',
            //             name: 'สต๊อกสินค้า'
            //         },
            //         {
            //             state: 'warehouse',
            //             name: 'คลังสินค้า'
            //         }
            //     ]
            // },
            {
                state: 'channels',
                short_label: 'C',
                name: 'ช่องทางการขาย',
                type: 'sub',
                icon: 'feather icon-credit-card',
                children: [
                    {
                        state: 'channel',
                        name: 'ช่องทางการขาย'
                    }
                ]
            },
            {
                state: 'verified',
                short_label: 'V',
                name: 'ตรวจสอบสินค้า',
                type: 'link',
                icon: 'feather icon-check-square',
            }
        ]
    },
    {
        label: 'Resource',
        main: [
            // {
            //     state: 'employees',
            //     short_label: 'E',
            //     name: 'พนักงาน',
            //     type: 'link',
            //     icon: 'feather icon-users',
            // },
            // {
            //     state: 'branchs',
            //     short_label: 'B',
            //     name: 'สาขา',
            //     type: 'link',
            //     icon: 'feather icon-server',
            // },
            {
                state: 'banks',
                short_label: 'B',
                name: 'ธนาคาร',
                type: 'link',
                icon: 'feather icon-hash',
            },
            {
                state: 'shipments',
                short_label: 'S',
                name: 'วิธีจัดส่ง',
                type: 'link',
                icon: 'feather icon-shopping-cart',
            },
            {
                state: 'users',
                short_label: 'U',
                name: 'ควบคุมสิทธิ์ผู้ใช้งาน',
                type: 'link',
                icon: 'feather icon-user',
            },
            {
                state: 'settings',
                short_label: 'S',
                name: 'ตั้งค่า',
                type: 'sub',
                icon: 'feather icon-settings',
                children: [
                    {
                        state: 'pixels',
                        name: 'ตั้งค่า pixels'
                    }
                ]
            }
        ]
    }
];


@Injectable()
export class MenuItems {
    getAll(): Menu[] {
        return MENUITEMS;
    }
}
