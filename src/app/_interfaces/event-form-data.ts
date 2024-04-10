export interface IEventFormData {
    description: string;
    startTime: Date | null;
    endTime: Date | null;
    eventId?: number;
    userId: number;
    numberOfAttendees: number;
}