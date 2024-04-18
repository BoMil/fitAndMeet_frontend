import { FollowingStatus } from "../_enums/following-status";
import { GenderEnum } from "../_enums/gender";
import { RoleEnum } from "../_enums/user-role";
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
    isOpenBUDashboardButtonVisible: boolean;
    isButtonsVisible: boolean;

    constructor(data: any, isLoggedInUser: boolean = false) {
        this.id = data?.id ?? 0;
        this.first_name = data?.first_name ?? '';
        this.last_name = data?.last_name ?? '';
        this.email = data?.email ?? '';
        this.date_of_birth = data?.date_of_birth ?? '';
        this.phone_number = data?.phone_number ?? '';
        this.avatar = data?.avatar ?? '';
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
        this.isOpenBUDashboardButtonVisible = this.followingStatus === FollowingStatus.FOLLOWING;
        this.fullName = `${this.first_name} ${this.last_name}`;
        this.isButtonsVisible = isLoggedInUser;
    }
}