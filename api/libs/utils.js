const axios = require('axios');
const logger = require('../libs/logger');

/**
 * 根据url获取页面数据
 * @param {*} url 网址
 */
exports.fetchPage = async function (url) {
  try {
    const res = await axios.get(url);
    if(res.status != 200){
    	throw '请求返回异常：' + res.status
    }
    if(!res.data){
    	throw '无数据返回'
    }
    return res.data;
  } catch (e) {
    logger.error(e);
    return null;
  }
};

