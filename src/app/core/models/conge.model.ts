export enum StatutConger {
    EN_ATTENTE = 'en_attente',
    ACCEPTE = 'accepte',
    REFUSE = 'refuse'
  }
  
  export interface Conger {
    id?: number;
    nom: string;
    dateDebut: string;
    dateFin: string;
    type: string;
    statut?: StatutConger;
  }
  