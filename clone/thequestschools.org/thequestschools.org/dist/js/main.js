$(document).ready(function() {

    showMenu();
    fixedMeni();

    jQuery('.card-btn').click(function() {
        var card = jQuery(this).closest('.accord-card');
        jQuery('.accord-card').not(card).removeClass('active');
        card.closest('.accord-card').toggleClass('active');
        jQuery('.accord-card').not(card).find('.card-box').slideUp();
        card.find('.card-box').slideToggle();
    });

    $('.phone-menu').click(function() {
        $(this).toggleClass("change");
        $('header').toggleClass('active');
        $('.header-items').slideToggle();
    });

    var windowW = jQuery(window).innerWidth();
    if (windowW < 992) {
        $(document).mouseup(function(e) {
            var container = $(".nav-holder");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $('.header-items').slideUp();
                $('header').removeClass('active');
                $('.phone-menu').removeClass("change");
            }
        });
    }

    if ($('.team-slider').width() > 1) {
        $('.team-slider').slick({
            infinite: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
            responsive: [{
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
    }

    if ($('.timeline-slider').width() > 1) {
        $('.timeline-slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            responsive: [{
                    breakpoint: 1399,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }

    if (jQuery('#intelligentsia').width() > 1) {
        jQuery('#fullpage1').fullpage({
            //options here
            licenseKey: 'N0K7J-4TEMI-VS3KK-J284H-UTDVO',
            waterEffectKey: 'Q3hkR2hsY1hWbGMzUnpZMmh2YjJ4ekxtOXladz09WWZfcnhuZDJGMFpYSkZabVpsWTNRPU9uUQ==',
            autoScrolling: true,
            scrollHorizontally: false,
            scrollOverflow: true,
            scrollOverflowMacStyle: true,
            responsiveWidth: 991,
            responsiveHeight: 767,
            waterEffect: true,
            //    speed: 300,
            anchors: ['hero', 'engagement', 'assessment', 'development', 'management', 'join'],
            menu: '#sideMenu',
            credits: false,
            afterLoad: function(origin, destination, direction) {
                var loadedSection = this;
                if (destination.anchor == 'engagement' || destination.anchor == 'assessment' || destination.anchor == 'development' || destination.anchor == 'management' || destination.anchor == 'join') {
                    jQuery('header').addClass('scrolled');
                } else {
                    jQuery('header').removeClass('scrolled');
                }
            }
        });
        fullpage_api.waterEffect.setOption('speed', 350);
    }
    if (jQuery('#insights').width() > 1) {
        jQuery('#fullpage2').fullpage({
            //options here
            licenseKey: 'N0K7J-4TEMI-VS3KK-J284H-UTDVO',
            waterEffectKey: 'Q3hkR2hsY1hWbGMzUnpZMmh2YjJ4ekxtOXladz09WWZfcnhuZDJGMFpYSkZabVpsWTNRPU9uUQ==',
            autoScrolling: true,
            scrollHorizontally: false,
            scrollOverflow: true,
            scrollOverflowMacStyle: true,
            responsiveWidth: 991,
            responsiveHeight: 767,
            waterEffect: true,
            anchors: ['hero', 'mission', 'vision', 'philosophy', 'move'],
            menu: '#sideMenu',
            credits: false,
            afterLoad: function(origin, destination, direction) {
                var loadedSection = this;
                if (destination.anchor == 'mission' || destination.anchor == 'vision' || destination.anchor == 'philosophy' || destination.anchor == 'move') {
                    jQuery('header').addClass('scrolled');
                } else {
                    jQuery('header').removeClass('scrolled');
                }
            }
        });
        fullpage_api.waterEffect.setOption('speed', 350);
    }
    if (jQuery('#initiatives').width() > 1) {
        jQuery('#fullpage3').fullpage({
            //options here
            licenseKey: 'N0K7J-4TEMI-VS3KK-J284H-UTDVO',
            waterEffectKey: 'Q3hkR2hsY1hWbGMzUnpZMmh2YjJ4ekxtOXladz09WWZfcnhuZDJGMFpYSkZabVpsWTNRPU9uUQ==',
            autoScrolling: true,
            scrollHorizontally: false,
            scrollOverflow: true,
            scrollOverflowMacStyle: true,
            responsiveWidth: 991,
            responsiveHeight: 767,
            waterEffect: true,
            anchors: ['hero', 'timeline', 'academy', 'college', 'institute', 'programs', 'scholarship'],
            menu: '#sideMenu',
            credits: false,
            afterLoad: function(origin, destination, direction) {
                var loadedSection = this;
                if (destination.anchor == 'timeline' || destination.anchor == 'academy' || destination.anchor == 'college' || destination.anchor == 'institute' || destination.anchor == 'programs' || destination.anchor == 'scholarship') {
                    jQuery('header').addClass('scrolled');
                } else {
                    jQuery('header').removeClass('scrolled');
                }
            }
        });
        fullpage_api.waterEffect.setOption('speed', 350);
    }

});

jQuery(window).resize(function() {
    showMenu();
    fixedMeni();
    jQuery('header').removeClass('active');
    jQuery(".phone-menu").removeClass('change');
});

function showMenu() {
    var windowWidth = jQuery(window).innerWidth();
    if (windowWidth < 1199) {
        jQuery('.phone-menu').show();
        jQuery('.header-items').hide();
        jQuery('.primary-menu li a').click(function() {
            jQuery('header').removeClass('active');
            jQuery(".phone-menu").removeClass('change');
            jQuery('.header-items').slideUp();
        });
    } else {
        jQuery('.phone-menu').hide();
        jQuery('.header-items').show();
    }
};

function fixedMeni() {
    var windowWidth = jQuery(window).innerWidth();
    if (windowWidth > 111) {
        jQuery(window).on('load scroll resize orientationchange', function() {
            if (jQuery(document).scrollTop() > 1) {
                jQuery("header").addClass('scrolled');
            } else {
                jQuery("header").removeClass('scrolled');
            }
        });
    } else {
        jQuery(window).on('load scroll resize orientationchange', function() {
            jQuery("header").removeClass('scrolled');
        });
    }
};