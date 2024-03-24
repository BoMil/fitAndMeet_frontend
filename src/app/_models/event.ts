export class EventModel {
    id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    start_at: string | Date;
    end_at: string | Date;
    status: string;
    description: string;
    active: boolean;

    constructor(data: any) {
        this.id = data?.id;
        this.user_id = data?.user_id ?? 0;
        this.created_at = data?.created_at ?? '';
        this.updated_at = data?.updated_at ?? '';
        this.start_at = data?.start_at ?? '';
        this.end_at = data?.end_at ?? '';
        this.active = data?.active ?? false;
        this.status = data?.status ?? '';
        this.description = data?.description ?? '';
    }
}