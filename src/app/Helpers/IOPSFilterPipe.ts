import { Pipe, PipeTransform } from '@angular/core';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';

@Pipe({
    name: 'IOPSFilter',
    pure: false,
    standalone: false
})
export class IOPSFilterPipe implements PipeTransform {
 data: any[] = [];
  transform(items: any[], searchState: number): any[] {
    items = items.filter(obj => obj.controls.RowState.value !== DataRowState.Removed)
    return items;
  }

}