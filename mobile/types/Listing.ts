export interface Listing {
  id: string;
  host_id: string;
  charger_type: string;
  power_output_kw: number;
  connector_type: string;
  address: string;
  latitude: number;
  longitude: number;
  availability_schedule: string;
  price_per_hour: number;
  min_price: number;
  images: string;
  is_active: boolean;
  instructions: string;
  created_at: string;
  updated_at: string;
}
