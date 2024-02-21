if (!rx || !rx.payload) {
    var rx = rx || {};
    rx._ = rx._ || {};
    rx._.log = function(message, a1) {
        if (window.rx_debug) {
            window.rx_debug += "INFO: " + message + "\n";
        } else {
            window.rx_debug = "INFO: " + message + "\n";
        }
        if (false && window.console) {
            if (typeof a1 == "undefined") {
                window.console.log(message);
            } else {
                window.console.log(message, a1);
            }
        }
    }
    rx._.error = function(message, a1) {
        if (window.rx_debug) {
            window.rx_debug += "ERROR: " + message + "\n";
        } else {
            window.rx_debug = "ERROR: " + message + "\n";
        }
        if (false && window.console) {
            if (typeof a1 == "undefined") {
                window.console.error(message);
            } else {
                window.console.error(message, a1);
            }
        }
    };
    var rx = rx || {};
    rx._ = rx._ || {};
    rx.utils = rx.utils || {};
    rx.utils.addEventListener = function(el, type, fn) {
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
    };
    rx.utils.isDocumentLoaded = function isDOMLoaded() {
        return document.readyState == 'complete';
    };
    rx.utils.onDocumentLoaded = function(fn) {
        if (rx.utils.isDocumentLoaded()) {
            fn();
        } else {
            var fired = false;
            var runFn = function() {
                rx._.log("Runner function, fired = " + fired)
                if (!fired) {
                    fired = true;
                    fn();
                }
            };
            rx.utils.addEventListener(window, "load", runFn);
            setTimeout(runFn, 5000);
        }
    };
    rx.utils.valueOf = function(cssSelectorOrElement) {
        var element;
        if (typeof cssSelectorOrElement == "string") {
            element = document.querySelector(cssSelectorOrElement);
        } else if (typeof cssSelectorOrElement == "object") {
            element = cssSelectorOrElement;
        }
        if (!element) {
            return null;
        }
        return element.textContent.trim() || element.innerHTML || element.value || null;
    }
    rx.utils.regex = function(element, regular_expression) {
        var exp = new RegExp(regular_expression, "g");
        var matches = exp.exec(element);
        if (matches && matches.length > 1) {
            return matches[1];
        }
    };
    rx.utils.pageElementsHasText = function(elements, text) {
        if (text == null) {
            return true;
        }
        if (text && elements) {
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (rx.utils.valueOf(element) === text) return true;
                if (element.hasChildNodes()) {
                    var childElements = element.getElementsByTagName("*")
                    for (var j = 0; j < childElements.length; j++) {
                        if (rx.utils.valueOf(childElements[j]) === text) return true;
                    }
                }
            }
        }
        return false;
    };
    rx.utils.getDomainName = function() {
        var parts = window.location.hostname.split('.');
        if (parts.length > 2) {
            parts.shift();
        }
        return '.' + parts.join('.');
    };
    rx.utils.findSessionStorage = function(keyName) {
        if (typeof(Storage) !== "undefined") {
            return sessionStorage[keyName] || null;
        } else {
            rx._.error("Cannot interact with session storage")
            return null;
        }
    };
    rx.utils.setSessionStorage = function(key, value) {
        rx._.log("Setting session storage " + key + " = " + value);
        if (typeof(Storage) !== "undefined") {
            try {
                if (value) {
                    sessionStorage[key] = value;
                } else {
                    sessionStorage.removeItem(key);
                }
            } catch (e) {
                rx._.error("Failed to set session storage: " + e, e);
            }
        }
    };
    rx.utils.findLocalStorage = function(keyName) {
        if (typeof(Storage) !== "undefined") {
            return localStorage[keyName] || null;
        } else {
            rx._.error("Cannot interact with local storage")
            return null;
        }
    };
    rx.utils.setLocalStorage = function(key, value) {
        rx._.log("Setting local storage " + key + " = " + value);
        if (typeof(Storage) !== "undefined") {
            try {
                if (value) {
                    localStorage[key] = value;
                } else {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                rx._.error("Failed to set local storage: " + e, e);
            }
        }
    };
    rx.utils.setCookie = function(cookieName, cookieValue) {
        rx._.log("Setting cookie " + name + " = " + cookieValue);
        var expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
        document.cookie = encodeURIComponent(cookieName) + "=" + encodeURIComponent(cookieValue || "") + '; ' + 'expires=' + expires.toGMTString() + '; ' + 'domain=' + rx.utils.getDomainName() + '; ' + 'path=/';
    }
    rx.utils.setCookieWithSameSiteSecure = function(cookieName, cookieValue, sameSiteValue, isSecure) {
        if (!['Strict', 'Lax', 'None'].includes(sameSiteValue)) {
            return rx.utils.setCookie(cookieName, cookieValue);
        }
        rx._.log("Setting cookie " + name + " = " + cookieValue + " with SameSite = " + sameSiteValue + " and Secure = " + isSecure);
        var expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
        var secureString = isSecure ? '; Secure' : '';
        document.cookie = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue || "") + '; SameSite=' + sameSiteValue + secureString + '; ' + 'expires=' + expires.toGMTString() + '; ' + 'domain=' + rx.utils.getDomainName() + '; ' + 'path=/';
    }
    rx.utils.findCookie = function(cookieName) {
        var name = encodeURIComponent(cookieName) + "=";
        var allCookies = document.cookie.split(';');
        for (var i = 0; i < allCookies.length; i++) {
            var cookie = allCookies[i];
            while (cookie.length > 0 && cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                var cookieValue = cookie.substring(name.length, cookie.length);
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    };
    rx._.utils = rx.utils || {};
    rx._.log("Setting up script");
    rx._.payload = {};
    rx._.payload.viewer = {};
    rx._.payload.referrer = document.referrer;
    rx._.payload.title = document.title;
    rx._.payload.eventType = null;
    rx._.payload.pageType = null;
    rx._.payload.scriptId = "969d39bc-98f0-11e9-bf69-83e62c80cc13";
    if (rx._.partner && rx._.partner.id) {
        rx._.payload.partnerId = rx._.partner.id;
    }
    rx.utils = rx.utils || {};
    rx.utils.setClientId = function() {
        rx._.payload.cid = (function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                return "3246";
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        })();
    };
    rx.utils.findParam = function(name) {
        var q = window.location.search;
        if (!q) {
            return null;
        }
        var tokens = q.substring(1).split("&");
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i].split("=");
            if (name == token[0] && token[1]) {
                return decodeURIComponent(token[1]);
            }
        }
        return null;
    }
    rx.utils.cloneNode = function(el) {
        if (!el) {
            rx._.error("Cannot clone null element - returning null")
            return null;
        }
        if (el.nodeType != 1) {
            return el.cloneNode();
        }
        var i = 1;
        var idName = function() {
            return (el.id ? el.id : "clone") + "-generated" + (i == 1 ? "" : "-" + i)
        };
        while (document.getElementById(idName())) {
            i++;
        }
        var type = el.getAttribute("type");
        if (type && type.toLowerCase() == "submit") {
            type = "button";
        }
        var clone = null;
        try {
            if (type) {
                clone = document.createElement("<" + el.tagName + " type=\"" + type + "\">");
                rx._.log("Used legacy approach to create " + el.tagName);
            }
        } catch (e) {
            rx._.log("Problem creating element - will try a more modern approach to create " + el.tagName, e);
        }
        if (!clone) {
            clone = document.createElement(el.tagName);
            try {
                if (type) {
                    clone.setAttribute("type", type);
                }
            } catch (e) {
                rx._.error("Problem setting type in modern approach to create " + el.tagName, type);
            }
            rx._.log("Used modern approach to create " + el.tagName);
        }
        clone.id = idName();
        var attributes = ["class", "style", "width", "height", "font", "align", "valign", "title", "placeholder", "value", "src", "alt", "disabled"];
        for (var i = 0; i < attributes.length; i++) {
            if (el.getAttribute(attributes[i])) {
                clone.setAttribute(attributes[i], el.getAttribute(attributes[i]));
            } else if (el.getAttribute(attributes[i].toUpperCase())) {
                clone.setAttribute(attributes[i], el.getAttribute(attributes[i].toUpperCase()));
            }
        }
        if (el.href) {
            clone.href = "javascript:void(0)";
        }
        if (el.childNodes) {
            for (var i = 0; i < el.childNodes.length; i++) {
                clone.appendChild(rx.utils.cloneNode(el.childNodes[i]));
            }
        }
        return clone;
    };
    rx.utils.stopEvent = function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    };
    rx._.log("Setting up tracking logic");
    rx._.tracking = {};
    rx._.setTracking = function() {
        rx._.payload.viewer.v2_first = rx.utils.findCookie("_RCRTX02");
        rx._.payload.viewer.v2_local = rx.utils.findLocalStorage("viewer_id");
        rx._.payload.viewer.v3_first = rx.utils.findCookie("_RCRTX03");
        rx._.payload.viewer.v3_first_samesite = rx.utils.findCookie("_RCRTX03-samesite");
        rx._.payload.viewer.v3_local = rx.utils.findLocalStorage("viewer_id_v3");
        rx._.payload.viewer.v3_param = rx.utils.findParam("rx_viewer");
    }
    rx._.setTracking();
    rx._.viewer_id_from_server = null;
    rx._.log("Setting up de-duplication logic");
    rx._.duplicates = {};
    rx._.duplicates.isDuplicate = function() {
        var key = rx._.duplicates._toKey();
        var value = rx.utils.findSessionStorage(key);
        rx._.log("Found key " + key + " and value " + value);
        return value != null;
    };
    rx._.duplicates.log = function() {
        var key = rx._.duplicates._toKey();
        rx._.log("Duplication key is " + key);
        var value = new Date().getTime();
        rx._.log("Duplication value is " + value);
        rx.utils.setSessionStorage(key, value);
        rx._.log("Updated event record for key " + key + " and value " + value);
    }
    rx._.duplicates._toKey = function() {
        var key = "rx_duplicates_";
        if (rx._.payload.cid) {
            key += rx._.payload.cid;
        } else {
            key += "???"
        }
        key += "_";
        if (rx._.payload.jobId) {
            key += rx._.payload.jobId;
        } else {
            key += "???";
        }
        key += "_";
        if (rx._.payload.eventType) {
            key += rx._.payload.eventType;
        } else {
            key += "???";
        }
        return key;
    }
    rx._.versionId = "bc0e953e-b65d-11ee-9831-b7731f739293"
    rx._.pages = []
    rx._.pages.push({
        name: "Thank You",
        check: function() {
            var url = window.location.href;
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }
            if (url.indexOf('#') >= 0) {
                url = url.substring(0, url.indexOf('#'));
            }
            var regexValue = rx.utils.regex(url, "(confirmation)");
            if (regexValue) {
                return decodeURIComponent(regexValue);
            }
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                var value = (function() {
                    var url = document.referrer;
                    var regexValue = rx.utils.regex(url, "[&?]rx_job=([\\w-%_,.]+)(?:&|#|$)");
                    if (regexValue) {
                        return decodeURIComponent(regexValue);
                    }
                })();
                value = (function(value) {
                    if (value) return value;
                    var fromSession = rx.utils.findSessionStorage("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13");
                    if (fromSession) return fromSession;
                    return rx.utils.findCookie("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13");
                })(value);
                return value;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: false,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "apply";
            },
            nvp: [{
                name: "applyFlowId",
                value: function() {
                    var value = (function() {
                        return null;
                    })();
                    value = (function(value) {
                        if (value) return value;
                        var fromSession = rx.utils.findSessionStorage("rx_applyflowid_969d39bc-98f0-11e9-bf69-83e62c80cc13");
                        if (fromSession) return fromSession;
                        return rx.utils.findCookie("rx_applyflowid_969d39bc-98f0-11e9-bf69-83e62c80cc13");
                    })(value);
                    return value;
                }
            }],
            tags: [{
                name: "Google Conv (greenhouse)",
                value: "<!-- Global site tag (gtag.js) - Google Ads: 366410301 --><script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-366410301\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-366410301');</script><!-- Event snippet for Apply - Greenhouse conversion page --><script>gtag('event', 'conversion', {'send_to': 'AW-366410301/AOguCMr0t-4CEL30264B'});</script>"
            }, {
                name: "Meta Conversion Pixel",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');fbq('track', 'SubmitApplication',{job_id: rx._.payload.jobId });</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }]
        }],
        sendDefaultPageview: true
    });
    rx._.pages.push({
        name: "Application Page",
        check: function() {
            var url = window.location.href;
            var regexValue = rx.utils.regex(url, "(greenhouse.*#app)");
            if (regexValue) {
                return decodeURIComponent(regexValue);
            }
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                var value = (function() {
                    return null;
                })();
                value = (function(value) {
                    if (value) return value;
                    var fromSession = rx.utils.findSessionStorage("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13");
                    if (fromSession) return fromSession;
                    return rx.utils.findCookie("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13");
                })(value);
                return value;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: false,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DO_NOT_SEND",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "pageview";
            },
            nvp: [],
            tags: [{
                name: "Meta Global Site Tag",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }]
        }],
        sendDefaultPageview: true
    });
    rx._.pages.push({
        name: "Job Details",
        check: function() {
            var url = window.location.href;
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }
            if (url.indexOf('#') >= 0) {
                url = url.substring(0, url.indexOf('#'));
            }
            var regexValue = rx.utils.regex(url, "(jobs)");
            if (regexValue) {
                return decodeURIComponent(regexValue);
            }
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                var value = (function() {
                    var url = window.location.href;
                    var regexValue = rx.utils.regex(url, "[&?]rx_job=([\\w-%_,.]+)(?:&|#|$)");
                    if (regexValue) {
                        return decodeURIComponent(regexValue);
                    }
                })();
                value = (function(value) {
                    if (value) {
                        rx.utils.setSessionStorage("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                        rx.utils.setCookie("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                    }
                    return value;
                })(value);
                return value;
            })
            lookupFunctions.push(function() {
                var value = (function() {
                    var url = window.location.href;
                    if (url.indexOf('?') >= 0) {
                        url = url.substring(0, url.indexOf('?'));
                    }
                    if (url.indexOf('#') >= 0) {
                        url = url.substring(0, url.indexOf('#'));
                    }
                    var regexValue = rx.utils.regex(url, "(\\d+)");
                    if (regexValue) {
                        return decodeURIComponent(regexValue);
                    }
                })();
                value = (function(value) {
                    if (value) {
                        rx.utils.setSessionStorage("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                        rx.utils.setCookie("rx_jobid_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                    }
                    return value;
                })(value);
                return value;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: true,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "jobview";
            },
            nvp: [],
            tags: [{
                name: "Google Global",
                value: "<!-- Global site tag (gtag.js) - Google Ads: 366410301 --><script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-366410301\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-366410301');</script><!-- Event snippet for Clicks to Career Site conversion pageIn your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button. --><script>function gtag_report_conversion(url) {var callback = function () {if (typeof(url) != 'undefined') {window.location = url;}};gtag('event', 'conversion', {'send_to': 'AW-366410301/kaWICOPZ58wDEL30264B','event_callback': callback});return false;}</script>"
            }, {
                name: "Meta Jobview Pixel",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');fbq('track', 'ViewContent',{job_id: rx._.payload.jobId });</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }, {
                name: "Meta Global Site Tag",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }]
        }, {
            type: "CLICK",
            selector: "#submit_app",
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: true,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "button click";
            },
            nvp: [{
                name: "applyFlowId",
                value: function() {
                    var value = (function() {
                        return document.getElementById("email").value.toLowerCase();
                    })();
                    value = (function(value) {
                        if (value) {
                            rx.utils.setSessionStorage("rx_applyflowid_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                            rx.utils.setCookie("rx_applyflowid_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                        }
                        return value;
                    })(value);
                    return value;
                }
            }],
            tags: [{
                name: "Meta Initiate Apply Pixel",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');fbq('track', 'InitiateApplication',{job_id: rx._.payload.jobId });</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }]
        }, {
            type: "CLICK",
            selector: ".jobpost-applybutton",
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: true,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "button click";
            },
            nvp: [],
            tags: [{
                name: "Meta Initiate Apply Pixel",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');fbq('track', 'InitiateApplication',{job_id: rx._.payload.jobId });</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }]
        }],
        sendDefaultPageview: true
    });
    rx._.pages.push({
        name: "jobdetails.io Success",
        check: function() {
            var url = window.location.href;
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }
            if (url.indexOf('#') >= 0) {
                url = url.substring(0, url.indexOf('#'));
            }
            var regexValue = rx.utils.regex(url, "(/success)");
            if (regexValue) {
                return decodeURIComponent(regexValue);
            }
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                return null;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: false,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "signup";
            },
            nvp: [],
            tags: [{
                name: "Google jobdetails.io Conv",
                value: "<!-- Global site tag (gtag.js) - Google Ads: 366410301 --><script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-366410301\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-366410301');gtag('event', 'conversion', {'send_to': 'AW-366410301/LGlbCIT-1pQCEL30264B'});</script>"
            }]
        }],
        sendDefaultPageview: true
    });
    rx._.pages.push({
        name: "jobdetails.io Job Details",
        check: function() {
            var url = window.location.href;
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }
            if (url.indexOf('#') >= 0) {
                url = url.substring(0, url.indexOf('#'));
            }
            var regexValue = rx.utils.regex(url, "(jobdetails.io)");
            if (regexValue) {
                return decodeURIComponent(regexValue);
            }
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                var value = (function() {
                    return null;
                })();
                value = (function(value) {
                    if (value) {
                        rx.utils.setSessionStorage("rx_cache_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                        rx.utils.setCookie("rx_cache_969d39bc-98f0-11e9-bf69-83e62c80cc13", value);
                    }
                    return value;
                })(value);
                return value;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: false,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "pageview";
            },
            nvp: [],
            tags: [{
                name: "Google jobdetails.io Site",
                value: "<!-- Global site tag (gtag.js) - Google Ads: 366410301 --><script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-366410301\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-366410301');</script>"
            }]
        }],
        sendDefaultPageview: true
    });
    rx._.pages.push({
        name: "FXRecruiter Landing Page",
        check: function() {
            var url = window.location.href;
            if (url.indexOf('?') >= 0) {
                url = url.substring(0, url.indexOf('?'));
            }
            if (url.indexOf('#') >= 0) {
                url = url.substring(0, url.indexOf('#'));
            }
            var regexValue = rx.utils.regex(url, "(doordash.fxrecruiter)");
            if (regexValue) {
                return decodeURIComponent(regexValue);
            }
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                return null;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: false,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "pageview";
            },
            nvp: [],
            tags: [{
                name: "Google jobdetails.io Site",
                value: "<!-- Global site tag (gtag.js) - Google Ads: 366410301 --><script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-366410301\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-366410301');</script>"
            }]
        }, {
            type: "CLIENT_INITIATED",
            selector: null,
            selectorText: null,
            clientTriggerName: "applicationsubmitted",
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "signup";
            },
            nvp: [],
            tags: []
        }],
        sendDefaultPageview: true
    });
    rx._.pages.push({
        name: "All Other Pages",
        check: function() {
            return "true";
        },
        jobId: function() {
            var lookupFunctions = []
            lookupFunctions.push(function() {
                return null;
            })
            var value = undefined;
            for (var rx_i = 0; rx_i < lookupFunctions.length; rx_i++) {
                if (value == undefined && lookupFunctions[rx_i] !== undefined) {
                    value = lookupFunctions[rx_i]();
                }
            }
            return value;
        },
        hasCustomJs: false,
        triggers: [{
            type: "PAGE_LOAD",
            selector: null,
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: false,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "pageview";
            },
            nvp: [],
            tags: [{
                name: "Google Global",
                value: "<!-- Global site tag (gtag.js) - Google Ads: 366410301 --><script async src=\"https://www.googletagmanager.com/gtag/js?id=AW-366410301\"></script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'AW-366410301');</script><!-- Event snippet for Clicks to Career Site conversion pageIn your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button. --><script>function gtag_report_conversion(url) {var callback = function () {if (typeof(url) != 'undefined') {window.location = url;}};gtag('event', 'conversion', {'send_to': 'AW-366410301/kaWICOPZ58wDEL30264B','event_callback': callback});return false;}</script>"
            }, {
                name: "Meta Global Site Tag",
                value: "<!-- Meta Pixel Code --><script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '388022696686430');fbq('track', 'PageView');</script><noscript><img height=\"1\" width=\"1\" style=\"display:none\"src=\"https://www.facebook.com/tr?id=388022696686430&ev=PageView&noscript=1\"/></noscript><!-- End Meta Pixel Code -->"
            }]
        }, {
            type: "CLICK",
            selector: "#alljobs",
            selectorText: "See All Jobs",
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: true,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "button click";
            },
            nvp: [],
            tags: [{
                name: "Google Button Conv Callback",
                value: "<script> gtag_report_conversion() </script>"
            }]
        }, {
            type: "CLICK",
            selector: "body > header > div > a.cta.join_nav",
            selectorText: "Join Our Team",
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: true,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "button click";
            },
            nvp: [],
            tags: [{
                name: "Google Button Conv Callback",
                value: "<script> gtag_report_conversion() </script>"
            }]
        }, {
            type: "CLICK",
            selector: "a[href*='https://careers.doordash.com/#open-positions']",
            selectorText: null,
            clientTriggerName: null,
            preventDuplicates: false,
            prioritizeJobIdLookup: false,
            cacheTriggerObjectProperties: false,
            propertiesToCache: [],
            lessAggressiveRendering: true,
            parameterStrategy: "DEFAULT",
            urlSelectionStrategy: "DEFAULT",
            eventType: function() {
                return "button click";
            },
            nvp: [],
            tags: [{
                name: "Google Button Conv Callback",
                value: "<script> gtag_report_conversion() </script>"
            }]
        }],
        sendDefaultPageview: true
    });
    rx._.currentPage = {};
    if (rx._.pages[0].check()) {
        rx._.currentPage = rx._.pages[0];
    } else if (rx._.pages[1].check()) {
        rx._.currentPage = rx._.pages[1];
    } else if (rx._.pages[2].check()) {
        rx._.currentPage = rx._.pages[2];
    } else if (rx._.pages[3].check()) {
        rx._.currentPage = rx._.pages[3];
    } else if (rx._.pages[4].check()) {
        rx._.currentPage = rx._.pages[4];
    } else if (rx._.pages[5].check()) {
        rx._.currentPage = rx._.pages[5];
    } else if (rx._.pages[6].check()) {
        rx._.currentPage = rx._.pages[6];
    }
    rx._.hasClientCustomJS = false;
    rx._.anonymizeIp = false;
    rx._.log("Setting up triggering logic");
    rx._.ajax = {};
    rx._.ajax.counts = {
        attempted: 0,
        success: 0
    };
    rx._.ajax.sendEvent = function(page, trigger, fn) {
        rx._.log("Setting up callback function");
        if (fn) {
            rx._.log("There is a callback function");
        } else {
            fn = function() {};
        }
        if (rx._.versionId !== undefined) {
            rx._.payload.versionId = rx._.versionId;
        }
        rx._.log("Setting up page type");
        if (page && page.name) {
            rx._.payload.pageType = page.name;
        } else {
            rx._.payload.pageType = "Page";
        }
        rx._.log("Setting up event type");
        if (trigger && typeof trigger.eventType == "function") {
            rx._.payload.eventType = trigger.eventType();
        } else {
            rx._.payload.eventType = "pageview";
        }
        rx._.log("Setting up job id");
        if (page && typeof page.jobId == "function") {
            rx._.payload.jobId = page.jobId();
        }
        if (trigger !== undefined && trigger.clientTriggerObject !== undefined && trigger.clientTriggerObject.jobId !== undefined && !trigger.prioritizeJobIdLookup) {
            rx._.payload.jobId = trigger.clientTriggerObject.jobId;
        }
        var shouldTruncate = rx._.ajax.counts.attempted > 0;
        if (trigger && trigger.parameterStrategy == "DO_NOT_SEND") {
            rx._.log("Found 'do not send' strategy for URL parameter truncation")
            shouldTruncate = true;
        } else if (trigger && trigger.parameterStrategy == "ALWAYS_SEND") {
            rx._.log("Found 'always send' strategy for URL parameter truncation")
            shouldTruncate = false;
        } else {
            rx._.log("Using default strategy for URL parameter truncation")
        }
        if (trigger && trigger.urlSelectionStrategy == "REFERRER") {
            rx._.payload.uri = document.referrer;
        } else {
            rx._.payload.uri = window.location.href
        }
        rx._.log(shouldTruncate ? "Truncating URL parameters" : "Leaving URL parameters intact");
        if (shouldTruncate && window.location.href.indexOf("?") >= 0) {
            rx._.payload.uri = rx._.payload.uri.substring(0, window.location.href.indexOf("?"));
        }
        rx._.payload.hasCustomJs = rx._.hasClientCustomJS || page.hasCustomJs;
        rx._.payload.anonymizeIp = rx._.anonymizeIp;
        rx._.log("Handling NVP's");
        rx._.payload.nvp = {};
        if (trigger && trigger.nvp) {
            for (var index = 0; index < trigger.nvp.length; index++) {
                var nvp = trigger.nvp[index];
                rx._.payload.nvp[nvp.name] = nvp.value();
            }
        }
        if (trigger !== undefined && trigger.clientTriggerObject !== undefined && trigger.clientTriggerObject.applyFlowId !== undefined) {
            if (rx._.payload.nvp === undefined) {
                rx._.payload.nvp = {};
            }
            rx._.payload.nvp.applyFlowId = trigger.clientTriggerObject.applyFlowId;
        }
        rx._.log("Checking for document body");
        if (!document.body) {
            rx._.error("Won't send event - document body not yet available for appending iframe");
            fn();
            return;
        }
        rx._.log("Checking for duplicates");
        if (trigger && trigger.preventDuplicates && rx._.duplicates.isDuplicate()) {
            rx._.log("Won't send event - would be duplicate of a prior event");
            fn();
            return;
        }
        rx._.log("Recoding event for possible duplicate prevention later");
        rx._.duplicates.log();
        rx._.log("Sending event ", rx._.payload);
        rx._.ajax.counts.attempted++;
        rx._.ajax.callback = fn;
        rx._.ajax.iframe = document.createElement('iframe');
        rx._.ajax.iframe.style.display = "none";
        rx._.ajax.iframe.setAttribute('loading', 'eager');
        rx._.ajax.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        rx._.ajax.iframe.src = "//jsv3.recruitics.com/969d39bc-98f0-11e9-bf69-83e62c80cc13-iframe?e=" + encodeURIComponent(JSON.stringify(rx._.payload));
        rx._.log("Appending iFrame");
        document.body.appendChild(rx._.ajax.iframe);
        rx._.appendTagsFromTrigger(trigger);
        if (trigger !== undefined && trigger.clientTriggerObject !== undefined && trigger.cacheTriggerObjectProperties !== undefined && trigger.cacheTriggerObjectProperties && trigger.propertiesToCache !==
            undefined) {
            for (var x = 0; x < trigger.propertiesToCache.length; x++) {
                const propertyName = trigger.propertiesToCache[x].clientPropertyName;
                if (trigger.clientTriggerObject[propertyName] !== undefined && trigger.clientTriggerObject[propertyName] !== '') {
                    rx._.utils.setSessionStorage(trigger.propertiesToCache[x].cacheKey, trigger.clientTriggerObject[propertyName]);
                    rx._.utils.setCookie(trigger.propertiesToCache[x].cacheKey, trigger.clientTriggerObject[propertyName]);
                }
            }
        }
    };
    rx._.appendTagsFromTrigger = function(trigger) {
        if (trigger === undefined) {
            return;
        }
        for (var x = 0; x < trigger.tags.length; x++) {
            rx._.log("Adding tag", trigger.tags[x].name);
            rx._.appendTag(trigger.tags[x]);
        }
    }
    rx._.appendTag = function(tag) {
        if (tag === undefined) {
            rx._.log("Attempting to append an undefined tag");
            return;
        }
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = tag.value;
        var length = htmlObject.childElementCount;
        for (var childIdx = 0; childIdx < htmlObject.childElementCount;) {
            var el = htmlObject.childNodes[childIdx];
            if (el !== undefined && el.tagName !== undefined && el.tagName.toUpperCase() == "SCRIPT") {
                var tagEl = document.createElement('script');
                for (var attrIdx = 0; attrIdx < el.attributes.length; attrIdx++) {
                    tagEl.setAttribute(el.attributes[attrIdx].name, el.attributes[attrIdx].value);
                }
                tagEl.innerText = el.innerText;
                document.body.appendChild(tagEl);
                htmlObject.removeChild(el);
            } else {
                document.body.appendChild(el);
            }
        }
    }
    rx._.ajax.loadListener = function() {
        rx._.log("Setting up page load trigger");
        if (rx._.ajax.loadListenerFired) {
            return;
        }
        rx.utils.setClientId();
        rx._.ajax.loadListenerFired = true;
        if (rx._.currentPage && rx._.currentPage.triggers) {
            var loadTriggers = [];
            for (var i = 0; i < rx._.currentPage.triggers.length; i++) {
                if (rx._.currentPage.triggers[i].type == "PAGE_LOAD") {
                    loadTriggers.push(rx._.currentPage.triggers[i]);
                }
            }
            if (loadTriggers.length == 0) {
                if (rx._.currentPage.sendDefaultPageview) {
                    rx._.ajax.sendEvent(rx._.currentPage);
                }
            } else {
                for (var i = 0; i < loadTriggers.length; i++) {
                    rx._.ajax.sendEvent(rx._.currentPage, loadTriggers[i]);
                }
            }
        } else {
            rx._.ajax.sendEvent(rx._.currentPage);
        }
    };
    rx._.ajax.loadListenerFired = false;
    rx._.ajax.extractViewerIdFromEvent = function(event) {
        if (!event || !event.data || typeof event.data != "string" || !event.data.indexOf("rx_viewer=") == 0) {
            return null;
        }
        return event.data.substring(10);
    }
    rx._.ajax.messageListener = function(event) {
        var viewerId = rx._.ajax.extractViewerIdFromEvent(event);
        if (!viewerId) {
            return;
        }
        rx._.viewer_id_from_server = viewerId;
        rx._.log("Received Viewer ID", viewerId);
        rx.utils.setCookie("_RCRTX03", viewerId);
        rx.utils.setCookieWithSameSiteSecure("_RCRTX03-samesite", viewerId, "None", true);
        rx.utils.setLocalStorage("viewer_id_v3", viewerId);
        rx._.setTracking();
        if (rx._.ajax.callback) {
            rx._.log("Calling callback function")
            rx._.ajax.callback();
            rx._.ajax.callback = null;
        }
        rx._.ajax.counts.success++;
    };
    rx._.ajax.configureClickEvents = function() {
        rx._.log("Setting up click triggers");
        if (rx._.currentPage && rx._.currentPage.triggers) {
            for (var i = 0; i < rx._.currentPage.triggers.length; i++) {
                (function() {
                    var trigger = rx._.currentPage.triggers[i];
                    if (trigger.type == "CLICK" && document.querySelectorAll) {
                        var els = document.querySelectorAll(trigger.selector);
                        if (els) {
                            for (var j = 0; j < els.length; j++) {
                                (function() {
                                    var el = els[j];
                                    if (el.target == "_blank" || trigger.lessAggressiveRendering) {
                                        rx._.log("Using event listener for click trigger", el);
                                        rx.utils.addEventListener(el, "click", function(e) {
                                            rx._.ajax.sendEvent(rx._.currentPage, trigger);
                                        });
                                    } else {
                                        rx._.log("Using clone method for click trigger", el);
                                        var clone = rx.utils.cloneNode(el);
                                        el.style.display = "none";
                                        el.parentNode.insertBefore(clone, el);
                                        rx.utils.addEventListener(clone, "click", function() {
                                            rx._.ajax.sendEvent(rx._.currentPage, trigger, function() {
                                                rx._.log("Clicking actual element after analytics event")
                                                el.click();
                                            });
                                        });
                                        rx.utils.addEventListener(clone, "contextmenu", rx.utils.stopEvent);
                                    }
                                })();
                            }
                        }
                    }
                })();
            }
        }
    }
    rx._.ajax.configureFormSubmitEvents = function() {
        rx._.log("Setting up form submit triggers");
        if (rx._.currentPage && rx._.currentPage.triggers) {
            for (var i = 0; i < rx._.currentPage.triggers.length; i++) {
                (function() {
                    var trigger = rx._.currentPage.triggers[i];
                    if (trigger.type == "FORM_SUBMIT" && document.querySelectorAll) {
                        var els = document.querySelectorAll(trigger.selector);
                        if (els) {
                            for (var j = 0; j < els.length; j++) {
                                (function() {
                                    var el = els[j];
                                    var eventSent = false;
                                    if (el && el.tagName && el.tagName.toLowerCase() == "form") {
                                        rx._.log("Found form tag", el);
                                        var onSubmitFn = el.onsubmit;
                                        el.onsubmit = null;
                                        rx.utils.addEventListener(el, "submit", function(e) {
                                            rx._.log("Got event", e);
                                            if (typeof e.defaultPrevented == "boolean" && e.defaultPrevented) {
                                                rx._.log("Event is cancelled by prior validation")
                                            } else if (typeof onSubmitFn == "function" && !onSubmitFn()) {
                                                rx._.log("On submit function from client site failed, aborting event submit");
                                                rx.utils.stopEvent(e);
                                            } else if (eventSent) {
                                                rx._.log("Form event already sent");
                                            } else {
                                                rx.utils.stopEvent(e);
                                                rx._.ajax.sendEvent(rx._.currentPage, trigger, function() {
                                                    rx._.log("Submitting form", el);
                                                    el.submit();
                                                });
                                                eventSent = true;
                                            }
                                        });
                                    } else {
                                        rx._.error("Not a form tag", el);
                                    }
                                })();
                            }
                        }
                    }
                })();
            }
        }
    };
    rx._.ajax.checkCssSelectorTrigger = function() {
        if (rx._.currentPage && rx._.currentPage.triggers) {
            for (var i = 0; i < rx._.currentPage.triggers.length; i++) {
                var trigger = rx._.currentPage.triggers[i];
                if (trigger.type == "CSS_SELECTOR" && trigger.selector) {
                    var elements = document.querySelectorAll(trigger.selector);
                    var matchesDomElements = elements.length > 0;
                    var hasSelectorTextOrNoTextSelector = rx.utils.pageElementsHasText(elements, trigger.selectorText)
                    if (matchesDomElements && !trigger.exists && hasSelectorTextOrNoTextSelector) {
                        rx._.log("Found elements matching selector " + trigger.selector, elements);
                        rx._.ajax.sendEvent(rx._.currentPage, trigger);
                    }
                    trigger.exists = matchesDomElements;
                }
            }
        }
    };
    rx.utils.addEventListener(window, "message", rx._.ajax.messageListener);
    rx.utils.onDocumentLoaded(function() {
        if (rx.utils.isDocumentLoaded()) {
            rx._.log("Document is loaded, ready to complete configuration")
        } else {
            rx._.error("Document is not loaded, completing configuration anyway")
        }
        rx._.ajax.loadListener();
        setTimeout(rx._.ajax.configureFormSubmitEvents, 100);
        rx._.ajax.configureClickEvents();
        setInterval(rx._.ajax.checkCssSelectorTrigger, 250);
    });
    rx._.log("Setting up system programming interfaces (JSv3 SPI)");
    rx.trigger = function(triggerArg) {
        rx.utils.onDocumentLoaded(function() {
            var clientTriggerObject = {};
            if (typeof triggerArg == "string") {
                clientTriggerObject.triggerName = triggerArg;
            } else {
                clientTriggerObject = triggerArg;
            }
            var clientTriggerName = clientTriggerObject.triggerName;
            rx._.log("Trigger called with client trigger name '" + clientTriggerName + "'");
            if (!rx._.currentPage) {
                rx._.error("Unknown current page");
                return;
            }
            var triggers = rx._.currentPage.triggers;
            if (typeof triggers != "object" || !triggers.length || triggers.length <= 0) {
                rx._.error("No triggers found for current page", triggers);
                return;
            }
            var triggeredCount = 0;
            for (var i = 0; i < triggers.length; i++) {
                var trigger = triggers[i];
                if (trigger.type == "CLIENT_INITIATED" && trigger.clientTriggerName == clientTriggerName) {
                    rx._.log("Matching trigger found for '" + clientTriggerName + "'", trigger);
                    trigger.clientTriggerObject = clientTriggerObject;
                    rx._.ajax.sendEvent(rx._.currentPage, trigger);
                    triggeredCount++;
                }
            }
            if (triggeredCount == 0) {
                rx._.error("No trigger matched for client trigger name", clientTriggerName);
            }
        })
    };
    rx.getViewerId = function(fn) {
        if (!rx._.spi.viewerId) {
            if (typeof fn == "function") {
                rx._.spi.viewerIdCallbackFns.push(fn);
            }
            return null;
        }
        if (typeof fn == "function") {
            fn(rx._.spi.viewerId);
        }
        return rx._.spi.viewerId;
    }
    rx._.spi = {};
    rx._.spi.viewerIdCallbackFns = [];
    rx._.spi.viewerId = null;
    rx.utils.addEventListener(window, "message", function(event) {
        var viewerId = rx._.ajax.extractViewerIdFromEvent(event);
        if (!viewerId) {
            return;
        }
        rx._.spi.viewerId = viewerId;
        while (rx._.spi.viewerIdCallbackFns.length > 0) {
            var fn = rx._.spi.viewerIdCallbackFns.pop();
            fn(viewerId);
        }
    });
}