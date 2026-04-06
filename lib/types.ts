export type StopType = 'city' | 'attraction' | 'transport_hub';
export type TransportType = 'flight' | 'train' | 'bus' | 'car' | 'boat' | 'other';
export type ActivityType = 'activity' | 'restaurant' | 'reminder';

export interface Stop {
  id: string;
  name: string;
  country: string;
  start_date: string;
  end_date: string;
  order_index: number;
  lat: number | null;
  lng: number | null;
  type: StopType;
}

export interface Transport {
  id: string;
  from_stop_id: string;
  to_stop_id: string;
  type: TransportType;
  duration_hours: number | null;
  cost: number | null;
  notes: string | null;
}

export interface Activity {
  id: string;
  stop_id: string;
  name: string;
  type: ActivityType;
  day_index: number | null;
  event_date: string | null;
  event_time: string | null;
  url: string | null;
  lat: number | null;
  lng: number | null;
}
