import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TOKEN } from '@/config';

// 通过注入的方式来设置接口是否要token：@UseGuards(AuthGuard)

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const { token } = req.headers
        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: TOKEN.secret
                }
            );
            console.log(payload, 'payload')
            req['userId'] = payload?.userId;
            req['email'] = payload?.email;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    // private extractTokenFromHeader(req: Request): string | undefined {
    //     const [type, token] = req.headers.authorization?.split(' ') ?? [];
    //     return type === 'Bearer' ? token : undefined;
    // }
}