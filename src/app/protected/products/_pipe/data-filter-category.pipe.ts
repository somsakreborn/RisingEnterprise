import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilterCategory'
})
export class DataFilterCategoryPipe implements PipeTransform {

    transform(array: any[], query: string): any {

        if (query) {
            return array.map(m => {
                m.categoryCTId = m.categoryCTId ? m.categoryCTId : '';
                m.categoryName = m.categoryName ? m.categoryName : '';
                m.categoryLastupdate = m.categoryLastupdate ? m.categoryLastupdate : '';
                // m.categoryComment = m.categoryComment ? m.categoryComment : '';
                return m;
            }).filter(f => f.categoryCTId.includes(query)
                || f.categoryName.includes(query)
                || f.categoryLastupdate.includes(query)
                // || f.categoryComment.includes(query)
            );
        }
        return array;
    }

}
