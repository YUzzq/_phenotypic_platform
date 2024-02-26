import request from '@/utils/request';
import axios from "axios";
import { getToken } from "@/utils/auth";

export function addImages(imageList) {
  return request({
    url: '/image/addImages',
    method: 'post',
  });
}

export function getImagesBynodeId(treeId) {
  return request({
    url: 'system/picture/list',
    method: 'get',
    params: {
      treeId
    }
  });
}

export function deleteImageByIdAndUrl(pictureId, pictureUrl) {
  return request({
    url: '/system/picture/remove',
    method: 'get',
    params: {
      pictureId,
      pictureUrl
    }
  });
}

// 图片下载接口
export async function downloadImage(pictureId) {
  try {
    const response = await axios.get("/system/picture/download", {
      baseURL: import.meta.env.VITE_APP_BASE_API,
      timeout: 50000,
      responseType: "blob",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      params: {
        pictureId: pictureId,
      },
    });

    const blob = response.data;
    const imageName = `img${pictureId}.jpg`;

    return { blob, imageName };
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}


//自动上传接口
export function updateByIp(ip, parentFile, treeId) {
  return request({
    url: '/system/picture/uploadByIp',
    method: 'post',
    params: {
      ip,
      parentFile,
      treeId
    }
  })
}

//图片数据统计接口
export function treeCount(treeId, status) {
  return request({
    url: '/system/picture/selectLeaves',
    method: 'GET',
    params: {
      treeId,
      status
    }
  })
}

//图片或文件数据（按日期）统计接口 status 0为文件 1为图片
export function treeCountDate(treeId, startDate, endDate, status) {
  return request({
    url: '/system/picture/selectDateLeaves',
    method: 'GET',
    params: {
      treeId,
      startDate,
      endDate,
      status
    }
  })
}

//查询图片接口

export function searchPhotoBynameAndTime(name,time,createBy,createTime){
  return request({
    url: '/system/picture/qureyPictrue',
    method: 'post',
    params: {
      name,
      time,
      createBy,
      createTime
    }
  })
}

// 查询当前treeType下的所有图片
export function getAllPicture(treeType) {
  return request({
    url: '/system/picture/AllPictureList',
    method: 'GET',
    params: {
      treeType
    }
  })
}


// 筛选图片接口（通过名称 拍照时间 上传时间 上传人）
export function searchPhotoDetail(name, time, createTime, createBy) {
  return request({
    url: '/system/picture/qureyPictrue',
    method: 'POST',
    params: {
      name,
      time,
      createTime,
      createBy
    }
  })
}

//图片查询下按日期查询图片数量
export function treeSingleCountDate(treeId, startDate, endDate, status, rank) {
  return request({
    url: '/system/picture/SignalDocumentNumSF',
    method: 'GET',
    params: {
      treeId,
      startDate,
      endDate,
      status,
      rank
    }
  })
}

// 根据url获取文件
export function getImagesByUrl(url){
  return axios.get(`${import.meta.env.VITE_APP_BASE_API}/image/${url}`,{
    responseType:'blob',
  },{
    headers:{
      Authorization: "Bearer " + getToken(),
    }
  })
}

