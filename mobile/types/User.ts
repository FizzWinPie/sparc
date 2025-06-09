export interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone_number: number;
  host_id: string | null;
  car_model: string | null;
  charger_listings?: string[];
}
