export enum ToyTypeEnum {
  SLAGALICA = 'slagalica',
  SLIKOVNICA = 'slikovnica',
  FIGURA = 'figura',
  KARAKTER = 'karakter',
  EDUKATIVNA = 'edukativna',
  DRUSTVENA_IGRA = 'drustvena-igra',
  PLISANA_IGRACKA = 'plisana-igracka',
  KONSTRUKCIJA = 'konstrukcija',
  OSTALO = 'ostalo',
}

export enum TargetGroupEnum {
  SVI = 'svi',
  DEVOJCICA = 'devojcica',
  DECAK = 'decak',
}

export type ToyType = ToyTypeEnum;
export type TargetGroup = TargetGroupEnum;

export interface ReviewModel {
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ToyModel {
  id: number;
  name: string;
  description: string;
  type: ToyType;
  ageGroup: string;
  targetGroup: TargetGroup;
  productionDate: string;
  price: number;
  imageUrl: string;
  reviews: ReviewModel[];
}
