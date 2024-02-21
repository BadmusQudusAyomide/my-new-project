(() => {
    "use strict";
    var e = e => caches.open("hyRequestsV1").then(e).catch((e => {}));
    const t = function(t, s) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        return new Promise(((n, c) => {
            (t => e((e => e.match(t))))(t).then((o => {
                void 0 === o || ((e, t) => ((new Date).getTime() - new Date(e.headers.get("Date")).getTime()) / 36e5 > t)(o, a) ? fetch(t, s).then((s => {
                    s.status >= 200 && s.status <= 400 ? ((t, s) => e((e => e.put(t, s))))(t, s.clone()).then((() => {
                        n(s)
                    })) : n(s)
                })).catch((e => {
                    c(e)
                })) : n(o)
            }))
        }))
    };
    var s, a = "object" == typeof caches && "function" == typeof caches.open;
    s = e => a && e ? t : fetch, self.onmessage = e => {
        var {
            data: {
                fetchParams: t
            }
        } = e;
        t && function(e) {
            var {
                useCache: t = !0,
                hoursTTL: a = .2
            } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0, c = arguments.length > 3 ? arguments[3] : void 0;
            s(t)(e, {
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                    "X-Request-Type": "async"
                }
            }, a).then((e => e.json())).then((e => {
                self.postMessage({
                    type: "worker",
                    response: e,
                    key: n,
                    data: c
                })
            })).catch((e => {
                self.postMessage({
                    type: "worker",
                    error: !0,
                    e: e.toString(),
                    key: n,
                    data: c
                })
            }))
        }(...t)
    }
})();