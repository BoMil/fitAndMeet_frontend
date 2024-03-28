import { FollowingStatus } from "../_enums/following-status";
import { CoordinatesModel } from "./coordinates";
import { User } from "./user";

export class Company {
    id: number;
    created_at: string;
    updated_at: string;
    permission: any;
    list_of_business_users_id: [];
    logo: string;
    name: string;
    location: CoordinatesModel;
    address: string;
    users: User[];
    description: string;
    followingStatus: FollowingStatus | null;
    imageUrl: string;

    constructor(data: any) {
        this.id = data?.id ?? 0;
        this.created_at = data?.created_at ?? '';
        this.updated_at = data?.updated_at ?? '';
        this.list_of_business_users_id = data?.list_of_business_users_id ?? [];
        this.logo = data?.logo ?? 0;
        this.name = data?.name ?? '';
        this.permission = data?.permission ?? {};
        this.location = new CoordinatesModel(data?.location);
        this.address = data?.address ?? '';
        this.users = data?.users ? data.users.map((el: any) => new User(el)) : [];
        this.description = data?.description ?? '';
        this.followingStatus = data?.followingStatus;
        this.imageUrl = data?.imageUrl ?? '';
    }
}

export class Permission {
    is_public: boolean;

    constructor(data: any) {
        this.is_public = data?.is_public ?? false;
    }
}