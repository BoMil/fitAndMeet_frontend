import { FollowingStatus } from "../_enums/following-status";
import { GenderEnum } from "../_enums/gender";
import { RoleEnum } from "../_enums/user-role";
import { EventModel } from "./event";
import { Following } from "./following";

export class User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    phone_number: string;
    role: RoleEnum;
    gender: GenderEnum;
    avatar: string;
    user_name: string;
    password?: string;
    updated_at: string;
    created_at: string;
    deleted_at: string;
    active: boolean;
    lat: number | null;
    long: number | null;
    address: string;
    review: number;
    following: Following[];
    followers: Following[];
    followingStatus: FollowingStatus | null;
    fullName: string;

    // eventsToAttend: EventModel[];
    // eventsPending: EventModel[];
    // eventsDeclined: EventModel[];

    constructor(data: any) {
        this.id = data?.id ?? 0;
        this.first_name = data?.first_name ?? '';
        this.last_name = data?.last_name ?? '';
        this.email = data?.email ?? '';
        this.date_of_birth = data?.date_of_birth ?? '';
        this.phone_number = data?.phone_number ?? '';
        this.avatar = data?.avatar ?? '';
        // this.avatar = 'https://cvarkovdjordje.weebly.com/uploads/5/3/3/4/53347007/8276499.jpg?247';
        this.user_name = data?.user_name ?? '';
        this.updated_at = data?.updated_at ?? '';
        this.created_at = data?.created_at ?? '';
        this.deleted_at = data?.deleted_at ?? '';
        this.active = data?.active ?? false;
        this.gender = data?.gender ?? '';
        this.role = data?.role ?? '';
        this.lat = data?.lat ?? null;
        this.long = data?.long ?? null;
        this.address = data?.address ?? '';
        this.review = data?.review ?? 0;
        this.following = data?.following ? data.following.map((el: any) => new Following(el)) : [];
        this.followers = data?.followers ? data.followers.map((el: any) => new Following(el)) : [];
        this.followingStatus = data?.followingStatus;
        this.fullName = `${this.first_name} ${this.last_name}`;

        // this.eventsToAttend = data?.eventsToAttend ? data.eventsToAttend.map((el: any) => new EventModel(el)) : [];
        // this.eventsPending = data?.eventsPending ? data.eventsPending.map((el: any) => new EventModel(el)) : [];
        // this.eventsDeclined = data?.eventsDeclined ? data.eventsDeclined.map((el: any) => new EventModel(el)) : [];
    }
}