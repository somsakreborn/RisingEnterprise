import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterWarehouse'
})
export class DataFilterWarehousePipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.warehouseName = m.warehouseName ? m.warehouseName : '';
                m.warehouseTel = m.warehouseTel ? m.warehouseTel : '';
                m.warehouseComment = m.warehouseComment ? m.warehouseComment : '';
                m.warehouseCreated = m.warehouseCreated ? m.warehouseCreated : '';
                return m;
            }).filter(f => f.warehouseName.includes(query)
                || f.warehouseTel.includes(query)
                || f.warehouseComment.includes(query)
                || f.warehouseCreated.includes(query));
        }
        return array;
    }

}
