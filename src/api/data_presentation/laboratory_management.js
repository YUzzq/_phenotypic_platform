import request from '@/utils/request';

//根据表型表id获得数据
export function getDataByFormId(id) {
    return request({
        url: 'trait/dataAnalysis',
        params: {
            id: id
        },
        method: 'get',
        timeout: 1000 * 600
    });
}

//发送性状名字，获得所有拥有该性状的文件的地点
export function getLocationByTraitId(traitName) {
    return request({
        url: 'trait/listLocationByTraitId',
        method: 'get',
        params: {
            traitName
        },
        timeout: 1000 * 600
    })
}

//  获得材料名
export function getMaterialIdByFileId(fileId) {
    return request({
        url: 'phenotypeFile/getMaterialIdByFileId',
        method: 'get',
        params: {
            fileId
        },
        timeout: 1000 * 600
    })
}

//  获得材料名
export function dataAnalysisByMaterilId(id,materialId) {
    return request({
        url: 'trait/dataAnalysisByMaterilId',
        method: 'get',
        params: {
            id,
            materialId,
        }, 
        timeout: 1000 * 600
    })
}

//根据性状id查询每个材料下的性状值
export function getDataByTraitId(fileId,traitId) {
    return request({
        url: '/phenotypeFile/getMaterialByPhenotype',
        method: 'get',
        params: {
            fileId,
            traitId
        },
        timeout: 1000 * 600
    })
}