const axios = require('axios');
const logger = require('../libs/logger');

/**
 * 根据url获取页面数据
 * @param {*} url 网址
 */
exports.fetchPage = async function (url) {
  try {
    const res = await axios.get(url);
    return res;
  } catch (e) {
    logger.error(e);
    return null;
  }
};
