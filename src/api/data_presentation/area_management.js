import request from '@/utils/request';

//获取地图数据接口
export const getMap = () => {
    return request({
        url: '/phenotypeFile/getAreaData ',
        method: 'get'
    })
}

//通过性状名获取所有信息
export function getTraitByCity(name){
    return request({
        url:`/trait/listLocationByTraitId`,
        method:'get',
        params:{
            name
        },
        timeout:10000000
    })
}

//通过地区名获取所有性状
export function selectTraitByLocation(location){
    return request({
        url:`/phenotypeFile/selectTraitByLocation`,
        method:'get',
        params:{
            location
        }
    })
}

//获得所有性状名
export function getAllTraitFromFile() {
    return request({
        url: 'phenotypeFile/getAllTraitFromFile',
        method: 'get',
    })
}