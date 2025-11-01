import { WithBase } from "./base";

export type NewPlannerEventType = {
  nestlingId: number;
  date: string;
  title: string;
  description: string | null;
  startTime: number;
  duration: number;
  color: string;
};

export type PlannerEventType = WithBase<NewPlannerEventType>;
