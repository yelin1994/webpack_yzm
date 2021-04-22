import axios from 'axios';

export function request(method = 'get', url, params, host = 'localhost:8010', protol = 'http') {
    const requestUrl = protol +'://' + host + url;
    console.log(requestUrl)
   return axios[method](requestUrl, {
        ...params
    }).then(function(res) {
        console.log('res', res)
        return res;
    }).catch(err => {
        console.log(err)
    });
}