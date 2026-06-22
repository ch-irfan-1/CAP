import { Pipe, PipeTransform } from '@angular/core';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
@Pipe({
    name: 'RemovedStateFilter',
    pure: false,
    standalone: false
})
export class RemovedStateFilterPipe implements PipeTransform {

  transform(items: any[]): any {

    // filter items array, items which don't have rmoved state and return true will be
    return items.filter(item => item.controls?.RowState?.value != DataRowState.Removed);
  }

}
