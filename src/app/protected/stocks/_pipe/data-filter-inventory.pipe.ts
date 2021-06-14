import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterInventory'
})
export class DataFilterInventoryPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.inventoryName = m.inventoryName ? m.inventoryName : '';
                // m.inventoryINId = m.inventoryINId ? m.inventoryINId : '';
                //m.inventoryForsale = m.inventoryForsale ? m.inventoryForsale : '';
                //m.inventoryCreated = m.inventoryCreated ? m.inventoryCreated : '';
                return m;
            }).filter(f => f.inventoryName.includes(query)
                || f.inventoryINId.includes(query)
                //|| f.inventoryForsale.includes(query)
                || f.inventoryCreated.includes(query));
        }
        return array;
    }

}
