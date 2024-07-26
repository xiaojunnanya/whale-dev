import { Injectable } from '@nestjs/common';
import { ProjectDto, SearchProjectDto } from './dto/project.dto';
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { BaseResponse } from '@/common/baseResponse';

const prisma = new PrismaClient()


@Injectable()
export class ProjectService {

    response = new BaseResponse()
    
    async createProject(userId: string, projectDto: ProjectDto){
        // 用户ID， 应用名称，应用描述，应用类型，应用状态，应用创建时间，应用更新时间、应用Icon、应用ID
        // console.log(userId, projectDto);
        const projectId = uuidv4().slice(0, 8)
        
        await prisma.project.create({
            data: {
                projectId:projectId, 
                userId:userId,
                projectName: projectDto.projectName,
                projectDesc : projectDto.projectDesc,
                projectState : projectDto.projectState,
                projectType : projectDto.projectType,
                projectIcon: projectDto.projectIcon,
            }
        })


        return this.response.baseResponse(1200, '应用创建成功')
    }

    async deleteProject(id: number){
        await prisma.project.delete({
            where:{id:id}
        })

        return this.response.baseResponse(1200, '删除成功')
    }


    async updateProject(projectDto: any){
        await prisma.project.update({
            where:{id:projectDto.id},
            data:{
                projectName: projectDto.projectName,
                projectDesc : projectDto.projectDesc,
                projectState : projectDto.projectState,
                projectType : projectDto.projectType,
                projectIcon: projectDto.projectIcon,
            }
        })

        return this.response.baseResponse(1200, '更新成功')
    }

    async searchProject(userId: string, searchProjectDto: SearchProjectDto){
        const { projectName, page, pageSize } = searchProjectDto

        // 跳过的数量
        const skip = (page - 1) * pageSize
        // 总数
        const totalUsers = await prisma.project.count({
            where:{
                userId:userId,
                projectName: {
                    contains: projectName,
                }
            }
        })
        
        const res =  await prisma.project.findMany({
            where:{
                userId:userId,
                projectName: {
                    contains: projectName,
                }
            },
            orderBy: { createdTime: 'desc'},
            select:{
                id: true,
                projectId:true,
                projectName:true,
                projectDesc:true,
                projectState:true,
                projectType:true,
                projectIcon:true,
            },
            skip: skip, take: pageSize,
        })
        
        return this.response.baseResponse(1200, res, {
            total: totalUsers,
            page: page,
            pageSize: pageSize,
        })
    }


    // 应用类型
    async getProjectType(){
        const res = await prisma.config.findMany({
            select:{
                projectType: true
            }
        })

        
        return this.response.baseResponse(1200, JSON.parse(res[0].projectType))
    }
    

    // 应用状态
    async getProjectState(){
        const res = await prisma.config.findMany({
            select:{
                projectState: true
            }
        })

        return this.response.baseResponse(1200, JSON.parse(res[0].projectState))
        
    }
    

    // 应用状态颜色
    async getProjectStateColor(){
        const res = await prisma.config.findMany({
            select:{
                projectStateColor: true
            }
        })

        return this.response.baseResponse(1200, JSON.parse(res[0].projectStateColor))
        
    }
}
