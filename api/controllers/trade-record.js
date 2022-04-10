const cacheLib = require('cache')
const logger = require('../libs/logger');
const utils = require('../libs/utils');
const tradeRecordService = require('../services/trade-record-service')

// 30秒失效的缓存库
const cache = new cacheLib(30 * 1000)

/**
 * 获取交易记录
 * query参数：
 *   a: 钱包地址
 *   pageSize: 每页数量
 *   pageIndex: 页码，从0开始
 */
exports.getTradeRecords = async (req, res) => {
  const address = req.query.a;
  let pageIndex = req.query.pageIndex ? Number(req.query.pageIndex) || 0 : 0;
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) || 25 : 25;

  // 参数处理
  if (pageIndex < 0) {
    pageIndex = 0;
  }
  if(![10, 25, 50, 100].includes(pageSize)){
    return res.send({ code: 1, msg: 'pageSize只能为10、25、50、100' });
  }
  if (!address) {
    return res.send({ code: 2, msg: '缺少地址' });
  }
  if (!/^0x[0-9a-z]{40}$/.test(address)) {
    return res.send({ code: 3, msg: '地址格式错误' });
  }

  // 尝试从缓存拿数据
  const cacheKey = `${address}-${pageIndex}-${pageSize}`
  const cacheData = cache.get(cacheKey)
  if(cacheData) {
    logger.log('从缓存返回数据')
    res.send({
      code: 0,
      msg: 'OK',
      data: cacheData
    })
    return
  }

  // 抓取数据
  const url = `https://etherscan.io/txs?a=${address}&ps=${pageSize}&p=${pageIndex + 1}`;
  logger.log('抓取数据：', url)
  const pageData = await utils.fetchPage(url);
  if(!pageData){
    return res.send({ code: 4, msg: '获取数据失败'})
  }

  
  // 从抓取的数据中分析出实际需要的数据
  let total, list
  try{
    ({total, list} = await tradeRecordService.analyzePage(pageData))
  } catch (e) {
    return res.send({ code: 5, msg: e.toString()})
  }

  const dataObj = {
    pageIndex,
    pageSize,
    total,
    list,
  }

  // 写入缓存
  cache.put(cacheKey, dataObj)
  
  res.send({
    code: 0,
    msg: 'OK',
    data: dataObj,
  });

};
