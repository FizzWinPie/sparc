export interface Booking {
  id: string;
  charger_listings_id: string;
  charger_listings_address: string;
  host_id: string;
  ev_owner_id: string;
  start_time: string;
  end_time: string;
  total_cost: number;
  status: string;
  payment_status: string;
  rating_by_driver: number;
  rating_by_host: number;
  battery_level: string;
}
