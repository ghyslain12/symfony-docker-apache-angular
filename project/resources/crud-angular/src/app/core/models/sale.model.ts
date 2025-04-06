import { Client } from "./client.model";
import { Material } from "./material.model";

export interface Sale {
  id: number;
  titre: string;
  description: string;
  idClient: number;
  materials: Array<Material>;
  customer: Client;
}