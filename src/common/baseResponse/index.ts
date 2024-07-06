export class BaseResponse<T> {
    private codeWithMes = {
        0: '未知错误',
        200: '请求成功',
        400: '请求参数错误',
        401: '未授权',
        403: '禁止访问',
        404: '请求资源不存在',
        500: '服务器内部错误'
    }

    public baseResponse  = (statusCode: number, data: T) => {
        return {
            statusCode,
            message: this.codeWithMes[statusCode],
            data
        }
    }

    public selfResponse = (statusCode: number, message: string, data: T) => {
        return { statusCode, message, data }
    }
}