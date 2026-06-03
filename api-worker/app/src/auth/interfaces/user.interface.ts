import { UserRoleWithPermissions } from "../types/rbac.types";

export interface IUser{
    id: number;
    tenantId: number;
    firstname: string;
    lastname: string;
    email: string;
    passwordHash: string;
    roles?: UserRoleWithPermissions[];
    createdAt: Date;
    updatedAt: Date;
}