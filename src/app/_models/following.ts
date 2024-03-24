import { FollowingStatus } from "../_enums/following-status";
import { Company } from "./company";
import { User } from "./user";

export class Following {
    id?: number;
    follower?: User | null; // end user
    following_user?: User | null; // business user
    following_company?: Company;
    status: FollowingStatus;
    createdAt?: string;

    constructor(data: any) {
        this.id = data?.id;
        this.follower = data?.follower !== null ? new User(data?.follower) : null;
        this.following_user = data?.following_user !== null ? new User(data?.following_user) : null;
        this.following_company = new Company(data?.following_company);
        this.status = data?.status ?? FollowingStatus.NOT_FOLLOWING;
        this.createdAt = data?.createdAt || '';
    }
}
