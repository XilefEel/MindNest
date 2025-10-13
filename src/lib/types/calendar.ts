import { WithBase } from "./base";

export type NewPlannerEventType = {
  nestling_id: number;
  date: string;
  title: string;
  description: string | null;
  start_time: number;
  duration: number;
  color: string;
};

export type PlannerEventType = WithBase<NewPlannerEventType>;
