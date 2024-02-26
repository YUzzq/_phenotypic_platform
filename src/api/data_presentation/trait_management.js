import request from '@/utils/request';

//根据文件获取表型表
export function getTraitFormByFileId(query) {
    return request({
        url: `phenotypeFile/selectTraitByFileId/${query.fileId}`,
        method: 'get',
        params:{
            pageSize : query.pageSize,
            pageNum : query.pageNum
        }
    });
}

//根据文件Id获取所有性状
export function getallTraitByfileId(fileId) {
    return request({
        url: 'trait/listByType',
        method: 'get',
        params: {
            fileId
        },
        timeout: 1000 * 600
    });
}

//根据文件Id获取图表性状信息
export function getTraitBytraitId(typeId) {
    return request({
        url: `trait/getTraitByType`,
        method: 'get',
        params: {
            typeId
        },
        timeout: 1000 * 600
    });
}

export function selectTraitColByFileId(fileId) {
    return request({
        url: `phenotypeFile/selectTraitColByFileId/${fileId}`,
        method: 'get',
    })
}

