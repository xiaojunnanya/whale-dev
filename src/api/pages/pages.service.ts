import { Injectable } from '@nestjs/common';
import { CreatePageDto, SavePageJsonDto, UpdatePageDto } from './dto/pages.dto';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'
import { BaseResponse } from '@/common/baseResponse';

const prisma = new PrismaClient()

// 遗留的问题：多表联查，权限的问题！！！烦死了
@Injectable()
export class PagesService {
    response = new BaseResponse()

    async createPages(createPageDto: CreatePageDto){
        const pageId = 'p' + uuidv4().slice(0, 8)

        await prisma.pages.create({
            data: {
                pageId: pageId,
                ...createPageDto
            }
        })

        return this.response.baseResponse(1200, '创建成功')
    }
    
    async savePageJson(savePageJsonDto: SavePageJsonDto){
        // 查询有没有pageId，没有新增，有更新
        const pageContent = await prisma.page_content.findUnique({
            where: {
                pageId: savePageJsonDto.pageId,
                projectId: savePageJsonDto.projectId
            }
        })

        if(!pageContent){
            await prisma.page_content.create({
                data: {
                    pageId: savePageJsonDto.pageId,
                    pageJson: savePageJsonDto.pageJson,
                    projectId: savePageJsonDto.projectId
                }
            })
        }else{
            await prisma.page_content.update({
                where: {
                    pageId: savePageJsonDto.pageId,
                    projectId: savePageJsonDto.projectId
                },
                data: {
                    pageJson: savePageJsonDto.pageJson
                }
            })
        }

        return this.response.baseResponse(1200, '保存成功')
    }


    async getPages(projectId: string){
        const res = await prisma.pages.findMany({
            where: {
                projectId: projectId
            },
            orderBy: { createdTime: 'desc'},
            select: {
                id: true,
                pageId: true,
                pageName: true,
                pageType: true,
            }
        })

        return this.response.baseResponse(1200, res)
    }


    async updatePages(updatePageDto: UpdatePageDto){
        await prisma.pages.update({
            where: {
                pageId: updatePageDto.pageId
            },
            data: {
                pageName: updatePageDto.pageName
            }
        })


        return this.response.baseResponse(1200, '更新成功')
    }


    async deletePages(pageId: string){
        await prisma.pages.delete({
            where: {
                pageId: pageId
            }
        })

        return this.response.baseResponse(1200, '删除成功')
    }

    async getPageInfo(pageId: string){
        const res = await prisma.pages.findUnique({
            where: {
                pageId: pageId
            },
            select: {
                id: true,
                pageName: true,
                pageType: true,
            }
        })

        return this.response.baseResponse(1200, res)
    }

    async getPageJson(userId: string, projectId: string, pageId: string){
        const result = await prisma.$queryRaw
        `
        SELECT
            page_content.id,
            page_content.page_json AS pageJson
        FROM
            page_content
        LEFT JOIN 
            project 
        on 
            page_content.project_id = project.project_id 
        WHERE 
            project.user_id = ${userId}
            AND page_content.project_id = ${projectId}
            AND page_content.page_id = ${pageId}
        `

        return this.response.baseResponse(1200, result[0])
    }

    
}
