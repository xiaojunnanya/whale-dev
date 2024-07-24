import { BaseResponse } from '@/common/baseResponse';
import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

@Injectable()
export class UserService {
    response = new BaseResponse()

    async userInfo(userId: string){
        const res = await prisma.user.findUnique({
            where:{userId:userId},
            select:{
                username: true,
                email: true,
                avatar: true,
            }
        })

        return this.response.baseResponse(1200, res)
    }
}
