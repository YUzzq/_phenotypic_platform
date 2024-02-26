import request from '@/utils/request'

export function countByType() {
    return request({
        url: '/Type/countByType',
        method:'get',
    })
}

export function phenotypeAndMaterialNum(tableName) {
    return request({
        url: '/phenotypeFile/phenotypeAndMaterialNum',
        method: 'get',
        params:{tableName},
    })
}