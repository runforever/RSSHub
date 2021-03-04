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
            const status = $(el).find('td:nth-child(14)').text();
            const project = {
                area: area,
                name: name,
                code: code,
                scope: scope,
                count: count,
                phone: phone,
                registerStartTime: registerStartTime,
                registerEndTime: registerEndTime,
                status: status,
            };
            return project;
        })
        .get();
    const titleInfo = projects[0];
    const title = `区域：${titleInfo.area}，项目名称：${titleInfo.name}，预售证号：${titleInfo.code}，预售范围：${titleInfo.scope}，住房套数：${titleInfo.count}`;
    const desc = projects.map((item) => `区域：${item.area} </br>
                项目名称：${item.name}</br>
                预售证号：${item.code}</br>
                预售范围：${item.scope}</br>
                住房套数：${item.count}</br>
                电话：${item.phone}</br>
                登记开始时间：${item.registerStartTime}</br>
                登记结束时间：${item.registerEndTime}</br>
                状态：${item.status}</br>`).join('</br>');

    ctx.state.data = {
        title: `成都商品住房购房登记 - ${title}`,
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
