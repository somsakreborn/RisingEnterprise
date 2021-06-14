import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'dataFilterEmp'
})
export class DataFilterEmpPipe implements PipeTransform {

  transform(array: any[], query: string): any {

    if (query) {
      return _.filter(array, row => row.employeeName.indexOf(query) > -1);
    }
    return array;
  }

}
