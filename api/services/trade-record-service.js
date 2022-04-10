const cheerio = require('cheerio')

exports.analyzePage = async function(pageData){
	const $ = cheerio.load(pageData)

	// 获取数据总数
	const totalText = $('#ContentPlaceHolder1_topPageDiv .d-flex').text()
	if(!totalText){
		throw '页面数据异常'
	}
	const total = Number(/([\d,]+)/.exec(totalText)[0].replace(/,/g, ''))

	// 获取表格数据
	const list = []
	const trList = $('.table tbody tr')
	trList.each(function (i, elem) {
		list.push({
			txnHash: $(this).find('td:nth-child(2)').text().trim(),
			method: $(this).find('td:nth-child(3) span').attr('title'),
			block: $(this).find('td:nth-child(4)').text().trim(),
			age: $(this).find('td:nth-child(5)').text().trim(),
			from: $(this).find('td:nth-child(7)').text().trim(),
			to: $(this).find('td:nth-child(9) span').attr('title'),
			value: $(this).find('td:nth-child(10)').text().trim(),
			txnFee: $(this).find('td:nth-child(11)').text().trim(),
		})
	})
	return {
		total,
		list
	}
}