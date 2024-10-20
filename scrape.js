const fs = require('fs');

const proxies = [];
const output_file = 'proxy.txt';

if (fs.existsSync(output_file)) {
  fs.unlinkSync(output_file);
  console.log(`'${output_file}' telah dihapus.`);
}

const raw_proxy_sites = [
"https://api.proxyscrape.com/?request=displayproxies&proxytype=http&timeout=10000&country=all&simplified=true",
"https://www.proxy-list.download/api/v1/get?type=http",
"https://www.proxy-list.download/api/v1/get?type=https",
"https://spys.me/proxy.txt",
"https://api.openproxylist.xyz/http.txt",
"https://openproxy.space/list/http",
"https://proxyspace.pro/http.txt",
"https://proxyspace.pro/https.txt",
"https://sunny9577.github.io/proxy-scraper/generated/http_proxies.txt",
"https://cdn.rei.my.id/proxy/HTTP",
"https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
"https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt",
"https://github.com/monosans/proxy-list/raw/main/proxies/http.txt",
"https://github.com/mmpx12/proxy-list/raw/master/http.txt",
"https://github.com/mmpx12/proxy-list/raw/master/https.txt",
"https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt",
"https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt",
"https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/http_proxies.txt",
"https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/https_proxies.txt",
"https://raw.githubusercontent.com/Noctiro/getproxy/master/file/http.txt",
"https://raw.githubusercontent.com/Noctiro/getproxy/master/file/https.txt",
"https://raw.githubusercontent.com/zevtyardt/proxy-list/main/http.txt",
"https://raw.githubusercontent.com/yemixzy/proxy-list/main/proxies/http.txt",
"https://raw.githubusercontent.com/ArrayIterator/proxy-lists/main/proxies/http.txt",
"https://raw.githubusercontent.com/ArrayIterator/proxy-lists/main/proxies/https.txt",
"https://raw.githubusercontent.com/zenjahid/FreeProxy4u/master/http.txt",
"https://raw.githubusercontent.com/Vann-Dev/proxy-list/main/proxies/http.txt",
"https://raw.githubusercontent.com/Vann-Dev/proxy-list/main/proxies/https.txt",
"https://raw.githubusercontent.com/tuanminpay/live-proxy/master/http.txt",
"https://raw.githubusercontent.com/BreakingTechFr/Proxy_Free/main/proxies/http.txt",
"https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt",
"https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt",
"https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt",
"https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt",
"https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt",
"https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/https.txt",
"https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt",
"https://raw.githubusercontent.com/aslisk/proxyhttps/main/https.txt",
"https://raw.githubusercontent.com/saisuiu/uiu/main/free.txt",
"https://raw.githubusercontent.com/berkay-digital/Proxy-Scraper/main/proxies.txt",
"https://raw.githubusercontent.com/MrMarble/proxy-list/main/all.txt"

];

async function fetchProxies() {
  for (const site of raw_proxy_sites) {
    try {
      const response = await fetch(site);
      if (response.ok) {
//console.log(`success: ${site}`);
        const data = await response.text();
        const lines = data.split('\n');
        for (const line of lines) {
          if (line.includes(':')) {
            const [ip, port] = line.split(':', 2);
            proxies.push(`${ip}:${port}`);
          }
        }
      } else {
//console.log(`skip: ${site}`);
      }
    } catch (error) {
//console.error(`skip: ${site}`);
    }
  }

  fs.writeFileSync(output_file, proxies.join('\n'));
  fs.readFile(output_file, 'utf8', (err, data) => {
    if (err) {
      console.error('Gagal membaca file:', err);
      return;
    }
    const proxies = data.trim().split('\n');
    const totalProxies = proxies.length;
    console.log(`success scraping ${totalProxies} proxy`);
  });
}
fetchProxies();
