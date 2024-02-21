//$('.postcontent a').attr('target','_blank');

$('<div class="expandcode" title="Expand / Shrink"></div>').appendTo('.wp-block-code')
$(document).on('click', '.expandcode', function(e) {
    $(this).parents('.wp-block-code').toggleClass('expanded')
})
/*
$(document).on('mouseleave', '.expandcode', function(e) {
	$(this).parents('.wp-block-code').removeClass('expanded')
})
*/

$(document).on('submit', '#subscribeform', function() {
    _gaq.push(['_trackEvent', 'subscribe', 'submit', 'sidebar', 1]);
});
$(document).on('submit', '#subscribe2Aform', function() {
    //_gaq.push(['_trackEvent', 'subscribe', 'submit', 'top', 1]);
});
$(document).on('submit', '#subscribe2form', function() {
    _gaq.push(['_trackEvent', 'subscribe', 'submit', 'hero', 1]);
});
$(document).on('submit', '#subscribe4form', function() {
    _gaq.push(['_trackEvent', 'subscribe', 'submit', 'mobile', 1]);
});
$(document).on('submit', '#subscribe2AAform', function() {
    _gaq.push(['_trackEvent', 'subscribe', 'submit', 'popup', 1]);
});

$(document).on('click', '.join_nav', function() {
    _gaq.push(['_trackEvent', 'recruitment', 'click', 'join_nav', 1]);
});
$(document).on('click', '.join_home_learnmore', function() {
    _gaq.push(['_trackEvent', 'recruitment', 'click', 'join_home_learnmore', 1]);
});
$(document).on('click', '.join_university', function() {
    _gaq.push(['_trackEvent', 'recruitment', 'click', 'join_university', 1]);
});

$('.stf1').scrollToFixed({});
$(window).scroll(function() {

});
//if ($(this).scrollTop() > 0) {
//$('#commentslist').scrollToFixed({  });

$('.postrow.postslider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});

$('#showcases .sliders').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
});

$('.sliders#slider0').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
});

hash = window.location.hash;
if (hash.includes('comment')) {
    $('#opencomments').hide();
    $('#commentslist').addClass('open');
    location.href = "#";
    location.href = '#comments';
}

var scrollinited = false;
$(window).on('resize scroll', function() {
    if ($('#pagination').length) {
        if ($('#pagination').isInViewport()) {
            if (!scrollinited) {
                scrollinited = true;
                var _offset = parseInt($('#infinitescrollhere').data('offset'));
                if (_offset > 0) {
                    var _category_ = parseInt($('#infinitescrollhere').data('category'));
                    if (_category_ != 0) var _category = '&category=' + _category_;
                    else var _category = '';
                    $("#infinitescrollhere img.scrollloader").remove();
                    $("#infinitescrollhere").append('<img class="scrollloader" src="/wp-content/themes/doordashengineeringv2/i/loader.gif" alt="">');
                    $.get("/wp-content/themes/doordashengineeringv2/ajax/fetch-scroll.php?offset=" + _offset + _category).done(function(response) {
                        $("#infinitescrollhere img.scrollloader").remove();
                        var offset = _offset + 12;
                        if (!response || response == '' || response == ' ') offset = 0;
                        $("#infinitescrollhere").data('offset', offset);
                        $("#infinitescrollhere").append(response);
                        lazyload();
                        scrollinited = false;
                    });
                }
            }
        }
    }
});
$(document).on('submit', 'form.subscribeform', function(event) {
    event.preventDefault();
    if ($('#modal1').length) {
        $('#modal1').removeClass('open');
    }
    var eml = $(this).find('input[type=email]').val();
    var jqxhr = $.post("https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=6aa5580f-33ff-4ed8-b60d-b1de293db7e5", {
            email: eml
        }, function(data) {

        })
        .always(function() {
            _gaq.push(['_trackEvent', 'subscribe', 'submit', 'top', 1]);
            $("#thankyou").addClass('open');
            $.cookie('modal1', 1, {
                expires: 3650,
                path: '/'
            });
            setTimeout(function() {
                $("#thankyou").removeClass('open');
            }, 10000);
            /**/
        });
    jqxhr.always(function() {
        //alert( "second finished" );
    });
    return false;
});
$(document).on('click', function(event) {
    if ($("#thankyou.open").length) $('#thankyou').removeClass('open');
});
$(document).on('click', '.goto', function(event) {
    event.preventDefault();
    window.open($(this).data('href'));
    return false;
});
$(document).on('click', '.shareclick', function(event) {
    event.preventDefault();
    window.open($(this).data('href'));
    return false;
});
$(document).on('click', '.opensubscribe', function(event) {
    $('#subscribeform').addClass('open');
});
$(document).on('click', '#subscribe2a', function(event) {
    $('#subscribeform11a').addClass('open');
    return false;
});
$(document).on('click', '.openauthor', function(event) {
    event.preventDefault();
    var opn = '#' + $(this).data('href');
    $(opn).addClass('open');
    return false;
});
$(document).on('click', '.closethis', function(event) {
    event.preventDefault();
    $(this).parents('.open').removeClass('open');
    return false;
});
$(document).on('click', 'li.selector', function(event) {
    event.preventDefault();
    $('#menu').addClass('filtered');
    return false;
});
$(document).on('click', '#togglemenu', function(event) {
    event.preventDefault();
    $('body').toggleClass('menuopen');
    return false;
});
$(document).on('click', '#openblogmenu2', function(event) {
    event.preventDefault();
    $('#blogmenu').toggleClass('menuopen');
    return false;
});
$(document).on('click', '#opencomments', function(event) {
    event.preventDefault();
    //$('#opencomments').hide();
    $('#commentslist').addClass('open').addClass('stf2');
    return false;
});

