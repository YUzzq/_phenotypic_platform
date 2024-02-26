import request from '@/utils/request'

//散点图数据
export function listPCA(fileId){
    return request({
        url: '/phenotypeFile/getPcaData?fileId=' + fileId,
        method: 'get',
    })
}
