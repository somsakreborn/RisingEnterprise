import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterShipment'
})
export class DataFilterShipmentPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.shipmentName = m.shipmentName ? m.shipmentName : '';
                m.shipmentComment = m.shipmentComment ? m.shipmentComment : '';
                m.shipmentStartDate = m.shipmentStartDate ? m.shipmentStartDate : '';
                return m;
            }).filter(f => f.shipmentName.includes(query)
                || f.shipmentComment.includes(query)
                || f.shipmentStartDate.includes(query));
        }
        return array;
    }

}
