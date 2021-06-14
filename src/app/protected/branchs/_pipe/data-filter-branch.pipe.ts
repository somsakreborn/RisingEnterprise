import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterBranch'
})
export class DataFilterBranchPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
            m.branchName = m.branchName ? m.branchName : '';
            m.branchComment = m.branchComment ? m.branchComment : '';
            m.branchStartDate = m.branchStartDate ? m.branchStartDate : '';
            return m;
        }).filter(f => f.branchName.includes(query)
                || f.branchComment.includes(query)
                || f.branchStartDate.includes(query));
        }
        return array;
    }

}