$(document).on('click', '.comclose', function(event) {
    event.preventDefault();
    var $window = $(window);
    var $pane = $('#pane1');
    var windowsize = $window.width();
    if (windowsize > 1023) {
        $('#commentslist').trigger('detach.ScrollToFixed');
        $('#commentslist').toggleClass('open');
    } else {
        $('#commentslist').css('transition', 'all 0s').toggleClass('open').toggleClass('open2');
    }
    return false;

});
$(document).on('click', '.commentcounter', function(event) {
    event.preventDefault();
    var $window = $(window);
    var $pane = $('#pane1');
    var windowsize = $window.width();
    var topPBoffset = parseInt($(document).scrollTop());
    if (windowsize > 1023) {
        if ($("#commentslist").hasClass("open")) {
            $('#commentslist').trigger('detach.ScrollToFixed');
            $('#commentslist').removeClass('open');
        } else {
            $('#commentslist').addClass('open');
            $('#commentslist.open').scrollToFixed({
                fixed: function() {
                    if (document.documentElement.scrollTop > 395) {
                        var rbar = document.getElementById('rightbar');
                        var rbarTextRectangle = rbar.getBoundingClientRect();
                        var leftRbar = rbarTextRectangle.left - 50;
                        console.log('leftRbar ' + leftRbar);
                        setTimeout(function() {
                            $('#commentslist.open').css('left', leftRbar + 'px').css('color', 'green');
                        }, 300);
                    }
                },
                limit: $('footer').offset().top
            });
        }
    } else {
        $('#commentslist').css('transition', 'all 0s').toggleClass('open').toggleClass('open2');
    }
    return false;

});
$(document).on('click', '#mobilemenu li.menu-item-has-children > a', function(event) {
    event.preventDefault();
    $(this).parent('li.menu-item-has-children').toggleClass('opened');
});
$(document).on('click', '#showsearch', function(event) {
    event.preventDefault();
    $('#serp').addClass('open');
    return false;
});
$(document).on('click', '#hidesearch', function(event) {
    event.preventDefault();
    $('#serp').removeClass('open');
    return false;
});
$(document).on('click', '.openteam', function(event) {
    event.preventDefault();
    $('.openteam').removeClass('active');
    $(this).addClass('active');
    var teamToOpen = $(this).data('href');
    window.location.hash = teamToOpen;
    $('.container.teamtoopen').hide();
    $('.container.teamtoopen.' + teamToOpen).show();
    document.getElementById("spotlight").scrollIntoView();
    return false;
});

