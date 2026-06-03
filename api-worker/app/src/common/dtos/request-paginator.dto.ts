import { IsIn, IsInt, IsOptional, IsPositive } from "class-validator";

export class RequestPaginatorDto{
    @IsInt()
    @IsPositive()
    page: number;
    @IsInt()
    @IsPositive()
    limit: number;
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}