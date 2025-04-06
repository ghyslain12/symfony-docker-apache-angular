import { Sale } from "./sale.model";

export interface Ticket {
  id: number;
  titre: string;
  description: string;
  idSale: number;
  sales: Array<Sale>;
}
