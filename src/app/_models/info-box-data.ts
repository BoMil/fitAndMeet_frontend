import { FollowingStatus } from "../_enums/following-status";

export interface IInfoBoxData {
    review?: number;
    name?: string;
    avatar?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    userId?: number;
    isButtonsVisible: boolean;
    isOpenBUDashboardButtonVisible: boolean;
    followStatus?: FollowingStatus;
}

export class InfoBoxData {
    review?: number;
    name?: string;
    avatar?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    userId?: number;
    isButtonsVisible: boolean;
    isOpenBUDashboardButtonVisible: boolean;
    followStatus?: FollowingStatus;

    constructor(data: IInfoBoxData) {
        this.review = data.review ?? 0;
        this.name = data.name ?? '';
        this.avatar = data.avatar ?? '';
        this.lastName = data.lastName ?? '';
        this.userName = data.userName ?? '';
        this.email = data.email ?? '';
        this.userId = data.userId;
        this.isButtonsVisible = data.isButtonsVisible;
        this.isOpenBUDashboardButtonVisible = data.isOpenBUDashboardButtonVisible;
        this.followStatus = data.followStatus ?? FollowingStatus.NOT_FOLLOWING;

    
    }
}