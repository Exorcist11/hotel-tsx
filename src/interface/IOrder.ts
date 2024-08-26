export interface IOrder {
  fullname: string;
  gender?: 'male';
  phone: string;
  citizen_number: string;
  email: string;
  category_id: number;
  number_of_rooms: number;
  start_date: string;
  end_date: string;
}