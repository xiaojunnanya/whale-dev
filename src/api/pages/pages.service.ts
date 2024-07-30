import { Injectable } from '@nestjs/common';
import { CreatePageDto, UpdatePageDto } from './dto/pages.dto';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'
import { BaseResponse } from '@/common/baseResponse';

const prisma = new PrismaClient()

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
        console.log(pageId);
        
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
}
