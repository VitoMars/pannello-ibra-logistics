export interface Warehouse {
  name: string;
  uid: string;
}

export interface InventoryItem {
  uid: string;
  descrizionereadonly: string;
  codice: string;
  descrizionebreve: string;
  descrizioneestesa: string;
  descrizioneinfattura: string;
  uidtipounitadimisura: string;
  prezzodivenditaattuale: number;
  isannullato: boolean;
  qtariordino: number;
  numerogiorniriordino: number;
  valorearticolostandard: number;
  uidsoggettofornitorepreferenziale: string;
  codiceabarre: string;
  categoriaarticolocollection: any[];
  qtagiacenzaattuale: number;
  qtainordinedaclienti: number;
  qtainordineafornitori: number;
  dataultimomovimento: string;
}