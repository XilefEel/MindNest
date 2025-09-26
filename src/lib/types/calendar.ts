export type PlannerEventType = {
  id: number;
  nestling_id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string;
  created_at: string;
  updated_at: string;
};

export type NewPlannerEventType = {
  nestling_id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string;
};
