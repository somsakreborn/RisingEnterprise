import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterUser'
})
export class DataFilterUserPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.userName = m.userName ? m.userName : '';
                m.userEmail = m.userEmail ? m.userEmail : '';
                m.userLevel = m.userLevel ? m.userLevel : '';
                m.useruserCreated = m.userCreated ? m.userCreated : '';
                return m;
            }).filter(f => f.userName.includes(query)
                || f.userEmail.includes(query)
                || f.userLevel.includes(query)
                || f.userCreated.includes(query));
        }
        return array;
    }

}