$(document).ready(function() {
    if (window.location.hash) {
        // Fragment exists
        var hashToCheck = window.location.hash.replace('#', '');
        console.log(hashToCheck);
        if (hashToCheck.includes('team-')) {
            if ($('.openteam.' + hashToCheck).length) {
                $('.openteam.' + hashToCheck).trigger('click');
            }
        }
        if (hashToCheck.includes('engineering-teams')) {
            if (window.location.origin == "https://doordash.engineering") {
                var elmnTo = document.getElementById("section2");
                window.scrollTo({
                    top: elmnTo.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
});


$(document).on('click', '.closeThis', function() {
    var modal = '#' + $(this).data('id');
    var cookieName = 'modal',
        cookieValue = 1,
        cookieDuration = 7;
    if ($(this).data('cookie-name')) cookieName = $(this).data('cookie-name');
    if ($(this).data('cookie-val')) cookieValue = $(this).data('cookie-val');
    if ($(this).data('cookie-duration')) cookieDuration = $(this).data('cookie-duration');
    $.cookie(cookieName, cookieValue, {
        expires: cookieDuration,
        path: '/'
    });
    $(modal).removeClass('open');
})

setTimeout(function() {
    $(document).mouseleave(function() {
        if ($('#modal1').length) {
            if (!$.cookie('modal1')) {
                $('#modal1').addClass('open');
                _gaq.push(['_trackEvent', 'popup', 'subscribe', 'open', 1]);
            }
        }
    });
}, 120000);

/* FUNCTIONS */
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};


if ($(".nano").length) $(".nano").nanoScroller();

let imagesLL = document.querySelectorAll(".lazyload");
new LazyLoad(imagesLL);

/*! Lazy Load 2.0.0-rc.2 - MIT license - Copyright 2007-2019 Mika Tuupola */
! function(t, e) {
    "object" == typeof exports ? module.exports = e(t) : "function" == typeof define && define.amd ? define([], e) : t.LazyLoad = e(t)
}("undefined" != typeof global ? global : this.window || this.global, function(t) {
    "use strict";

    function e(t, e) {
        this.settings = s(r, e || {}), this.images = t || document.querySelectorAll(this.settings.selector), this.observer = null, this.init()
    }
    "function" == typeof define && define.amd && (t = window);
    const r = {
            src: "data-src",
            srcset: "data-srcset",
            selector: ".lazyload",
            root: null,
            rootMargin: "0px",
            threshold: 0
        },
        s = function() {
            let t = {},
                e = !1,
                r = 0,
                o = arguments.length;
            "[object Boolean]" === Object.prototype.toString.call(arguments[0]) && (e = arguments[0], r++);
            for (; r < o; r++) ! function(r) {
                for (let o in r) Object.prototype.hasOwnProperty.call(r, o) && (e && "[object Object]" === Object.prototype.toString.call(r[o]) ? t[o] = s(!0, t[o], r[o]) : t[o] = r[o])
            }(arguments[r]);
            return t
        };
    if (e.prototype = {
            init: function() {
                if (!t.IntersectionObserver) return void this.loadImages();
                let e = this,
                    r = {
                        root: this.settings.root,
                        rootMargin: this.settings.rootMargin,
                        threshold: [this.settings.threshold]
                    };
                this.observer = new IntersectionObserver(function(t) {
                    Array.prototype.forEach.call(t, function(t) {
                        if (t.isIntersecting) {
                            e.observer.unobserve(t.target);
                            let r = t.target.getAttribute(e.settings.src),
                                s = t.target.getAttribute(e.settings.srcset);
                            "img" === t.target.tagName.toLowerCase() ? (r && (t.target.src = r), s && (t.target.srcset = s)) : t.target.style.backgroundImage = "url(" + r + ")"
                        }
                    })
                }, r), Array.prototype.forEach.call(this.images, function(t) {
                    e.observer.observe(t)
                })
            },
            loadAndDestroy: function() {
                this.settings && (this.loadImages(), this.destroy())
            },
            loadImages: function() {
                if (!this.settings) return;
                let t = this;
                Array.prototype.forEach.call(this.images, function(e) {
                    let r = e.getAttribute(t.settings.src),
                        s = e.getAttribute(t.settings.srcset);
                    "img" === e.tagName.toLowerCase() ? (r && (e.src = r), s && (e.srcset = s)) : e.style.backgroundImage = "url('" + r + "')"
                })
            },
            destroy: function() {
                this.settings && (this.observer.disconnect(), this.settings = null)
            }
        }, t.lazyload = function(t, r) {
            return new e(t, r)
        }, t.jQuery) {
        const r = t.jQuery;
        r.fn.lazyload = function(t) {
            return t = t || {}, t.attribute = t.attribute || "data-src", new e(r.makeArray(this), t), this
        }
    }
    return e
});
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    var n = /\+/g;

    function o(e) {
        return t.raw ? e : encodeURIComponent(e)
    }

    function i(e) {
        return o(t.json ? JSON.stringify(e) : String(e))
    }

    function r(o, i) {
        var r = t.raw ? o : function(e) {
            0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
            try {
                return e = decodeURIComponent(e.replace(n, " ")), t.json ? JSON.parse(e) : e
            } catch (e) {}
        }(o);
        return e.isFunction(i) ? i(r) : r
    }
    var t = e.cookie = function(n, c, u) {
        if (arguments.length > 1 && !e.isFunction(c)) {
            if ("number" == typeof(u = e.extend({}, t.defaults, u)).expires) {
                var s = u.expires,
                    a = u.expires = new Date;
                a.setMilliseconds(a.getMilliseconds() + 864e5 * s)
            }
            return document.cookie = [o(n), "=", i(c), u.expires ? "; expires=" + u.expires.toUTCString() : "", u.path ? "; path=" + u.path : "", u.domain ? "; domain=" + u.domain : "", u.secure ? "; secure" : ""].join("")
        }
        for (var d, f = n ? void 0 : {}, p = document.cookie ? document.cookie.split("; ") : [], l = 0, m = p.length; l < m; l++) {
            var x = p[l].split("="),
                g = (d = x.shift(), t.raw ? d : decodeURIComponent(d)),
                v = x.join("=");
            if (n === g) {
                f = r(v, c);
                break
            }
            n || void 0 === (v = r(v)) || (f[g] = v)
        }
        return f
    };
    t.defaults = {}, e.removeCookie = function(n, o) {
        return e.cookie(n, "", e.extend({}, o, {
            expires: -1
        })), !e.cookie(n)
    }
});