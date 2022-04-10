const logger = require('../libs/logger');
const utils = require('../libs/utils');

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
  let pageSize = req.query.pageSize ? Number(req.query.pageSize) || 50 : 50;

  // 参数处理
  if (pageIndex < 0) {
    pageIndex = 0;
  }
  if (pageSize <= 0) {
    pageSize = 1;
  }
  if (pageSize > 200) {
    pageSize = 200;
  }
  if (!address) {
    return res.send({ code: 1, msg: '缺少地址' });
  }
  if (!/^0x[0-9a-z]{40}$/.test(address)) {
    return res.send({ code: 2, msg: '地址格式错误' });
  }

  // 抓取数据
  const url = `https://etherscan.io/txs?a=${address}&ps=${pageSize}&p=${pageIndex + 1}`;
  logger.log(`抓取数据：${url}`);
  const pageData = await utils.fetchPage(url);
  console.log(pageData);

  res.send({
    code: 0,
    msg: 'OK',
    data: {
      pageIndex,
      pageSize,
      total: 0,
      list: [],
    },
  });
};
