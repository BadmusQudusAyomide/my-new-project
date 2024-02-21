;
document.addEventListener('DOMContentLoaded', () => {
    if (document && document.body && document.head) {
        const isProd = window.location.host === 'www.tesla.com';
        const cookieBannerStageSrc = 'https://digitalassets.tesla.com/raw/upload/emea-market-assets/stage/cookie-banner.js';
        const cookieBannerProdSrc = 'https://digitalassets.tesla.com/raw/upload/emea-market-assets/prod/cookie-banner.js';
        const cookieBannerSrc = isProd ? cookieBannerProdSrc : cookieBannerStageSrc;
        const cookieBannerScript = document.createElement('script');
        cookieBannerScript.setAttribute('src', cookieBannerSrc);
        cookieBannerScript.setAttribute('type', 'text/javascript');
        document.body.append(cookieBannerScript);
        const cookieBannerStyleNode = document.createElement('style');
        cookieBannerStyleNode.type = 'text/css';
        const zIndexStyleText = document.createTextNode('#cookie_banner { z-index: 100001 !important; }');
        const positionStyleText = document.createTextNode('#cookie_banner { position: sticky !important; }');
        cookieBannerStyleNode.appendChild(zIndexStyleText);
        cookieBannerStyleNode.appendChild(positionStyleText);
        document.head.append(cookieBannerStyleNode);
        document.addEventListener('tsla-cookie-consent', (consent) => {
            const cookieBannerEl = document.querySelector('#cookie_banner');
            if (cookieBannerEl && consent.detail.decision === 'accepted') {
                cookieBannerEl.style.setProperty('display', 'none');
                window.dataLayer = [];
                (function(t, n, o, e, i) {
                    t[e] = t[e] || [];
                    t[e].push({
                        'gtm.start': new Date().getTime(),
                        event: 'gtm.js'
                    });
                    var c = n.getElementsByTagName(o)[0],
                        a = n.createElement(o),
                        r = e != 'dataLayer' ? '&l=' + e : '';
                    a.async = !0;
                    a.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + r;
                    c.parentNode.insertBefore(a, c)
                })(window, document, 'script', 'dataLayer', 'GTM-KMG5DM');
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.style.visibility = 'hidden';
                iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-KMG5DM';
                document.body.appendChild(iframe);
                window.TSLA_ANALYTICS.init();
                window.addEventListener('scroll', () => {
                    window.TSLA_ANALYTICS.genericScrollEventHandler()
                }, !1)
            };
            if (cookieBannerEl && consent.detail.decision === 'rejected') {
                cookieBannerEl.style.setProperty('display', 'none')
            }
        });
        if (document.cookie.search('tsla-cookie-consent=accepted') > 1) {
            window.dataLayer = [];
            (function(t, n, o, e, i) {
                t[e] = t[e] || [];
                t[e].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var c = n.getElementsByTagName(o)[0],
                    a = n.createElement(o),
                    r = e != 'dataLayer' ? '&l=' + e : '';
                a.async = !0;
                a.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + r;
                c.parentNode.insertBefore(a, c)
            })(window, document, 'script', 'dataLayer', 'GTM-KMG5DM');
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.visibility = 'hidden';
            iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-KMG5DM';
            document.body.appendChild(iframe);
            window.TSLA_ANALYTICS.init();
            window.addEventListener('scroll', () => {
                window.TSLA_ANALYTICS.genericScrollEventHandler()
            }, !1)
        }
    }
});;