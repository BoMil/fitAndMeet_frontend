export interface CreateOrUpadateUserRequest {
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	gender: string;
	avatar: string;
	date_of_birth: string;
	phone_number: string;
	address: string;
	lat: number;
	long: number;
	password?: string;
	role?: string;
}
