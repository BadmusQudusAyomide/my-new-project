! function(n, t) {
    "use strict";
    n("[data-wrapper-link]").on("click", (function(t) {
        let e = n(this).data("wrapper-link"),
            r = e.url.match(/(https?:\/\/)/) ? e.url : "https://" + e.url;
        r && (e.is_external ? window.open(r, "_blank") : window.open(r, "_self"))
    }))
}(jQuery, window.elementorFrontend);