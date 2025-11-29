const https = require('https');

const RAPIDAPI_KEY = '496dcf8f46mshd9059097e69d059p161ab4jsn8d25751d5221';
const YOUTUBE_HOST = 'youtube-scraper3.p.rapidapi.com';
const QUERY = 'MrBeast';

const options = {
    method: 'GET',
    hostname: YOUTUBE_HOST,
    port: null,
    path: `/api/v1/channels/search?query=${encodeURIComponent(QUERY)}`,
    headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': YOUTUBE_HOST
    }
};

const req = https.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function () {
        const body = Buffer.concat(chunks);
        try {
            const json = JSON.parse(body.toString());
            if (json.data && json.data.channels && json.data.channels.length > 0) {
                console.log(JSON.stringify(json.data.channels[0], null, 2));
            } else {
                console.log('No channels found or unexpected structure');
                console.log(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.log(body.toString());
        }
    });
});

req.end();
