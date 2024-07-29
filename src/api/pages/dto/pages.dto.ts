import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";



export class CreatePageDto {
    @ApiProperty({description: '页面名称'})
    @IsNotEmpty({message:'页面名称不能为空'})
    pageName: string;

    @ApiProperty({description: '页面模式'})
    @IsNotEmpty({message:'页面模式不能为空'})
    pageType: string

    @ApiProperty({description: '项目ID'})
    @IsNotEmpty({message:'项目ID不能为空'})
    projectId: string
}


export class UpdatePageDto {
    @ApiProperty({description: '页面名称'})
    @IsNotEmpty({message:'页面名称不能为空'})
    pageName: string;

    
    @ApiProperty({description: '项目ID'})
    @IsNotEmpty({message:'项目ID不能为空'})
    pageId: string
}