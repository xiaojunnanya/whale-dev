import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/pages.dto';
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
}
