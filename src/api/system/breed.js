import request from '@/utils/request'

export function getBreed(query){
    return request({
        url:"/system/breed/list",
        method:"get",
        params:query
    })
}
export function getResult(query){
    return request({
        url:"/system/breed/getResultData",
        method:"get",
        params:query
    })
}