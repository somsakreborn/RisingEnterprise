import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterBank'
})
export class DataFilterBankPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.bankName = m.bankName ? m.bankName : '';
                m.bankBranchname = m.bankBranchname ? m.bankBranchname : '';
                m.bankSerialNumber = m.bankSerialNumber ? m.bankSerialNumber : '';
                m.bankComment = m.bankComment ? m.bankComment : '';
                m.bankCreated = m.bankCreated ? m.bankCreated : '';
                return m;
            }).filter(f => f.bankName.includes(query)
            || f.bankBranchname.includes(query)
            || f.bankSerialNumber.includes(query)
            || f.bankComment.includes(query)
            || f.bankCreated.includes(query));
        }
        return array;
    }

}
