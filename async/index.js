// function timeout(ms) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, ms, 'done');
//     });
// }

// timeout(1000).then((value) => {
//     console.log(value);
// });

let promise = new Promise(function (resolve, reject) {
    console.log('Promise');
    resolve();
});

promise.then(function () {
    console.log('resolved.');
});

console.log('Hi!');

// load image async
function loadImageAsync(url) {
    return new Promise(function (resolve, reject) {
        const image = new Image();

        image.onload = function () {
            resolve(image);
        };

        image.onerror = function () {
            reject(new Error('Could not load image at ' + url));
        };

        image.src = url;
    });
}

let url = 'https://avatars2.githubusercontent.com/u/11268235?s=400&u=d316b2b456b1dfc8cbe89821287d7a5f28fb0dbb&v=4'
loadImageAsync(url).then(function (res) {
    console.log(res)
    document.body.innerHTML = "<img src='" + res.src + "' />"
})

// get json
const getJSON = function (url) {
    const promise = new Promise(function (resolve, reject) {
        const handler = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url, true);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.setRequestHeader("Access-Control-Allow-Origin", "*");
        client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        client.withCredentials = true;
        client.send();

    });

    return promise;
};

getJSON("./test.json").then(function (json) {
    console.log('Contents: ');
    console.log(json)
}, function (error) {
    console.error('出错了', error);
});


// douban api
let serverUrl = 'https://api.douban.com'
let api = {
    movie: {
        inTheaters: '/v2/movie/in_theaters',
        comingSoon:'/v2/movie/coming_soon'
    }
}
let makeUrl = (sub) => {
    return serverUrl + sub
}

// getJSON(makeUrl(api.movie.inTheaters)).then(function (json) {
//     console.log('Contents: ');
//     console.log(json)
// }, function (error) {
//     console.error('出错了', error);
// });


// jsonp
function jsonp(options) {
    options = options || {};
    if (!options.url || !options.callback) {
        throw new Error("参数不合法");
    }

    //创建 script 标签并加入到页面中
    var callbackName = ('jsonp_' + Math.random()).replace(".", "");
    var oHead = document.getElementsByTagName('head')[0];
    options.data[options.callback] = callbackName;
    var params = formatParams(options.data);
    var oS = document.createElement('script');
    oHead.appendChild(oS);

    //创建jsonp回调函数
    window[callbackName] = function (json) {
        oHead.removeChild(oS);
        clearTimeout(oS.timer);
        window[callbackName] = null;
        options.success && options.success(json);
    };

    //发送请求
    oS.src = options.url + '?' + params;

    //超时处理
    if (options.time) {
        oS.timer = setTimeout(function () {
            window[callbackName] = null;
            oHead.removeChild(oS);
            options.fail && options.fail({ message: "超时" });
        }, time);
    }
};

//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    return arr.join('&');
}

// var url = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.js";
var url2 = makeUrl(api.movie.comingSoon)
jsonp({
    url:url2,
    data:{},
    callback:function() {
    }
});
function cb(d) {
    console.log(d);
}

// promise and promise
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        console.log((new Date()).getSeconds())
        resolve(p1)
    }, 1000)
})

console.log((new Date()).getSeconds())
p2.then(result => {
    console.log("first")
    console.log(result)
}).catch(error => {
    console.log("second")
    console.log((new Date()).getSeconds())
    console.log(error)
})
  // Error: fail