import { CoordinatesModel } from "../_models/coordinates";

export interface CreateCompanyRequest {
    list_of_business_users_id?: string[];
    logo?: string;
    name?: string;
    location?: CoordinatesModel;
    address?: string;
    description?: string;
    imageUrl?: string;
}