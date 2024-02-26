import request from '@/utils/request'

export function listPhenotype(data, pageNum, pageSize) {
    return request({
        url: '/phenotypeFile/selectMaterial?pageNum='+pageNum+'&pageSize='+pageSize,
        method: 'post',
        data
    })
}



