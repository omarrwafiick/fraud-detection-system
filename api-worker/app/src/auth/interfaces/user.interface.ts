import { Role } from "../entities/user.entity";

export interface IUser{
    id: number;
    tenantId: number;
    firstname: string;
    lastname: string;
    email: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}