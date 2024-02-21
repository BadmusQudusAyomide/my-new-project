"use strict";
(self.webpackChunkhydrogen = self.webpackChunkhydrogen || []).push([
    [8806], {
        8640: (e, r, t) => {
            t.d(r, {
                c: () => c
            });
            var n = t(1360),
                o = t(3728);
            const c = e => {
                var {
                    seoText: r
                } = e;
                return (0, n.h)(o._, {
                    markup: r,
                    classes: "-fs12 -phm"
                })
            }
        },
        8806: (e, r, t) => {
            t.r(r), t.d(r, {
                default: () => y
            });
            var n = t(1360),
                o = t(288),
                c = t(8116),
                s = t(6992),
                a = t(8640),
                i = t(3528),
                p = t(200),
                l = ["background", "slider", "items", "seoText", "showMoreCTA", "showLessCTA", "contacts", "cmsKey", "cmsRev", "trackingPageType", "back2TopCTA"];

            function u() {
                return u = Object.assign ? Object.assign.bind() : function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = arguments[r];
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    }
                    return e
                }, u.apply(this, arguments)
            }

            function b(e, r) {
                var t = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r && (n = n.filter((function(r) {
                        return Object.getOwnPropertyDescriptor(e, r).enumerable
                    }))), t.push.apply(t, n)
                }
                return t
            }
            var f = a.c;
            const y = e => {
                var {
                    background: r,
                    slider: t,
                    items: a = [],
                    seoText: y,
                    showMoreCTA: h,
                    showLessCTA: g,
                    contacts: v,
                    cmsKey: O,
                    cmsRev: m,
                    trackingPageType: d,
                    back2TopCTA: w
                } = e, j = function(e, r) {
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
                }(e, l), T = {
                    pageType: d
                }, P = (0, c.c)(function(e) {
                    for (var r = 1; r < arguments.length; r++) {
                        var t = null != arguments[r] ? arguments[r] : {};
                        r % 2 ? b(Object(t), !0).forEach((function(r) {
                            var n, o, c, s;
                            n = e, o = r, c = t[r], (o = "symbol" == typeof(s = function(e, r) {
                                if ("object" != typeof e || !e) return e;
                                var t = e[Symbol.toPrimitive];
                                if (void 0 !== t) {
                                    var n = t.call(e, "string");
                                    if ("object" != typeof n) return n;
                                    throw new TypeError("@@toPrimitive must return a primitive value.")
                                }
                                return String(e)
                            }(o)) ? s : String(s)) in n ? Object.defineProperty(n, o, {
                                value: c,
                                enumerable: !0,
                                configurable: !0,
                                writable: !0
                            }) : n[o] = c
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : b(Object(t)).forEach((function(r) {
                            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
                        }))
                    }
                    return e
                }({
                    trackingData: T,
                    trackingPageType: d,
                    keyPrefix: "home"
                }, j));
                return (0, n.h)("main", null, (0, n.h)(s.c, r), (0, n.h)("div", {
                    class: "row"
                }, a.map(P), y && (0, n.h)("div", {
                    class: "col8 -phn -ptxs -pbs"
                }, (0, n.h)(p.c, {
                    wrapperClasses: "-mvs card _fw",
                    ctaClasses: "btn _def",
                    contentClasses: "_maxh-176",
                    id: "seo-block",
                    showCTA: h,
                    hideCTA: g
                }, (0, n.h)(f, {
                    seoText: y,
                    revision: "".concat(O, "_").concat(m)
                })))), (0, n.h)(o.c, u({
                    type: "home"
                }, v)), (0, n.h)(i.c, {
                    ctaText: w
                }))
            }
        }
    }
]);