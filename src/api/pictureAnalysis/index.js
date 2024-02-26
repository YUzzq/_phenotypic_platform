import request from '@/utils/request'
export function getAnalysisTasksList() {
    return request({
        url: '/system/task/list',
        method: 'GET',
    })
}
export function deleteAnalysisTask(id) {
    return request({
        url: `/system/task/delete/${id}`,
        method: 'post',
        params: id
    })
}

export function uploadFileById(id){
    return request({
        url:`/system/task/upload/${id}`,
        method:'post',
        pararms : id
    })
}