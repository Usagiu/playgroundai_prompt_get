const axios = require('axios');
const https = require('https');
const fs = require('fs');

const proxyUrl = 'http://127.0.0.1:7890';
const proxyAgent = new https.Agent({
    rejectUnauthorized: false,
    secureProxy: false,
    http: proxyUrl,
});

const axiosInstance = axios.create({
    httpsAgent: proxyAgent,
});

const ALLData = {}
let index = 0

const getNextReq = (val) => {
    let q = encodeURI(val)
    axiosInstance
        .get(`https://playgroundai.com/api/images/search?limit=2000&cursor=2000&query=${q}&minScore=-0.35&useVectorFiltering=false&negEmbedFactor=0.5&nudityFilterThreshold=0.14&includeAllImages=false`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "__Host-next-auth.csrf-token=36d74f3b768d94fd004a4bab43343f7b60b2f2f9ab830959506b49a7a225d27b%7C262324f193be5c2ad76ae11f427de06a8eeffadda4afdeb139882d929dad0a4d; __Secure-next-auth.callback-url=https%3A%2F%2Fplaygroundai.com; __stripe_mid=ddc702e7-bac5-4dc1-9f69-f993f1597ebbf32877; intercom-id-h3v14f8j=fb8ceca5-a15b-42e9-80db-2d5dce1b5461; intercom-session-h3v14f8j=; intercom-device-id-h3v14f8j=1b08828b-118d-44b3-998b-df909f20551d; __stripe_sid=3a52dcfa-e2f6-4f9b-a564-16631e87a1bb8eb851; mp_6b1350e8b0f49e807d55acabb72f5739_mixpanel=%7B%22distinct_id%22%3A%20%2218b4c6f8b0decd-0e8c01f94595aa-18525634-13c680-18b4c6f8b0e2559%22%2C%22%24device_id%22%3A%20%2218b4c6f8b0decd-0e8c01f94595aa-18525634-13c680-18b4c6f8b0e2559%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        })
        .then((response) => {
            let list = response.data.images
            ALLData[val] = [...ALLData[val], ...list]
        })
        .catch((error) => {
            console.error('请求失败：', error);
        });
}

const firstReq = (val) => {
    index++;
    let q = encodeURI(val)
    axiosInstance
        .get(`https://playgroundai.com/_next/data/mH2foq4HQf-ID4ZnoPwoX/search.json?q=${q}`,
            {
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-nextjs-data": "1",
                    "cookie": "__Host-next-auth.csrf-token=36d74f3b768d94fd004a4bab43343f7b60b2f2f9ab830959506b49a7a225d27b%7C262324f193be5c2ad76ae11f427de06a8eeffadda4afdeb139882d929dad0a4d; __Secure-next-auth.callback-url=https%3A%2F%2Fplaygroundai.com; __stripe_mid=ddc702e7-bac5-4dc1-9f69-f993f1597ebbf32877; intercom-id-h3v14f8j=fb8ceca5-a15b-42e9-80db-2d5dce1b5461; intercom-session-h3v14f8j=; intercom-device-id-h3v14f8j=1b08828b-118d-44b3-998b-df909f20551d; __stripe_sid=3a52dcfa-e2f6-4f9b-a564-16631e87a1bb8eb851; mp_6b1350e8b0f49e807d55acabb72f5739_mixpanel=%7B%22distinct_id%22%3A%20%2218b4c6f8b0decd-0e8c01f94595aa-18525634-13c680-18b4c6f8b0e2559%22%2C%22%24device_id%22%3A%20%2218b4c6f8b0decd-0e8c01f94595aa-18525634-13c680-18b4c6f8b0e2559%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                }
            }
        ).then((response) => {
            let list = response.data.pageProps.data
            ALLData[val] = list
            getNextReq(val)
        })
        .catch((error) => {
            console.error('请求失败：', error);
        });
}

const promptList = [
    "a man",
    // "a woman",
    // "a girl",
    // "a boy",
    // "a lady",
    // "an old man",
    // "an old woman",
    // "game character",
    // "movie character",
    // "beautiful girl",
    // "CG character",
    // "a superstar",
    // "a player",
    // "an athlete",
    // "famous people",
    // "science fiction character"
]

const main = () => {
    promptList.map(item => {
        firstReq(item)
    })

    setTimeout(() => {
        const excludedKeywordsRegex = /illustration|pixiv|anime|cartoon|Sketch|wlop|pixar|disney/i;
        const newData = {};
        for (const key in ALLData) {
            newData[key] = ALLData[key].map((item) => {
                if (excludedKeywordsRegex.test(item.prompt)) {
                    return null;
                }
                return {
                    prompt: "(multi-views:1.8), ( full body shot portrait:1.3), (character design:1.2)," + item.prompt,
                    url: item.url,
                };
            }).filter(item => item !== null); 
        }

        const jsonContent = JSON.stringify(newData, null, 2);
        const fileName = 'output_11_25.json';
        fs.writeFile(fileName, jsonContent, 'utf8', (err) => {
            if (err) {
                console.error('写入文件时发生错误：', err);
            } else {
                console.log(`数据已成功写入文件 ${fileName}`);
            }
        });
    }, 10000);
}

main();