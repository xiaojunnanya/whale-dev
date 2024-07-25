import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"


export class ProjectDto {
    @ApiProperty({description: '应用'})
    @IsNotEmpty({message:'应用名称不能为空'})
    projectName: string

    @ApiProperty({description: '应用描述'})
    projectDesc: string
    

    @ApiProperty({description: '应用类型'})
    @IsNotEmpty({message:'应用类型不能为空'})
    projectType: string

    @ApiProperty({description: '应用状态'})
    @IsNotEmpty({message:'应用状态不能为空'})
    projectState:'inProgress' | 'completed' | 'paused' | 'obsolete'

    @ApiProperty({description: '应用图标'})
    projectIcon: string
}


// 查询项目
export class SearchProjectDto {
    page: number
    pageSize: number
    projectName?: string
} 