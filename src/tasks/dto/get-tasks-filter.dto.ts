import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto{

    @IsOptional() // this decorator is used to tell nest that the property is optional at ------> runtime
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsString()
    search?: string
}