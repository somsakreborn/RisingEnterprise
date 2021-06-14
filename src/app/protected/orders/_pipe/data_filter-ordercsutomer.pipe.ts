import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterCustomerSearch'
})
export class DataFilterCustomerSearchPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.customerNameSurname = m.customerNameSurname ? m.customerNameSurname : '';
                m.customerSocial = m.customerSocial ? m.customerSocial : '';
                // m.customerTel = m.customerTel ? m.customerTel : '';
                return m;
            }).filter(f => (f.customerNameSurname.indexOf(query)
                || f.customerSocial.includes(query)) > -1).slice(0, 15);
                // || f.customerSocial.includes(query));
                // || f.customerTel.includes(query));
        }
        return array;
    }

}
