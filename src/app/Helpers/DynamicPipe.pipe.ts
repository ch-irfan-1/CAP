import { CurrencyPipe, DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dynamic',
    standalone: false
})
export class DynamicPipe implements PipeTransform {

    transform(value: string, modifier: string) {
        if (!modifier) return value;
        // Evaluate pipe string
        return eval('this.' + modifier + '(\'' + value + '\')')
    }

    // adding a default format in case you don't want to pass the format
    // then 'dd-MM-yyyy' will be used
    formatDate(date: Date | string, format: string = 'dd-MM-yyyy'): string | null {
        if (date != 'null')
            return new DatePipe('en-US').transform(date, format);
        else
            return null
    }

    formatDateTime(date: Date | string, format: string = 'dd-MM-yyyy HH:mm'): string | null {
        if (date != 'null'){
            var activationDate=new Date(date);
            activationDate=new Date(activationDate.getUTCFullYear(),
                                            activationDate.getUTCMonth(),
                                            activationDate.getUTCDate(),
                                            activationDate.getUTCHours(),
                                            activationDate.getUTCMinutes(),
                                            activationDate.getUTCSeconds()
                                            );
            return new DatePipe('en-US').transform(activationDate, format);
        }
        else
            return null
    }

    formatDateTime12Format(date: Date | string, format: string = 'dd-MM-yyyy hh:mm a'): string | null {
        if (date != 'null'){
            var activationDate=new Date(date);
            activationDate=new Date(activationDate.getUTCFullYear(),
                                            activationDate.getUTCMonth(),
                                            activationDate.getUTCDate(),
                                            activationDate.getUTCHours(),
                                            activationDate.getUTCMinutes(),
                                            activationDate.getUTCSeconds()
                                            );
            return new DatePipe('en-US').transform(activationDate, format);
        }
        else
            return null
    }

    formatCurrency(currency: string): string | null {
        if (currency != 'null')
            return new CurrencyPipe('en-US').transform(currency,'', '', '1.0-2');
        else
            return null
    }
}

export const DYNAMIC_PIPES = [DynamicPipe];