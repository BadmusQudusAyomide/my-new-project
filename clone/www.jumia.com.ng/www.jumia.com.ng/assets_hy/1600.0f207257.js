"use strict";
(self.webpackChunkhydrogen = self.webpackChunkhydrogen || []).push([
    [1600], {
        3528: (e, r, t) => {
            t.d(r, {
                c: () => l
            });
            var n, o = t(1360),
                c = t(8724),
                a = t(5764),
                i = t(7992),
                s = e => {
                    e.preventDefault(), n || (n = document.querySelector("#jm")), (0, c.U)(n)
                };
            const l = e => {
                var {
                    classes: r,
                    ctaText: t
                } = e;
                return (0, o.h)("a", {
                    class: (0, a.c)("b2top _no-fcs", r),
                    href: "#top",
                    onClick: s
                }, (0, o.h)(i.c, {
                    name: "arrow-top"
                }), t)
            }
        },
        200: (e, r, t) => {
            t.d(r, {
                c: () => a
            });
            var n = t(1360),
                o = t(8164),
                c = t(5764);
            const a = e => {
                var {
                    children: r,
                    id: t,
                    showCTA: a,
                    hideCTA: i,
                    wrapperClasses: s,
                    ctaClasses: l,
                    contentClasses: u
                } = e, p = (0, o.yK)(), [f, b] = (0, o.oT)(!0);
                return (0, o.YB)((() => {
                    p.current.getBoundingClientRect().height >= p.current.scrollHeight && b(!1)
                }), []), (0, n.h)("div", {
                    class: (0, c.c)("xpnd", s)
                }, (0, n.h)("input", {
                    id: "xpdr-".concat(t),
                    class: "tglr",
                    type: "checkbox"
                }), (0, n.h)("div", {
                    class: (0, c.c)("wpr", u),
                    ref: p
                }, r), (0, n.h)("div", {
                    class: (0, c.c)("cta-w", {
                        "-dn": !f
                    })
                }, (0, n.h)("label", {
                    class: l,
                    for: "xpdr-".concat(t),
                    "data-hide": i,
                    "data-show": a
                })))
            }
        },
        6692: (e, r, t) => {
            t.d(r, {
                c: () => l
            });
            var n = t(1360),
                o = t(8164),
                c = t(2528),
                a = t(5764);

            function i() {
                return i = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, i.apply(this, arguments)
            }
            var s = null;
            const l = (0, c.U)((e => {
                var {
                    activeLanguage: r,
                    languages: t = {}
                } = e;
                return {
                    isRTL: t[r] && t[r].isRTL || !1
                }
            }))((e => {
                var {
                    slides: r = [],
                    timer: t = 0,
                    classes: c,
                    Item: l,
                    onClickHandler: u,
                    onScrollHandler: p,
                    getImageSize: f,
                    selected: b,
                    itemProps: m = {},
                    trackingData: v = {},
                    styles: y,
                    scrollToCenter: h,
                    isRTL: g
                } = e, d = (0, o.yK)(null), O = (0, o.yK)(b), j = (0, o.yK)(null), [w, P] = (0, o.oT)(b), [k, x] = (0, o.oT)(!1), [T, C] = (0, o.oT)({}), S = (0, o.yK)({
                    scrollAreaRemaining: null,
                    pixelsToScroll: null
                }), _ = (0, o.yK)(null), D = (0, o.yK)(null), E = (0, o.yK)(!0), L = (0, o.yK)([]), I = (0, o.yK)(!1), A = r.length, M = A >= 1, Z = !!t && A > 1, R = t && 1e3 * t, q = (0, o.kZ)((() => {
                    window.visualViewport && x(window.visualViewport.scale > 1.1)
                }), []), K = (0, o.kZ)((() => {
                    f && C(f())
                }), [f]), V = (0, o.kZ)((e => {
                    var r = e && !s,
                        t = (s ? -1 : 1) * d.current.scrollLeft,
                        n = r ? -10 : S.current.pixelsToScroll - 10,
                        o = r ? -1 : 1,
                        c = r ? A : 0,
                        a = Math.ceil((t + n) / S.current.pixelsToScroll) * o + c;
                    return Math.min(Math.max(1, a), A)
                }), [d, 10, A]), B = (0, o.kZ)((() => {
                    S.current = {
                        scrollAreaRemaining: d.current.scrollWidth - d.current.offsetWidth,
                        pixelsToScroll: j.current.offsetWidth
                    }
                }), []), U = (0, o.kZ)((function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : w;
                    if (e) {
                        var r, t = h ? Math.floor(window.innerWidth / S.current.pixelsToScroll / 2) : 0,
                            n = !0;
                        if (g && !s) {
                            var o = e + t;
                            r = d.current.scrollWidth - S.current.pixelsToScroll * o
                        } else {
                            var c = e - (t + 1);
                            r = S.current.pixelsToScroll * c, s && (r = -r)
                        }
                        if (h) {
                            var a = L.current[e].getBoundingClientRect().left + 10;
                            n = a < 0 || a > window.innerWidth
                        }
                        n && (I.current = !0, O.current = e, requestAnimationFrame((() => {
                            d.current && void 0 !== d.current.scrollLeft && (d.current.scrollLeft = r), setTimeout((() => {
                                I.current = !1
                            }), 700)
                        })))
                    }
                }), [g, h, w]), z = (0, o.kZ)((() => {
                    clearInterval(_.current), _.current = null
                }), []), F = (0, o.kZ)((() => {
                    var e;
                    !Z || d.current ? (e = s ? Math.abs(d.current.scrollLeft) >= S.current.scrollAreaRemaining : g ? d.current.scrollLeft <= 0 : d.current.scrollLeft >= S.current.scrollAreaRemaining, U(e ? 1 : V(g) + 1)) : z()
                }), [Z, V, g, U, z]), W = (0, o.kZ)((() => {
                    Z && !_.current && (_.current = setInterval(F, R))
                }), [Z, F, R]), H = (0, o.kZ)(((e, r) => {
                    e.preventDefault(), clearTimeout(D.current), u && r !== w && u(r)
                }), [u, w]), N = (0, o.kZ)((() => {
                    K(), B(), U(O.current)
                }), [U, K, B]), Y = (0, o.kZ)((() => {
                    E.current && (clearTimeout(D.current), p(V(g)))
                }), [p, V, g]), J = (0, o.kZ)((() => {
                    E.current && !I.current && (clearTimeout(D.current), D.current = setTimeout(Y, 70))
                }), [Y]), X = (0, o.kZ)((() => {
                    E.current = !1
                }), []), G = (0, o.kZ)((() => {
                    E.current = !0, D.current && J()
                }), [J]);
                return (0, o.YB)((() => {
                    if (M) {
                        var e = d.current;
                        return null === s && ((e, r) => {
                            s = e && r.scrollLeft <= 0
                        })(g, d.current), K(), q(), j.current = d.current.children[1] || d.current.children[0], B(), window.addEventListener("resize", N), window.addEventListener("touchend", q), Z && (e.addEventListener("touchstart", z, {
                            passive: !0
                        }), e.addEventListener("touchend", W)), p && (e.addEventListener("touchstart", X, {
                            capture: !1,
                            passive: !0
                        }), e.addEventListener("touchend", G, !1), e.addEventListener("scroll", J, !1)), U(), () => {
                            M && (clearTimeout(D.current), window.removeEventListener("resize", N), window.removeEventListener("touchend", q), Z && (z(), e.removeEventListener("touchstart", z), e.removeEventListener("touchend", W)), p && (e.removeEventListener("touchstart", X), e.removeEventListener("touchend", G), e.removeEventListener("scroll", J)))
                        }
                    }
                }), []), (0, o.YB)((() => {
                    w !== b && (P(b), U(b))
                }), [b, w, U, c]), M && (0, n.h)("div", {
                    class: (0, a.c)("crs", {
                        "-oh": k
                    }, c),
                    ref: d,
                    style: y
                }, r.map(((e, r) => {
                    var t = r + 1;
                    return (0, n.h)(l, i({}, m, {
                        trackingData: v,
                        ref: e => {
                            L.current[t] = e && (e.base || e)
                        },
                        pos: t,
                        isSelected: w === t,
                        data: e,
                        size: T,
                        onClick: u ? H : null
                    }, Z ? {
                        onFetch: z,
                        onEnd: W
                    } : {}))
                })))
            }))
        },
        6992: (e, r, t) => {
            t.d(r, {
                c: () => o
            });
            var n = t(1360);
            const o = e => {
                var {
                    color: r,
                    selector: t = "main"
                } = e;
                if (r) return (0, n.h)("style", null, "".concat(t, "{background-color:").concat(r, ";}"))
            }
        },
        8116: (e, r, t) => {
            t.d(r, {
                c: () => le
            });
            var n = t(1360),
                o = t(996),
                c = t(8868),
                a = t(4380),
                i = t(6732),
                s = t(8968),
                l = t(5764),
                u = t(2876),
                p = t(1656);

            function f() {
                return f = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, f.apply(this, arguments)
            }
            const b = e => {
                var {
                    title: r,
                    subTitle: t,
                    txtColor: o,
                    bgColor: c,
                    isCentered: a
                } = e, i = "".concat(o ? "color:".concat(o, ";") : "").concat(c ? "background:".concat(c, ";") : "");
                return (0, n.h)("div", f({
                    class: (0, l.c)("-phm", {
                        "-tac": a
                    })
                }, i ? {
                    style: i
                } : {}), (0, n.h)("h2", {
                    class: (0, l.c)("__ttl -elli -fs16 -m", {
                        "-pvxs -lh-15": !!c || !!t
                    })
                }, r), t && (0, n.h)("p", {
                    class: "-fs12 -elli"
                }, t))
            };
            var m = ["classes", "items", "layout", "cols", "hideImageTitles", "bgColor", "txtColor", "trackingData", "key", "ar"];

            function v(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function y(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? v(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : v(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }

            function h() {
                return h = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, h.apply(this, arguments)
            }
            var g = {
                "1-1": "_1-1",
                "9-5": "_9-5",
                "3-2": "_3-2",
                "5-4": "_5-4",
                "3-4": "_3-4",
                "1-2": "_1-2"
            };
            const d = e => {
                var {
                    classes: r,
                    items: t = [],
                    layout: o,
                    cols: c,
                    hideImageTitles: a,
                    bgColor: f,
                    txtColor: v,
                    trackingData: d,
                    key: O,
                    ar: j = "9-5"
                } = e, w = function(e, r) {
                    if (null == e) return {};
                    var t, n, o = function(e, r) {
                        if (null == e) return {};
                        var t, n, o = {},
                            c = Object.keys(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || (o[t] = e[t]);
                        return o
                    }(e, r);
                    if (Object.getOwnPropertySymbols) {
                        var c = Object.getOwnPropertySymbols(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t])
                    }
                    return o
                }(e, m), P = "square" === o ? g["1-1"] : void 0 === g[j] ? g["9-5"] : g[j];
                return (0, n.h)(i.c, {
                    classes: r,
                    bgColor: f,
                    key: O
                }, w.title && (0, n.h)(b, h({}, w, {
                    bgColor: f,
                    txtColor: v
                })), (0, n.h)("div", h({
                    class: (0, l.c)("row _no-g -tac -fs12 -pvxs -phs", "_".concat(c || "4", "c"))
                }, v && !f ? {
                    style: "color:".concat(v)
                } : {}), t.map(((e, r) => (0, n.h)(s.qM, {
                    onView: "eecPromo",
                    onClick: "eecPromo",
                    eventData: y(y(y({}, d), e), {}, {
                        index: r + 1
                    }),
                    transformer: "cmsPromo"
                }, (0, n.h)(u.c, h({
                    csr: !1,
                    href: e.url,
                    class: "col _tch -paxs"
                }, e.newTab ? {
                    target: "_blank",
                    rel: "noopener"
                } : {}), (0, n.h)("div", {
                    class: (0, l.c)("ar", P)
                }, (0, n.h)(p.c, {
                    class: "-rad4",
                    src: e.img,
                    alt: e.name
                })), !a && (0, n.h)("p", {
                    class: "-mvs -mhxs -elli2"
                }, e.name)))))))
            };
            var O = t(7312),
                j = ["bgColor", "classes", "txtColor", "items", "trackingData", "hideImageTitles", "key", "isPromo", "ar"];

            function w() {
                return w = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, w.apply(this, arguments)
            }

            function P(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function k(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? P(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : P(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }
            var x = {
                    "9-5": "_9-5",
                    "3-2": "_3-2",
                    "5-4": "_5-4",
                    "1-1": "_1-1",
                    "3-4": "_3-4"
                },
                T = e => {
                    var {
                        data: r,
                        trackingData: t,
                        hideName: o,
                        pos: c,
                        ar: a = "1-1"
                    } = e, i = void 0 === x[a] ? x["1-1"] : x[a];
                    return (0, n.h)(s.qM, {
                        onView: "eecPromo",
                        onClick: "eecPromo",
                        eventData: k(k(k({}, t), r), {}, {
                            index: c
                        }),
                        transformer: "cmsPromo"
                    }, (0, n.h)(u.c, w({
                        csr: !1,
                        href: r.url,
                        class: "thb _v _tch"
                    }, r.newTab ? {
                        target: "_blank",
                        rel: "noopener"
                    } : {}), (0, n.h)("div", null, (0, n.h)("div", {
                        class: (0, l.c)("ar", i)
                    }, (0, n.h)(p.c, {
                        class: "img",
                        src: r.img,
                        alt: o ? r.name : ""
                    })), !o && (0, n.h)("p", {
                        class: "-mtxs -elli2"
                    }, r.name))))
                },
                C = e => {
                    var {
                        data: r,
                        trackingData: t,
                        pos: o,
                        isCard: c
                    } = e;
                    return (0, n.h)(s.qM, {
                        onView: "eecPromo",
                        onClick: "eecPromo",
                        eventData: k(k(k({}, t), r), {}, {
                            index: o
                        }),
                        transformer: "cmsPromo"
                    }, (0, n.h)(u.c, w({
                        csr: !1,
                        href: r.url,
                        class: (0, l.c)("thb _h _tch", {
                            card: c
                        })
                    }, r.newTab ? {
                        target: "_blank",
                        rel: "noopener"
                    } : {}), (0, n.h)(p.c, {
                        class: "img -rad2",
                        src: r.img,
                        alt: "",
                        width: "40",
                        height: "40"
                    }), (0, n.h)("div", {
                        class: "-oh -pls"
                    }, (0, n.h)("h3", {
                        class: "-m -elli -mbxs"
                    }, r.name), r.subTitle && (0, n.h)("p", {
                        class: "-elli -ptxs -mbxs"
                    }, r.subTitle), r.extraText && (0, n.h)("p", {
                        class: "-elli -gy5"
                    }, r.extraText))))
                };
            const S = e => {
                var {
                    bgColor: r,
                    classes: t,
                    txtColor: o,
                    items: c = [],
                    trackingData: a,
                    hideImageTitles: s,
                    key: l,
                    isPromo: u,
                    ar: p
                } = e, f = function(e, r) {
                    if (null == e) return {};
                    var t, n, o = function(e, r) {
                        if (null == e) return {};
                        var t, n, o = {},
                            c = Object.keys(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || (o[t] = e[t]);
                        return o
                    }(e, r);
                    if (Object.getOwnPropertySymbols) {
                        var c = Object.getOwnPropertySymbols(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t])
                    }
                    return o
                }(e, j);
                return (0, n.h)(i.c, {
                    classes: t,
                    bgColor: r,
                    key: l
                }, f.title && (0, n.h)(b, w({}, f, {
                    bgColor: r,
                    txtColor: o
                })), (0, n.h)(O.u, w({
                    classes: "_thumb -pvxs -fs12"
                }, r || !o || u ? {} : {
                    style: "color: ".concat(o, ";")
                }), c.map(((e, t) => (0, n.h)(O.a, null, u ? (0, n.h)(C, {
                    data: e,
                    pos: t + 1,
                    isCard: !r,
                    trackingData: a
                }) : (0, n.h)(T, {
                    data: e,
                    pos: t + 1,
                    trackingData: a,
                    hideName: s,
                    ar: p
                }))))))
            };
            var _ = t(6692),
                D = ["bgColor", "classes", "ar", "txtColor", "items", "trackingData", "key", "widgetCounter"];

            function E() {
                return E = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, E.apply(this, arguments)
            }

            function L(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function I(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? L(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : L(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }
            var A = e => {
                var {
                    data: r,
                    trackingData: t,
                    pos: o,
                    onEnd: c = null,
                    onFetch: a = null
                } = e;
                return (0, n.h)(s.qM, {
                    onView: "eecPromo",
                    onClick: "eecPromo",
                    eventData: I(I(I({}, t), r), {}, {
                        index: o
                    }),
                    transformer: "cmsPromo"
                }, (0, n.h)(u.c, E({
                    class: "itm",
                    href: r.url,
                    csr: !1
                }, r.newTab ? {
                    target: "_blank",
                    rel: "noopener"
                } : {}), (0, n.h)(p.c, {
                    class: "img",
                    src: r.img,
                    alt: r.name,
                    onFetch: a,
                    onEnd: c
                })))
            };
            const M = e => {
                var {
                    bgColor: r,
                    classes: t,
                    ar: o,
                    txtColor: c,
                    items: a,
                    trackingData: s,
                    key: u,
                    widgetCounter: p
                } = e, f = function(e, r) {
                    if (null == e) return {};
                    var t, n, o = function(e, r) {
                        if (null == e) return {};
                        var t, n, o = {},
                            c = Object.keys(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || (o[t] = e[t]);
                        return o
                    }(e, r);
                    if (Object.getOwnPropertySymbols) {
                        var c = Object.getOwnPropertySymbols(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t])
                    }
                    return o
                }(e, D);
                return (0, n.h)(i.c, {
                    classes: t,
                    bgColor: r,
                    key: u
                }, f.title && (0, n.h)(b, E({}, f, {
                    bgColor: r,
                    txtColor: c
                })), (0, n.h)(_.c, {
                    classes: (0, l.c)("_bnrs -pvs", {
                        ["_ar".concat(o)]: !!o
                    }),
                    slides: a,
                    timer: 1 === p ? 7 : 0,
                    trackingData: s,
                    Item: A
                }))
            };
            var Z = ["bgColor", "txtColor", "items", "trackingData", "key", "ar"];

            function R(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function q(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? R(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : R(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }

            function K() {
                return K = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, K.apply(this, arguments)
            }
            var V = {
                1: {
                    default: "_5-2",
                    "3-1": "_3-1",
                    "5-2": "_5-2",
                    "2-1": "_2-1",
                    "3-2": "_3-2",
                    "5-4": "_5-4",
                    "1-1": "_1-1",
                    "3-4": "_3-4"
                },
                2: {
                    default: "_5-4",
                    "3-1": "_3-1",
                    "5-2": "_5-2",
                    "2-1": "_2-1",
                    "3-2": "_3-2",
                    "5-4": "_5-4",
                    "1-1": "_1-1",
                    "3-4": "_3-4"
                }
            };
            const B = e => {
                var {
                    bgColor: r,
                    txtColor: t,
                    items: o = [],
                    trackingData: c,
                    key: a,
                    ar: f
                } = e, m = function(e, r) {
                    if (null == e) return {};
                    var t, n, o = function(e, r) {
                        if (null == e) return {};
                        var t, n, o = {},
                            c = Object.keys(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || (o[t] = e[t]);
                        return o
                    }(e, r);
                    if (Object.getOwnPropertySymbols) {
                        var c = Object.getOwnPropertySymbols(e);
                        for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t])
                    }
                    return o
                }(e, Z), v = o.length, y = V[v] || V[1], h = y[f] || y.default;
                return (0, n.h)(i.c, {
                    bgColor: r,
                    key: a
                }, m.title && (0, n.h)(b, K({}, m, {
                    bgColor: r,
                    txtColor: t
                })), (0, n.h)("div", {
                    class: "-df -pvs -phxs"
                }, o.map(((e, r) => {
                    var t = v > 1 ? r + 1 : "";
                    return (0, n.h)(s.qM, {
                        onView: "eecPromo",
                        onClick: "eecPromo",
                        eventData: q(q(q({}, c), e), {}, {
                            index: t
                        }),
                        transformer: "cmsPromo"
                    }, (0, n.h)(u.c, K({
                        href: e.url
                    }, e.newTab ? {
                        target: "_blank",
                        rel: "noopener"
                    } : {}, {
                        class: "-fw -mhxs",
                        csr: !1
                    }), (0, n.h)("div", {
                        class: (0, l.c)("ar", h)
                    }, (0, n.h)(p.c, {
                        class: "-rad4",
                        src: e.img,
                        alt: e.name
                    }))))
                }))))
            };
            var U = t(3728);

            function z() {
                return z = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, z.apply(this, arguments)
            }
            const F = e => {
                var {
                    bgColor: r,
                    txtColor: t,
                    html: o,
                    classes: c
                } = e, a = "".concat(t ? "color:".concat(t, ";") : "").concat(r ? "background:".concat(r, ";") : "");
                return (0, n.h)(U.c, z({
                    markup: o,
                    classes: (0, l.c)("cms -phm -pvs", c, {
                        "card _fw": !!r
                    })
                }, a ? {
                    style: a
                } : {}))
            };
            var W = t(8982),
                H = t(8264),
                N = t(6784),
                Y = t(9556);

            function J() {
                return J = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, J.apply(this, arguments)
            }
            var X = (0, n.h)("span", {
                    class: "s"
                }, ":"),
                G = e => {
                    var {
                        endText: r
                    } = e;
                    return (0, n.h)("span", {
                        class: "-ba-gy1 -bg-wt -dif -fs16 -gy9 -m -pas -rad2 -mvs"
                    }, r)
                },
                Q = e => {
                    var {
                        timeLabels: r,
                        timerText: t,
                        endDateTime: o,
                        endText: c
                    } = e, a = (0, N.c)(o);
                    if (a.e && c) return (0, n.h)(G, {
                        endText: c
                    });
                    var i = (0, Y.y)(a, r);
                    return (0, n.h)("div", {
                        class: "cntd _def -pvs -dif -i-ctr"
                    }, "".concat(t, ":"), (0, n.h)("div", {
                        class: "-fsh0"
                    }, (0, n.h)("span", {
                        class: "t"
                    }, i[0]), X, (0, n.h)("span", {
                        class: "t"
                    }, i[1]), X, (0, n.h)("span", {
                        class: "t"
                    }, i[2])))
                };
            const $ = e => {
                var {
                    title: r,
                    subTitle: t,
                    endDate: o,
                    isCentered: c,
                    timerText: a,
                    endText: i,
                    timeLabels: s,
                    bgColor: u,
                    txtColor: p,
                    classes: f
                } = e, b = "".concat(p ? "color:".concat(p, ";") : "").concat(u ? "background:".concat(u, ";") : "");
                return (0, n.h)("div", J({
                    class: (0, l.c)("-phm", f, {
                        "-tac": c,
                        "card _fw": !!u
                    })
                }, b ? {
                    style: b
                } : {}), r && (0, n.h)("h2", {
                    class: "-fs20 -pts -m"
                }, r), t && (0, n.h)("p", {
                    class: "-fs12 -pvs"
                }, t), o ? (0, n.h)(Q, {
                    timeLabels: s,
                    timerText: a,
                    endText: i,
                    endDateTime: new Date(o).getTime()
                }) : (0, n.h)(G, {
                    endText: i
                }))
            };
            var ee = ["map", "keyPrefix", "trackingData"],
                re = ["type", "trackType"];

            function te(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function ne(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? te(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : te(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }

            function oe(e, r) {
                if (null == e) return {};
                var t, n, o = function(e, r) {
                    if (null == e) return {};
                    var t, n, o = {},
                        c = Object.keys(e);
                    for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || (o[t] = e[t]);
                    return o
                }(e, r);
                if (Object.getOwnPropertySymbols) {
                    var c = Object.getOwnPropertySymbols(e);
                    for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t])
                }
                return o
            }

            function ce(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function ae() {
                return ae = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, ae.apply(this, arguments)
            }
            var ie = e => (0, n.h)("div", {
                    class: "col8 -mvxs -phn"
                }, (0, n.h)(B, e)),
                se = e => (0, n.h)("div", {
                    class: "col8 -pvs"
                }, (0, n.h)(W.c, e));
            const le = e => (e => {
                var {
                    map: r,
                    keyPrefix: t,
                    trackingData: n
                } = e, o = oe(e, ee), c = Object.keys(r).reduce(((e, t) => {
                    var n = r[t].props && r[t].props.trackType || t;
                    return ne(ne({}, e), {}, {
                        [n]: 0
                    })
                }), {}), a = 0;
                return e => {
                    var {
                        type: i,
                        trackType: s
                    } = e, l = oe(e, re), u = r[i];
                    if (u) {
                        var p = u.props || {},
                            f = p.trackType || i,
                            b = ++c[f];
                        return a++, u.comp(ne(ne(ne(ne({}, o), l), {}, {
                            trackingData: ne(ne({}, n), {}, {
                                floorPos: b,
                                type: p.trackType
                            }),
                            floorPos: b,
                            widgetCounter: a
                        }, t ? {
                            key: "".concat(t, "_").concat(i, "_").concat(c[f])
                        } : {}), p))
                    }
                }
            })(function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? ce(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ce(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }({
                map: {
                    banner: {
                        comp: ie,
                        props: {
                            trackType: "bannerfloor"
                        }
                    },
                    slider: {
                        comp: M,
                        props: {
                            trackType: "slider",
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    carousel: {
                        comp: c.c,
                        props: {
                            trackType: "productfloor",
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    floor: {
                        comp: a.c,
                        props: {
                            trackType: "productfloor",
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    expanded: {
                        comp: a.c,
                        props: {
                            trackType: "productfloor",
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    freeLinks: {
                        comp: d,
                        props: {
                            trackType: "freelink",
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    freeHtml: {
                        comp: F,
                        props: {
                            classes: "col8 -mvxs"
                        }
                    },
                    countdown: {
                        comp: $,
                        props: {
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    thumbnails: {
                        comp: S,
                        props: {
                            trackType: "thumbnails",
                            classes: "col8 -phn -mvxs"
                        }
                    },
                    promoCarousel: {
                        comp: S,
                        props: {
                            trackType: "promocarousel",
                            classes: "col8 -phn -mvxs",
                            isPromo: !0
                        }
                    },
                    flashSale: {
                        comp: c.c,
                        props: {
                            trackType: "flashsale",
                            classes: "col8 -phn -mvxs",
                            icon: "flash-sales",
                            bgColor: H.wV,
                            txtColor: H.WK
                        }
                    },
                    recommendations: {
                        comp: e => (0, n.h)(o.c, ae({
                            classes: "col8 -mvxs -phn",
                            trackingPageType: e.trackingPageType,
                            pageType: "home"
                        }, e.items ? {
                            products: e.items
                        } : {}, e))
                    },
                    lastViewed: {
                        comp: e => (0, n.h)(o.c, {
                            title: e.title,
                            seeAllCTA: e.seeAllCTA,
                            classes: "col8 -mvxs -phn",
                            type: "lastViewed",
                            template: "floor",
                            reserve: !1,
                            trackingPageType: e.trackingPageType
                        })
                    },
                    lastSearched: {
                        comp: e => (0, n.h)(o.c, {
                            title: e.title,
                            seeAllCTA: e.seeAllCTA,
                            classes: "col8 -mvxs -phn",
                            type: "lastSearched",
                            template: "floor",
                            reserve: !1,
                            trackingPageType: e.trackingPageType
                        })
                    },
                    newsletter: {
                        comp: se
                    }
                }
            }, e))
        },
        8982: (e, r, t) => {
            t.d(r, {
                c: () => p
            });
            var n = t(1360),
                o = t(8164),
                c = t(3104),
                a = t(9048),
                i = t(5764),
                s = e => {
                    var {
                        data: {
                            options: r = []
                        },
                        name: t = "gender"
                    } = e;
                    return (0, n.h)("div", {
                        class: "-df"
                    }, r.map(((e, o) => {
                        var {
                            text: c,
                            value: s
                        } = e;
                        return (0, n.h)(a._Y, {
                            name: t,
                            value: s,
                            classes: (0, i.c)("btn _prim _l -fw ", {
                                "-mls": o + 1 === r.length
                            })
                        }, c)
                    })))
                },
                l = t(2876);

            function u() {
                return u = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, u.apply(this, arguments)
            }
            const p = e => {
                var {
                    title: r,
                    description: t,
                    form: {
                        fields: {
                            email: i,
                            gender: p = [],
                            tagIds: f,
                            legalText: b
                        },
                        htmlErrors: m
                    },
                    policyCTA: v
                } = e, [y, h] = (0, o.oT)(i.errorMessage);
                return (0, n.h)("section", {
                    class: "card _fw -pam -bg-gy9 -wt"
                }, (0, n.h)("h2", {
                    class: "-fs16 -b"
                }, r), (0, n.h)("p", {
                    class: "-fs14 -ptxs -pbs -m"
                }, t), (0, n.h)(a.cp, {
                    action: (0, c.cp)("newsletter.subscription"),
                    htmlErrors: m,
                    isXhr: !0,
                    onSuccessCbx: e => {
                        e.formMessages && h(e.formMessages.email)
                    }
                }, f && f.value && (0, n.h)(a._U, {
                    name: "tagIds",
                    value: f.value
                }), (0, n.h)(a.EF, u({
                    classes: "-fw",
                    name: "email",
                    type: "email",
                    hideLabel: !0,
                    autocomplete: "email"
                }, i, {
                    errorMessage: y
                })), b && (0, n.h)(a.yw, u({
                    name: "legalText",
                    idContext: "nl-cms",
                    classes: "-dif",
                    labelClasses: "-fs16 -wt"
                }, b), (null == v ? void 0 : v.url) && (0, n.h)("div", {
                    class: "-fw"
                }, (0, n.h)(l.c, {
                    href: v.url,
                    target: "_blank",
                    rel: "noopener",
                    class: "_link -or5 -fs14"
                }, v.text))), (0, n.h)(s, {
                    data: p
                })))
            }
        },
        288: (e, r, t) => {
            t.d(r, {
                c: () => O
            });
            var n = t(1360),
                o = t(2528),
                c = null,
                a = e => (null === c && (c = window.__CONFS__.ventureData), c);

            function i(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function s(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? i(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : i(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }
            var l, u = {
                    jumia: "Jumia",
                    zando: "Zando"
                }[l = window.__CONFS__.SHOP],
                p = function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        r = {
                            "@type": "BreadcrumbList",
                            itemListElement: (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []).map(((r, t) => {
                                var {
                                    text: n,
                                    url: o
                                } = r;
                                return !!o && {
                                    "@type": "ListItem",
                                    position: t + 1,
                                    item: {
                                        "@id": "https://www.".concat(e.domain).concat(o),
                                        name: n
                                    }
                                }
                            })).filter(Boolean)
                        };
                    return r.itemListElement.length ? r : {}
                };

            function f(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }

            function b(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var t = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? f(Object(t), !0).forEach((function(r) {
                        var n, o, c, a;
                        n = e, o = r, c = t[r], (o = "symbol" == typeof(a = function(e, r) {
                            if ("object" != typeof e || !e) return e;
                            var t = e[Symbol.toPrimitive];
                            if (void 0 !== t) {
                                var n = t.call(e, "string");
                                if ("object" != typeof n) return n;
                                throw new TypeError("@@toPrimitive must return a primitive value.")
                            }
                            return String(e)
                        }(o)) ? a : String(a)) in n ? Object.defineProperty(n, o, {
                            value: c,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }) : n[o] = c
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : f(Object(t)).forEach((function(r) {
                        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                    }))
                }
                return e
            }
            var m = e => {
                    var {
                        isBuyable: r,
                        rawPrice: t,
                        cheapestPrice: n,
                        highestPrice: o,
                        priceCurrency: c,
                        urls: a = []
                    } = e;
                    return b({
                        "@type": "Offer",
                        availability: "http://schema.org/".concat(r ? "InStock" : "OutOfStock"),
                        price: t,
                        priceCurrency: c
                    }, a.length && {
                        "@type": "AggregateOffer",
                        highPrice: o,
                        lowPrice: n,
                        offerCount: a.length,
                        offers: a.map((e => ({
                            "@type": "Offer",
                            url: e
                        })))
                    })
                },
                v = ["type"],
                y = ["viewData"];

            function h(e, r) {
                if (null == e) return {};
                var t, n, o = function(e, r) {
                    if (null == e) return {};
                    var t, n, o = {},
                        c = Object.keys(e);
                    for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || (o[t] = e[t]);
                    return o
                }(e, r);
                if (Object.getOwnPropertySymbols) {
                    var c = Object.getOwnPropertySymbols(e);
                    for (n = 0; n < c.length; n++) t = c[n], r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (o[t] = e[t])
                }
                return o
            }
            var g = {
                    home: e => {
                        var {
                            countryCode: r,
                            customerService: t = "",
                            social: n = []
                        } = e, o = a();
                        if (!o) return {};
                        var c = "".concat(u, " ").concat(o.name),
                            i = o.domain,
                            p = s({}, t ? {
                                contactPoint: {
                                    "@type": "ContactPoint",
                                    telephone: t,
                                    contactType: "customer service"
                                }
                            } : {});
                        return s({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: c,
                            alternateName: [c, "".concat(u, " ").concat(r), i],
                            url: i,
                            sameAs: n,
                            logo: "https://www.".concat(i).concat("/assets_hy", "/logo_").concat(l, ".svg"),
                            potentialAction: {
                                "@type": "SearchAction",
                                target: "https://www.".concat(i, "/catalog?q={search_term}"),
                                "query-input": "required name=search_term"
                            }
                        }, p)
                    },
                    pdp: e => {
                        var {
                            countryCode: r,
                            breadcrumbs: t,
                            product: {
                                name: n,
                                isBuyable: o,
                                prices: c,
                                mpg: i = {},
                                rating: s = {}
                            } = {},
                            brand: l = {},
                            images: u = [],
                            description: f
                        } = e, v = a();
                        if (!v) return {};
                        var y = u.length ? {
                                image: b({
                                    "@type": "ImageObject",
                                    name: n
                                }, u.reduce(((e, r) => {
                                    var {
                                        thumb: t,
                                        zoom: n
                                    } = r;
                                    return e.contentUrl.push(n), e.thumbnailUrl.push(t), e
                                }), {
                                    contentUrl: [],
                                    thumbnailUrl: []
                                }))
                            } : {},
                            h = s.average > 0 ? {
                                aggregateRating: {
                                    "@type": "AggregateRating",
                                    ratingValue: s.average,
                                    ratingCount: s.totalRatings
                                }
                            } : {};
                        return {
                            "@context": "https://schema.org",
                            "@type": "ItemPage",
                            breadcrumb: p(v, t),
                            mainEntity: b(b({
                                "@type": "Product",
                                name: n,
                                brand: l.text,
                                description: f,
                                offers: m(b(b({
                                    isBuyable: o,
                                    priceCurrency: v.currency
                                }, c), i))
                            }, y), h)
                        }
                    },
                    catalog: e => {
                        var {
                            countryCode: r,
                            breadcrumbs: t = []
                        } = e, n = a();
                        return n ? {
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            breadcrumb: p(n, t)
                        } : {}
                    }
                },
                d = e => {
                    var {
                        type: r
                    } = e, t = h(e, v);
                    return g[r] ? g[r](t) : {}
                };
            const O = (0, o.U)(["countryCode", "viewData"])((e => {
                var {
                    viewData: r = {}
                } = e, t = h(e, y);
                return (0, n.h)("script", {
                    type: "application/ld+json",
                    dangerouslySetInnerHTML: {
                        __html: JSON.stringify(r.linkedData || d(t))
                    }
                })
            }))
        }
    }
]);