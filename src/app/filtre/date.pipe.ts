import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: any, jour: string): any {
    if(!value)
    {
      return [];
    }
    else if(!jour)
    {
      return value;
    }
    else
    {
      return value.filter( val =>{
        //console.log(val.properties.date_max.localeCompare(jour))
        return val.properties.date_max.localeCompare(jour) > -1
      })
    }
  }

}
