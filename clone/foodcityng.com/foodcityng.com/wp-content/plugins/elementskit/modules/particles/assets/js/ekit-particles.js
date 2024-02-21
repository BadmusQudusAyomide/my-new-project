! function(e, t) {
    "use strict";
    e(window).on("elementor/frontend/init", (function() {
        t.hooks.addAction("frontend/element_ready/global", (function(e) {
            let i = e.data("ekit-particles-type"),
                s = e.data("ekit-particles"),
                a = e.data("ekit-particles-enable"),
                l = `ekit-particles-wrapper-${e.data("id")}`;

            function r() {
                e.append(`<div class='ekit-particles-wrapper' id='${l}'></div>`)
            }
            t.isEditMode() && (s = t.config.elements.data[e.data("model-cid")] ? .attributes, "yes" == s ? .ekit_particles_enable && (e.addClass("ekit-particles"), r(), "file" == s.ekit_particles_options && s.ekit_particles_file.url ? (i = "file", s = s.ekit_particles_file.url) : "json" == s.ekit_particles_options && "" != s.ekit_particles_json ? (i = "json", s = JSON.parse(s.ekit_particles_json)) : "preset" == s.ekit_particles_options && (i = "preset", s = s.ekit_particles_json_url && s.ekit_particles_json_url + s.ekit_particles_preset + ".json"))), "yes" == a && r(), "json" == i ? particlesJS(l, s) : "file" != i && "preset" != i || particlesJS.load(l, s)
        }))
    }))
}(jQuery, window.elementorFrontend);