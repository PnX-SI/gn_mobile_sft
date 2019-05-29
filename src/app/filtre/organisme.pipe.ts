import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'organisme'
})
export class OrganismePipe implements PipeTransform {

  transform(value: any, organisme: string): any {
    if(!value)
    {
      return [];
    }
    else if(!organisme)
    {
      return value;
    }
    else
    {
      organisme = organisme.toLowerCase()
      return value.filter( val =>{
        return val.properties.organisme.toLowerCase().includes(organisme)
      })
    }
  }

}
