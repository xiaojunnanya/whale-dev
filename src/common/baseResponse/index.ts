export class BaseResponse<T> {
    private codeWithMes = {
        1000: '未知错误',
        1001: '自定义错误',
        1200: '请求成功',
        1400: '请求参数错误',
        1401: '未授权',
        1403: '禁止访问',
        1404: '请求资源不存在',
        1500: '服务器内部错误',
    }

    public baseResponse  = (statusCode: number, data: T) => {
        return {
            statusCode,
            message: this.codeWithMes[statusCode],
            data
        }
    }

    // public selfResponse = (statusCode: number, message: string, data: T) => {
    //     return { statusCode, message, data }
    // }
}