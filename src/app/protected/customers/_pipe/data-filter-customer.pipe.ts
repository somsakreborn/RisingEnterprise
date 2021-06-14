import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterCustomer'
})
export class DataFilterCustomerPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.customerNameSurname = m.customerNameSurname ? m.customerNameSurname : '';
                m.customerEmail = m.customerEmail ? m.customerEmail : '';
                m.customerTel = m.customerTel ? m.customerTel : '';
                m.customerLastupdate = m.customerLastupdate ? m.customerLastupdate : '';
                return m;
            }).filter(f => f.customerNameSurname.includes(query)
                || f.customerEmail.includes(query)
                || f.customerTel.includes(query)
                || f.customerLastupdate.includes(query));
        }
        return array;
    }

}
