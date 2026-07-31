export interface Participant {
  id: string;
  name: string;
  level: number;
  power: number;
  order: number;
  isMember: boolean;
  token: string;
  preference1?: string;
  preference2?: string;
  preference3?: string;
}