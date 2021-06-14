import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterProduct'
})

// export class DataFilterProductPipe implements PipeTransform {
//
//     transform(array: any[], query: string): any {
//
//         if (query) {
//         }
//         return array.map(m => {
//             m.productName = m.productName ? m.productName : '';
//             m.productCodename = m.productCodename ? m.productCodename : '';
//             m.productBarcode = m.productBarcode ? m.productBarcode : '';
//             m.categoryName = m.categoryName ? m.categoryName : '';
//             m.productCategory = m.productCategory ? m.productCategory : '';
//             // m.productLastupdate = m.productLastupdate ? m.productLastupdate : '';
//             // m.productPiece = m.productPiece ? m.productPiece : '';
//             return m;
//         }).filter(f => f.productName.includes(query)
//             || f.productCodename.includes(query)
//             || f.productBarcode.includes(query)
//             || f.categoryName.includes(query)
//             || f.productCategory.includes(query)
//             // || f.productPiece.includes(query)
//             // || f.productLastupdate.includes(query)
//         );
//         return array;
//     }
//
// }

export class DataFilterProductPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.productName = m.productName ? m.productName : '';
                m.productCodename = m.productCodename ? m.productCodename : '';
                // m.productBarcode = m.productBarcode ? m.productBarcode : '';
                // m.productPiece = m.productPiece ? m.productPiece : '';
                // m.productTotal = m.productTotal ? m.productTotal : '';
                // m.productCategory = m.productCategory ? m.productCategory : '';
                // m.categoryName = m.categoryName ? m.categoryName : '';
                return m;
            }).filter(f => f.productName.includes(query)
            || f.productCodename.includes(query)
            // || f.productBarcode.includes(query)
            // || f.productPiece.includes(query)
            //     || f.productTotal.includes(query)
            //     || f.productCategory.includes(query)
                // || f.categoryName.includes(query)
            );
        }
        return array;
    }

}
