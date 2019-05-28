import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taxon'
})
export class TaxonPipe implements PipeTransform {

  transform(value: any, nom: string): any {
    if(!value)
    {
      return [];
    }
    else if(!nom)
    {
      return value;
    }
    else
    {
      nom = nom.toLowerCase()
      return value.filter( val =>{
        return val.properties.nom_taxon.toLowerCase().includes(nom)
      })
    }
  }

}
