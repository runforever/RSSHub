const url = require('url');
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const link = `https://zw.cdzj.chengdu.gov.cn/lottery/accept/projectList`;

    const response = await got({
        method: 'get',
        url: link,
    });
    const $ = cheerio.load(response.data);
    const projects = $('#_projectInfo tr')
        .map((idx, el) => {
            const area = $(el).find('td:nth-child(3)').text();
            const name = $(el).find('td:nth-child(4)').text();
            const code = $(el).find('td:nth-child(5)').text();
            const scope = $(el).find('td:nth-child(6)').text();
            const count = $(el).find('td:nth-child(7)').text();
            const phone = $(el).find('td:nth-child(8)').text();
            const registerStartTime = $(el).find('td:nth-child(9)').text();
            const registerEndTime = $(el).find('td:nth-child(10)').text();
            const summary = `区域：${area}，项目名称：${name}，预售证号：${code}，预售范围：${scope}，住房套数：${count}，电话：${phone} 登记开始时间：${registerStartTime}，登记结束时间：${registerEndTime}`;
            return summary;
        })
        .get();
    const title = projects[0];
    const desc = projects.join('\n');

    ctx.state.data = {
        title: '商品住房购房登记 - 最新',
        link: link,
        item: [
            {
                title: title,
                description: desc,
                link: link,
            },
        ],
    };
};
