export enum RoleEnum {
    BUSINESS_USER = "business_user",
    SUPER_USER = "super_user",
    END_USER = "end_user"
}

export function getRoleEnumDisplayValue(role: RoleEnum): string {
    switch (role) {
        case RoleEnum.BUSINESS_USER:
            return 'Business user';
        case RoleEnum.END_USER:
            return 'End user';
        case RoleEnum.SUPER_USER:
            return 'Super user';
        default:
            return ''
    }
}
