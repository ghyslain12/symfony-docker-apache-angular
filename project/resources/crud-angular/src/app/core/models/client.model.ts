import { User } from "./user.model";

export interface Client {
  id: number;
  surnom: string;
  idUser: number;
  userName: string;
  user: User; 
}
