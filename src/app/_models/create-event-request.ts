import { EventStatus } from "../_enums/event-status";

export interface ICreateEventRequest {
    id?: number;
    start_at: Date | null;
    end_at: Date | null;
    user_id: number;
    description: string;
    status?: EventStatus;
}