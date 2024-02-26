import request from '@/utils/request';

// 获取整棵树
/* export function getTree(treeType, parentId, isShow) {
  return request({
    url: '/system/tree/list',
    method: 'get',
    params: {
      treeType,
      parentId,
      isShow
    }
  });
} */

export function getTree(treeType,parentId, isShow) {
  return request({
    url: '/system/tree/list',
    method: 'get',
    params: {
      treeType,
      parentId,
      isShow
    }
  });
}

// 删除树节点
export function deleteNodes(treeIds) {
  return request({
    url: '/system/tree/' + treeIds,
    method: 'delete'
  });
}

// 添加树节点
export function addNode(data) {
  return request({
    url: '/system/tree',
    method: 'post',
    data
  });
}

// //添加节点描述信息
// export function updateNodeInformation(data){
//   return request({
//     url:'/system/picture/updateDescription',
//     method:'post',
//     data
//   });
// }

// 更新树节点
export function updateNode(data) {
  return request({
    url: '/system/tree',
    method: 'put',
    data
  })
}

export function test(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getChromDensity',
    params: {
      tableName: tableName
    },
  })
}



export function getMaterialList(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getMaterialList',
    params: {
      tableName: tableName
    },
  })
}

export function getChromRatioAndMaxPos(tableName) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getChromRatioAndMaxPos',
    params: {
      tableName: tableName
    },
  })
}

export function getMaterialInfo(tableName,materialName,chrom,start,end) {
  return request({
    method: 'GET',
    url: '/genotypeFile/getMaterialInfo',
    params: {
      tableName: tableName,
      materialName: materialName,
      chrom: chrom,
      start: start,
      end: end,
    },
  })
}

export function pictureCount(treeId){
  return request({
    method:'GET',
    url:'/system/picture/count',
    params:{
      treeId:treeId
    }
  })
}