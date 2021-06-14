import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dataFilter'
})

export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string): any {

    if (query) {
      return _.filter(array, row => row.employeeName.indexOf(query) > -1);

      // return _.sortBy(array, ['employeeName', 'employeeSurname']);

      // return _.map(array, _.partial(_.pick, _));
    }
    return array;
  }
}
