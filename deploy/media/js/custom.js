(function ($, window, document) {
    'use strict';
    var pluginName = "Aisconverse",
        defaults = {
            sliderFx: 'crossfade',		// Slider effect. Can be 'scroll',
            // 'fade', 'crossfade', 'directscroll',
            // 'uncover', 'uncover-fade'
            sliderInterval: 6000,		// Interval
            sliderAuto: false,        // Default auto sliding
            speedAnimation: 600,        // Default speed of the animation
            defFx: 'easeInSine',        // Default animate Fx
            countdownTo: '2015/06/20',	// Change this in the format: 'YYYY/MM/DD'
            scrollTopButtonOffset: 500, // when scrollTop Button will show
            flickrId: '36587311@N08', // Flickr Accound ID
            instagrammId: 26191560, // Instagramm Accound ID
            successText: 'You have successfully subscribed', // text after successful subscribing
            errorText: 'Please, enter a valid email' // text, if email is invalid
        },
        $win = $(window),
        $html = $('html'),
        $htmlBody = $('html, body'),
        onMobile = false;

    // The plugin constructor
    function Plugin(element, options) {
        var that = this;
        that.element = $(element);
        that.options = $.extend({}, defaults, options);

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            onMobile = true;
            $(document.body).addClass('mobile');
        } else {
            $(document.body).addClass('no-mobile');
        }

        that.init();
        $win.appear();

        $win.load(function () {
            that.preloader.delay(defaults.speedAnimation * 1.5)
                .fadeOut(defaults.speedAnimation / 2);

            that.activate();

        }).scroll(function () {
            that.scrll();
        }).resize(function(){
            that.vswitcher();
        }).afterResize(function () {
            that.rez();
            that.fSize();
        }, false, 200);
    }

    Plugin.prototype = {
        init: function () {
            this.body = $(document.body);
            this.preloader = $('.preloader');
            this.wrapper = $('.wrapper');
            this.vmenu = $('.vertical-menu');
            this.header = $('.header');
            this.slider = $('.slider');
            this.fullpage = $('.fullpage');
            this.fullscreen = $('.fullscreen');
            this.vmiddle = $('.middle');
            this.gallery = $('.gallery');
            this.internalLinks = $('.internal');
            this.audio = $('audio');
            this.chart = $('.chart');
            this.select = $('select');
            this.scrTop = $('.scrolltop');
            this.timer = $('.countdown');
            this.expandLink = $('.expand-link');
            this.collapseLink = $('.collapse-link');
            this.counting = $('.counting');
            this.map = $('.google-map');
            this.modal = $('.modal');
            this.magnific = $('.magnific');
            this.magnificWrap = $('.magnific-wrap');
            this.magnificGallery = $('.magnific-gallery');
            this.magnificVideo = $('.magnific-video');
            this.masonryWrap = $('.masonry-wrap');
            this.addCart = $('.add-cart');
            this.jslider = $('.jslider');
            this.rating = $('.raty');
            this.quantity = $('.product-quantity');
            this.remove = $('.remove');
            this.productRemove = $('.product-remove');
            this.navCategory = $('.nav-category');
            this.countup = $('.countup');
            this.mixList = $('.mix-list');
            this.tabLink = $('.tab-link');
            this.faq = $('.faq');
            this.faqBody = this.faq.find('.panel-body');
            this.anim = $('.animate');
            this.appearwrap = $('.appear-wrap');
            this.loadmore = $('.load-more');
            this.loadmixmore = $('.load-mix-more');
            this.filterList = $('.filter-list');
            this.isotopeList = $('.isotope-list');
            this.modalLink = $('[data-toggle=modal]');
            this.instafeed = $('#instafeed');
            this.flickrfeed = $('#flickrfeed');
            this.feedbackForm = $('#feedback-form');
            this.newsletter = this.feedbackForm.find('form');
            this.navbar = $('.navbar');
            this.vSide = $('.vside');
            this.sidemenuToggle = $('.sidemenu-toggle');
        },
        activate: function () {
            var instance = this,
                spd = instance.options.speedAnimation;

            if (instance.body.hasClass('error404')){
                $html.addClass('html404');
            }

            if (instance.audio.length > 0){
                instance.audio.mediaelementplayer();
            }

            instance.vswitcher();

            instance.vSide.on('click', function () {
                var self = $(this),
                    winWidth = $win.width();

                instance.header.toggleClass('vhidden showtoggle');
                self.toggleClass('active');

                if (winWidth > 1160) {
                    instance.rez();
                    instance.sliders();
                }
            });

            // Modal shift, bug for fixed header, when modal is open
            instance.modalLink.on('click', function() {
                var self = $(this),
                    url = self.attr('href');

                instance.header.css('paddingRight', instance.scrollbarWidth());
                instance.header.filter('.header-float').css('left', -instance.scrollbarWidth());

                if ($(url).find(instance.slider).length > 0){
                    setTimeout(function () {
                        instance.sliders();

                        var h = $(url).find('.modal-dialog').outerHeight(),
                            wh = $win.height();

                        $(url).delay(spd / 2).animate({'opacity': 1}, spd / 2, instance.options.defFx);

                        if (h <= wh) {
                            $(url).find('.modal-dialog').css({
                                'margin-top': function () {
                                    return -($(this).outerHeight() / 2);
                                },
                                'top': '50%'
                            });
                        } else {
                            $(url).find('.modal-dialog').css({
                                'margin-top': 30 + 'px',
                                'top': 0
                            });
                        }
                    }, 200);
                }
            });

            instance.modal.on('hide.bs.modal', function () {
                instance.header.css({'paddingRight': 0, 'left': 0});

                if ($(this).find(instance.slider).length > 0){
                    $(this).css('opacity', 0);
                }
            });

            if (!onMobile){
                setTimeout(function () {
                    $.stellar({
                        horizontalScrolling: false
                    });
                }, spd);
            }

            if(instance.anim.length > 0) {
                instance.anim.on('appear', function () {
                    var t = $(this),
                        fx = t.data('animate');

                    t.parent().css('position', 'relative');
                    t.addClass('animated ' + fx);
                }).appear();

                instance.anim.on('click', function(e){
                    var self = $(this),
                        ani = self.data('animate');

                    if (self.hasClass('animate-toggle')){
                        e.preventDefault();
                        self.removeClass('animated').removeClass(ani);
                    }

                    setTimeout(function () {
                        self.addClass('animated').addClass(ani);
                    }, spd / 2);
                });
            }

            if (instance.appearwrap.length > 0){
                instance.appearwrap.find('[class*=col-]').on('appear', function () {
                    var self = $(this);

                    self.animate({'opacity': 1}, spd, instance.options.defFx, function () {
                        $(this).addClass('appeared');
                    });
                }).appear();
            }

            instance.internalLinks.on('click', function(e){
                e.preventDefault();
                var $this = $(this),
                    url = $this.attr('href').replace('#', ''),
                    $url = $('#' + url),
                    hh = instance.header.outerHeight(true) - 2,
                    urlTop;

                if ($url.length){
                    urlTop = $url.offset().top - hh;
                } else {
                    urlTop = $('[name="'+ url +'"]').offset().top;
                }

                $htmlBody.stop(true, true).animate({ scrollTop: urlTop }, spd, instance.options.defFx);
            });

            // Custom Select
            if (instance.select.length > 0){
                instance.select.chosen({width: '100%'});
            }

            // Custom input[type=range]
            if (instance.jslider.length > 0 && instance.jslider.is(':visible')) {
                instance.jslider.slider({
                    from: 0,
                    to: 1000,
                    step: 1,
                    limits: false,
                    scale: [0, 1000],
                    dimension: "$&nbsp;"
                });
            }

            $('.dropdown-menu.sub-menu > li.dropdown > a').on('click', function (e) {
                var self = $(this),
                    current= self.next(),
                    grandparent= self.parent().parent();

                grandparent.find(".sub-menu:visible").not(current).hide();
                current.toggle();

                e.stopPropagation();
                e.preventDefault();
            });

            $('.dropdown-menu:not(.sub-menu) > li > a').on('click', function () {
                var root = $(this).closest('.dropdown');

                root.find('.sub-menu:visible').hide();
            });

            $('[data-toggle="collapse"]').on('click', function () {
                var trgt = $(this).data('target');
                if ($(trgt).find(instance.jslider).length > 0) {
                    setTimeout(function() {
                        instance.jslider.slider({
                            from: 0,
                            to: 1000,
                            step: 1,
                            limits: false,
                            scale: [0, 1000],
                            dimension: "$&nbsp;"
                        });
                    }, 0);
                }
            });

            instance.tabLink.on('click', function (e) {
                e.preventDefault();
                var $this = $(this),
                    hrf = $this.attr("href"),
                    top = $(hrf).parent().offset().top - 50;

                $this.tab('show');
                $('.nav li').removeClass('active');

                setTimeout(function() {
                    $('.nav li a[href="' + $this.attr("href") + '"]').parent().addClass('active');
                }, 300);

                $htmlBody.animate({scrollTop: top - 50}, spd / 2, instance.options.defFx);
            });

            instance.addCart.on('click', function(e){
                e.preventDefault();

                var $this = $(this);

                $this.addClass('btn-activated');

                setTimeout(function () {
                    $this.removeClass('btn-activated');
                }, spd);
            });

            // Product Incrementers
            instance.quantity.find('a').on('click', function(e) {
                e.preventDefault();

                var el = $(this),
                    inpt = el.parent().find('input'),
                    oldValue = inpt.val(),
                    newVal;

                if (el.hasClass('plus')) {
                    newVal = parseFloat(oldValue) + 1;
                } else if (el.hasClass('minus')) {
                    newVal = (oldValue > 1) ? parseFloat(oldValue) - 1 : 1;
                }

                inpt.val(newVal);
            });

            instance.productRemove.find('a').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);

                $this.parents('tr').fadeOut(spd, function () {
                    $(this).remove();
                });
            });

            // scrollTop function
            instance.scrTop.on('click', function (e) {
                e.preventDefault();
                $('html, body').stop(true,true).animate({ scrollTop: 0 }, spd, instance.options.defFx);
            });

            if (instance.navCategory.length > 0){
                var hsh = window.location.hash.replace('#','.'),
                    hshArray = [];

                instance.navCategory.find('a').each(function () {
                    var self = $(this),
                        atr = self.attr('href').replace('#','.');

                    hshArray.push(atr);
                });

                if (hsh == '.all' || hshArray.indexOf(hsh) < 0) {
                    hsh = '*';
                }

                if (instance.mixList.length > 0){
                    instance.mixList.mixItUp({
                        load: {
                            filter: hsh !== '' ? hsh : '*'
                        }
                    });
                }

                if (instance.filterList.length > 0) {
                    if ($(hsh).length === 0) {
                        instance.mixList.find('.mix').removeClass('inactive');
                    } else {
                        instance.mixList.find('.mix').addClass('inactive');
                        $(hsh).removeClass('inactive');
                    }
                }

                $(document).on('click', '.nav-category li a', function (e) {
                    var self = $(this),
                        fltr = self.data('filter');

                    e.preventDefault();

                    self.addClass('active').parent()
                        .siblings().find('a').removeClass('active');

                    if (instance.filterList.length > 0) {
                        if ($(fltr).length === 0) {
                            instance.mixList.find('.mix').removeClass('inactive');
                        } else {
                            instance.mixList.find('.mix').addClass('inactive');
                            $(fltr).removeClass('inactive');
                        }
                    }

                    if(instance.mixList.find(instance.slider).length > 0){
                        setTimeout(function () {
                            instance.sliders('.fig.slider');
                        }, spd / 2);
                    }

                    if (instance.isotopeList.length > 0){
                        instance.isotopeList.isotope({ filter: fltr });
                    }

                });

                $(document).on('click', '.mix.inactive', function (e) {
                    e.preventDefault();
                });
            }

            instance.loadmixmore.on('click', function(e) {
                e.preventDefault();
                var self = $(this),
                    path = self.attr('href');

                instance.mixList.find('ul:first').append('<span class="next-posts"/>');

                $('.next-posts:last').load(path, function() {
                    var $mix = $('.mix');

                    instance.mixList
                        .mixItUp('destroy')
                        .mixItUp({
                            load: {
                                filter: hsh !== '' ? hsh : '*'
                            }
                        });

                    self.parent().fadeOut();

                    if ($mix.parent().is(".next-posts")) {
                        $mix.unwrap();
                    }

                    if(instance.mixList.find(instance.slider).length > 0){
                        setTimeout(function () {
                            instance.sliders('.fig.slider');
                        }, spd / 2);
                    }
                });
            });

            instance.loadmore.on('click', function(e) {
                e.preventDefault();
                var self = $(this),
                    path = self.attr('href'),
                    addmsnry;

                instance.masonryWrap.append('<div class="next-posts">');

                $('.next-posts:last').load(path, function() {

                    var that = $(this);

                    setTimeout(function() {
                        addmsnry = new Masonry(instance.masonryWrap[0], {
                            itemSelector: '.msnr'
                        });
                    }, 100);

                    self.attr('href', 'masonry_2.html');

                    if (path === 'masonry_2.html'){
                        self.parent().hide();
                    }

                    that.animate({'opacity': 1}, spd);

                    if (that.find('audio').length > 0) {
                        that.find('audio').mediaelementplayer({
                            audioWidth: '100%'
                        });
                    }

                    if (that.find('.slider').length > 0) {
                        setTimeout(function () {
                            instance.sliders();
                        }, spd / 2);
                    }

                });
            });

            instance.faqNav();
            instance.isotopeMix();
            instance.masonryMix();
            instance.instagramm();
            instance.flickr();
            instance.countDown();
            instance.ratings();
            instance.contactMap();
            instance.chars();
            instance.magnificPopup();
            instance.sendForm();
            instance.feedForm();

            setTimeout(function () {
                instance.scrll();
                instance.fSize();
                instance.sliders();
                instance.fMiddle();
                instance.rez();
            }, 320);
            instance.sliders('.fig.slider');
        },
        masonryMix: function () {
            var instance = this;

            if (instance.masonryWrap.length > 0){
                instance.masonryWrap.each(function () {
                    var posts = $(this)[0],
                        msnry;

                    setTimeout(function () {
                        msnry = new Masonry(posts, {
                            itemSelector: '.msnr'
                        });
                    }, instance.options.speedAnimation);
                });
            }
        },
        isotopeMix: function () {
            var instance = this;

            if (instance.isotopeList.length > 0){
                var isohsh = window.location.hash !== '' ? window.location.hash : '#all';

                instance.navCategory.find('a').removeClass('active');
                instance.navCategory.find('a[href='+isohsh+']').addClass('active');

                isohsh = isohsh == '#all' ? '*' : isohsh.replace('#','.');

                setTimeout(function() {
                    instance.isotopeList.isotope({
                        itemSelector: '.msnr',
                        layoutMode: 'masonry',
                        filter: isohsh
                    });
                }, instance.options.speedAnimation);
            }
        },
        faqNav: function () {
            var instance = this;

            if (instance.faqBody.length > 0) {
                instance.faqBody.collapse({toggle: false});
            }

            instance.expandLink.on('click', function(e){
                e.preventDefault();
                instance.faqBody.collapse('show');
                instance.faq.find('[data-toggle]').removeClass('collapsed');
            });

            instance.collapseLink.on('click', function(e){
                e.preventDefault();
                instance.faqBody.collapse({toggle: false});
                instance.faqBody.collapse('hide');
                instance.faq.find('[data-toggle]').addClass('collapsed');
            });
        },
        sliders: function(sliderContent){
            var instance = this;

            if (sliderContent === '' || sliderContent === null || sliderContent === undefined){
                sliderContent = '.slider';
            }

            sliderContent = $(sliderContent);

            if (instance.slider.length > 0){
                sliderContent.each(function(e){
                    var $this = $(this),
                        slidewrap = $this.find('ul:first'),
                        sliderFx = slidewrap.data('fx'),
                        sliderAuto = slidewrap.data('auto'),
                        sliderTimeout = slidewrap.data('timeout'),
                        sliderSpeedAnimation = slidewrap.data('speed-animation'),
                        sliderCircular = slidewrap.data('circular'),
                        sliderOrient = ($this.hasClass('vertical') && instance.body.hasClass('fullpage')) ? true : false,
                        sliderPrefix = '#slider-',
                        sliderWidth = ($this.hasClass('mix-list')) ? '100%' : 'auto',
                        sliderDirection = ($this.hasClass('vertical')) ? 'up' : 'left',
                        sliderItems = (!$this.hasClass('oneslider')) ?
                        {
                            height: 'variable',
                            visible : {
                                min : 1,
                                max : 12
                            }
                        } :
                        {
                            visible     : 1,
                            width       : 870,
                            height      : ($this.hasClass('vertical')) ? 700 : 'variable'
                        };

                    $this.attr('id', 'slider-'+e);

                    slidewrap.carouFredSel({
                        direction: sliderDirection,
                        responsive: true,
                        width: sliderWidth,
                        infinite: (typeof sliderCircular) ? sliderCircular : true,
                        circular: (typeof sliderCircular) ? sliderCircular : true,
                        auto : sliderAuto ? sliderAuto : instance.options.sliderAuto,
                        scroll : {
                            fx : sliderFx ? sliderFx : instance.options.sliderFx,
                            duration : sliderSpeedAnimation ? sliderSpeedAnimation : instance.options.speedAnimation,
                            timeoutDuration : sliderTimeout ? sliderTimeout : instance.options.sliderInterval,
                            items: 'page',
                            onBefore: function(data) {
                                var self = $(this),
                                    classes = self.find('li:first').attr('class'),
                                    oldItems = $(data.items.old),
                                    visItem = $(data.items.visible),
                                    oldAnimate = oldItems.find('.animate');

                                if (!onMobile){
                                    if (visItem.find('video').length > 0){
                                        visItem.find('video').get(0).play();
                                    }
                                }

                                if ($this.hasClass('img-medium')) {
                                    $(this).trigger("currentPosition", function (pos) {
                                        var txt = Math.ceil((pos + 1)) + " &#47; " + $(this).children().length;
                                        $('.product-count').html(txt);
                                    });
                                }
                                if (oldAnimate.length > 0 && !$this.parents('.slider').hasClass('vertical')){
                                    self.parent().removeClass().addClass('caroufredsel_wrapper ' + classes);

                                    self.parent().find('ul:last .animated').removeClass('animated');

                                    setTimeout(function () {
                                        oldAnimate.each(function () {
                                            var self = $(this),
                                                animateFx = self.data('animate');
                                            self.removeClass(animateFx).removeClass('animated');
                                        });
                                    }, instance.options.speedAnimation);
                                }
                            },
                            onAfter: function(data) {
                                var that = $(this),
                                    visItem = $(data.items.visible),
                                    visAnimate = visItem.find('.animate');

                                if ($this.find('.nav-rounded').length > 0){
                                    $this.find('.nav-rounded.prev span').text($this.find('li:last-child').data('title'));
                                    $this.find('.nav-rounded.next span').text($this.find('li:nth-child(2)').data('title'));
                                }
                                if (visAnimate.length > 0){
                                    that.parent().removeClass().addClass('caroufredsel_wrapper');

                                    visAnimate.each(function () {
                                        var self = $(this),
                                            animateFx = self.data('animate');
                                        self.addClass(animateFx).addClass('animated');
                                    });
                                }
                            }
                        },
                        onCreate: function(data){
                            var visItem = $(data.items);

                            if (!onMobile){
                                if (visItem.find('video').length > 0){
                                    visItem.find('video').get(0).play();
                                }
                            }

                            if ($this.find('.nav-rounded').length > 0){
                                $this.find('.nav-rounded.prev span').text($this.find('li:last-child').data('title'));
                                $this.find('.nav-rounded.next span').text($this.find('li:nth-child(2)').data('title'));
                            }

                            if ($this.hasClass('img-medium')) {
                                $(this).trigger("currentPosition", function() {
                                    var txt = "1 &#47; " + $(this).children().length;
                                    $('.product-count').html(txt);
                                });
                            }
                        },
                        items: sliderItems,
                        swipe : {
                            onTouch : true,
                            onMouse : false
                        },
                        prev : $(sliderPrefix + e + ' .prev'),
                        next : $(sliderPrefix + e + ' .next'),
                        pagination : {
                            container: $(sliderPrefix + e + ' > .nav-pages'),
                            anchorBuilder: function () {
                                if ($(this).parents(instance.slider.hasClass('pricing'))) {
                                    var per = $(this).data('period');
                                    return '<a href="#">' + per + '</a>';
                                }
                            }
                        },
                        mousewheel: sliderOrient
                    }).parent().css('margin', 'auto');

                    var navHover = false;
                    $('.nav-rounded').hover(function () {
                        $(this).width($(this).find('span').width() + 120);
                        navHover = true;
                    }, function () {
                        $(this).width(77);
                        navHover = false;
                    }).click(function () {
                        var $this = $(this);
                        setTimeout(function () {
                            if (navHover === true) {
                                $this.width($this.find('span').width() + 120);
                            }
                        }, instance.options.speedAnimation+20);
                    });

                    if ($this.hasClass('vertical')) {
                        $this.find('.nav-pages').css('marginTop', -$this.find('.nav-pages').height() / 2);
                    }

                    if ($this.hasClass('msnr-container')) {
                        setTimeout(function () {
                            $this.filter('.msnr-container').find('.caroufredsel_wrapper')
                                .height($this.filter('.msnr-container').find('li:first').height());
                        }, 100);
                    }
                });
            }
        },
        fMiddle: function () {
            this.vmiddle.each(function () {
                var $this = $(this);
                if ( !$this.prev().length ){
                    $this.css({
                        'marginTop' : ($this.parent().outerHeight() - $this.outerHeight())/2
                    });
                } else{
                    $this.css({
                        'marginTop' : ($this.parent().height() - $this.height())/2 - $this.prev().css('paddingTop').replace('px','')
                    });
                }

            });
        },
        fSize: function() {
            var instance = this,
                winHeight = $win.height(),
                winWidth = $win.width(),
                hh = (instance.body.hasClass('vertical-menu')) ? 0 : instance.header.outerHeight(true);

            if ((!instance.wrapper.hasClass('no-margin') || (winWidth <= 991))) {
                instance.fullscreen.height($win.height() - hh);
                instance.fullscreen.find('.caroufredsel_wrapper, ul, ul > li').height($win.height() - hh);
            } else {
                instance.fullscreen.height($win.height());
                instance.fullscreen.find('.caroufredsel_wrapper, ul, ul > li').height($win.height());
            }

            if (instance.modal.length > 0) {
                instance.modal.height(winHeight);
            }

            instance.megaMenu();
            instance.fMiddle();
        },
        megaMenu: function () {
            var instance = this,
                winWidth = $win.width();

            if (!instance.body.hasClass('vertical-menu')) {
                if (winWidth <= 991) {
                    instance.header.removeClass('navbar-fixed-top');
                    if (instance.navbar.length > 0) {
                        instance.navbar.superfish('destroy');
                        instance.navbar.find('.dropdown-menu').css('opacity', 1);
                    }
                } else {
                    if (!instance.header.hasClass('no-sticky')) {
                        instance.header.addClass('navbar-fixed-top');
                    }

                    if (instance.navbar.length > 0) {
                        instance.navbar.superfish({
                            delay: 150,
                            speed: 100,
                            onShow: function () {
                                var self = this,
                                    wh = $win.height(),
                                    wst = $win.scrollTop(),
                                    ht = self.offset().top,
                                    h = self.outerHeight(true);

                                if ((wh - ht) < (h - wst) && !self.prev().hasClass('dropdown-toggle')) {
                                    self.css({'height': (wh - ht + wst), 'overflow-y': 'auto'});
                                }
                                self.css('opacity', 1);
                            },
                            onHide: function () {
                                this.css({
                                    'height': 'auto',
                                    'opacity': 0,
                                    'overflow-y': 'visible'
                                });
                                this.find('.dropdown-menu').css({
                                    'height': 'auto',
                                    'opacity': 0,
                                    'overflow-y': 'visible'
                                });
                            }
                        });
                    }
                }
            } else {
                if (winWidth <= 767) {
                    if (instance.navbar.length > 0) {
                        instance.navbar.superfish('destroy');
                        instance.navbar.find('.dropdown-menu').css('opacity', 1);
                    }
                } else {
                    instance.navbar.superfish({
                        delay: instance.options.speedAnimation / 2,
                        speed: instance.options.speedAnimation / 2,
                        animation: {
                            opacity: "show"
                        },
                        animationOut: {
                            opacity: "hide"
                        },
                        onShow: function () {
                            var self = this,
                                wh = $win.height(),
                                wst = $win.scrollTop(),
                                ht = self.offset().top,
                                h = self.outerHeight(true);

                            if ((wh - ht) < (h - wst) && !self.prev().hasClass('dropdown-toggle')) {
                                self.css({'height': (wh - ht + wst), 'overflow-y': 'auto'});
                            }
                            self.css('opacity', 1);
                        },
                        onHide: function () {
                            this.css({
                                'height': 'auto',
                                'opacity': 0,
                                'overflow-y': 'visible'
                            });
                            this.find('.dropdown-menu').css({
                                'height': 'auto',
                                'opacity': 0,
                                'overflow-y': 'visible'
                            });
                        }
                    });
                }
            }
        },
        ratings: function () {
            var instance = this;

            if (instance.rating.length > 0){
                instance.rating.raty({
                    half: true,
                    starType: 'i',
                    readOnly   : function() {
                        return $(this).data('readonly');
                    },
                    score: function() {
                        return $(this).data('score');
                    },
                    starOff: 'fa fa-star-o',
                    starOn: 'fa fa-star',
                    starHalf: 'fa fa-star-half-o'
                });
            }
        },
        instagramm: function () {
            var instance = this;

            if (instance.instafeed.length){
                var userFeed = new Instafeed({
                    get: 'user',
                    userId: instance.options.instagrammId,
                    limit: 6,
                    accessToken: '339241463.5d9f31c.49c117cfe2e54c3a98e2a26be5050401',
                    template: '<a href="{{link}}" target="_blank"><img src="http:{{image}}" /></a>'
                });
                userFeed.run();
            }
        },
        flickr: function () {
            var instance = this;

            if (instance.flickrfeed.length){
                instance.flickrfeed.jflickrfeed({
                    limit: 6,
                    qstrings: {
                        id: instance.options.flickrId
                    },
                    itemTemplate: '<a href="{{image_b}}" target="_blank"><img src="{{image_s}}" alt="{{title}}" /></a>'
                });
            }
        },
        countUp: function () {
            var instance = this,
                obj = {
                    signPos: 'after',
                    delay: 35,
                    orderSeparator: ' ',
                    decimalSeparator: ','
                };
            if (instance.countup.length > 0) {
                instance.countup.hsCounter(obj);
            }
        },
        countDown: function () {
            var instance = this;

            if (instance.timer.length > 0) {
                instance.timer.countdown(instance.options.countdownTo, function (event) {
                    var self = $(this);

                    if (!instance.timer.parents('.countdown-page').hasClass('countdown-page')) {
                        self.html(event.strftime(
                            '<div><span>%D</span> <ins>Day%!D</ins></div>' + '<div><span>%H<i>:</i></span><ins class="cd1">Countdown</ins></div>' + '<div><span>%M<i>:</i></span></div>' + '<div><span>%S</span></div>'));
                    } else {
                        self.html(event.strftime(
                            '<div><span>%D<ins>Day%!D</ins></span></div>' + '<div><span>%H<ins class="cd1">Hours</ins></span><i>:</i></div>' + '<div><span>%M<ins class="cd2">Minutes</ins></span><i>:</i></div>' + '<div><span>%S<ins class="cd3">Seconds</ins></span></div>'));
                    }
                });
            }
        },
        contactMap: function() {
            var instance = this;

            if (instance.map.length > 0) {
                $.each(instance.map, function (index, map) {
                    var mapContainer = $(map).find('.google-map-container'),
                        latLong = new google.maps.LatLng(mapContainer.data('latitude'), mapContainer.data('longitude')),
                        mapOptions = {
                            zoom: mapContainer.data('zoom'),
                            scrollwheel: false,
                            navigationControl: false,
                            mapTypeControl: false,
                            scaleControl: false,
                            draggable: true,
                            cmyLatlng: latLong,
                            center: latLong
                        },
                        googleMap = new google.maps.Map(mapContainer.get(0), mapOptions);

                    new google.maps.Marker({
                        position: latLong,
                        map: googleMap
                    });

                    $('.a-map').on('click', function () {
                        var self = $(this),
                            popupContainer = $(self.attr('href')),
                            mapPopup = popupContainer.find('.google-map-popup');

                        setTimeout(function () {
                            new google.maps.Marker({
                                position: latLong,
                                map: new google.maps.Map(mapPopup.get(0), mapOptions)
                            });
                        }, 200);
                    });
                });
            }
        },
        chars: function () {
            var instance = this,
                winTop = $win.scrollTop(),
                winHeight = $win.height();

            if (instance.chart.length > 0) {
                instance.chart.each(function () {
                    var self = $(this),
                        color = self.css('color');

                    if (winTop <= self.offset().top && (winTop + winHeight) >= self.offset().top && !self.hasClass('pie-visible')) {
                        self.animate({'opacity': 1}, instance.options.speedAnimation);
                        self.easyPieChart({
                            animate: instance.options.speedAnimation * 4,
                            barColor: color,
                            onStep: function (from, to, percent) {
                                if (!$(this.el).hasClass('no-percent')) {
                                    $(this.el).find('.percent').text(Math.round(percent));
                                }
                            }
                        });
                        self.addClass('pie-visible');
                    }
                });
            }
        },
        magnificPopup: function () {
            var instance = this;

            instance.magnificWrap.each(function() {
                var $this = $(this);

                $this.find(instance.magnific).magnificPopup({
                    type: 'image',
                    tLoading: '',
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true
                    },
                    image: {
                        titleSrc: function (item) {
                            return item.el.attr('title');
                        }
                    }
                });
            });

            instance.magnificVideo.on('click', function(e) {
                e.preventDefault();

                var $this = $(this),
                    url = $this.attr('href');

                if (!$this.parents('.mix').hasClass('inactive')) {
                    $.magnificPopup.open({
                        items: {
                            src: url,
                            type: 'iframe',
                            fixedContentPos: true
                        }
                    });
                }
            });

            instance.magnificGallery.on('click', function(e) {
                e.preventDefault();

                var $this = $(this),
                    items = [],
                    im = $this.data('gallery'),
                    imA = im.split(','),
                    imL = imA.length,
                    titl = $this.attr('title');

                for (var i = 0; i < imL; i++){
                    items.push({
                        src: imA[i]
                    });
                }

                if (!$this.parents('.mix').hasClass('inactive')) {
                    $.magnificPopup.open({
                        items: items,
                        type: 'image',
                        gallery: {
                            enabled: true
                        },
                        image: {
                            titleSrc: function () {
                                return titl;
                            }
                        }
                    });
                }
            });
        },
        feedForm: function () {
            var instance = this;

            if(instance.newsletter.length === 1) {
                instance.newsletter.find('input[type=email]').on('keyup', function () {
                    var sucBlock = $('.success-block');
                    if (sucBlock.is(':visible'))
                        sucBlock.css('display','none');
                });

                instance.newsletter.validatr({
                    showall: true,
                    location: 'top',
                    template: '<div class="error-email">'+instance.options.errorText+'</div>',
                    valid: function () {
                        var form = instance.newsletter,
                            msgwrap = form.next(),
                            url = form.attr('action'),
                            email = form.find('input[type=email]');

                        url = url.replace('/post?', '/post-json?').concat('&c=?');

                        var data = {};
                        var dataArray = form.serializeArray();

                        $.each(dataArray, function (index, item) {
                            data[item.name] = item.value;
                        });

                        $.ajax({
                            url: url,
                            data: data,
                            success: function(resp){
                                var successText = instance.options.successText;
                                function notHide(){
                                    form.attr('style',' ');
                                }

                                if(resp.result === 'success') {
                                    msgwrap.html('<p class="success">'+successText+'</p>');
                                    setTimeout(notHide, 0);
                                }
                                else {
                                    setTimeout(notHide, 0);
                                    var msg;
                                    try {
                                        var parts = resp.msg.split(' - ', 2);
                                        if (parts[1] === undefined) {
                                            msg = resp.msg;
                                        } else {
                                            var i = parseInt(parts[0], 10);
                                            if (i.toString() === parts[0]) {
                                                msg = parts[1];
                                            } else {
                                                msg = resp.msg;
                                            }
                                        }
                                    }
                                    catch (e) {
                                        msg = resp.msg;
                                    }
                                    msgwrap.html('<p class="error">' + msg + '</p>');
                                }
                                form.slideUp(0,function () {
                                    msgwrap.slideDown();
                                });
                            },
                            dataType: 'jsonp',
                            error: function (resp, text) {
                                alert('Oops! AJAX error: ' + text);
                            }
                        });
                        return false;
                    }
                });
            }
        },
        sendForm: function () {
            var forms = $('.send-form');

            if (forms.length) {
                $.each(forms, function (form_index, form) {
                    form = $(form);
                    form.find('input, textarea').not('[type="radio"]').focusout(function () {
                        var self = $(this),
                            required = self.attr('required') ? true : false;

                        if (self.attr('type') == 'email') {
                            if ((required && self.val() === '')) {
                                self.parent().addClass('has-error');
                            }
                        } else {
                            if (required && self.val() === '') {
                                self.parent().addClass('has-error');
                            }
                        }
                    }).focusin(function () {
                        $(this).parent().removeClass('has-error');
                    });

                    form.find('input[type="radio"]').on('change', function () {
                        var self = $(this),
                            required = self.attr('required') ? true : false;

                        if (required && self.val() === '') {
                            self.parent().addClass('has-error');
                        }
                    });

                    form.find('select').on('change', function () {
                        var self = $(this),
                            required = self.attr('required') ? true : false;

                        self.parent().removeClass('has-error');

                        if (required && self.val() === '') {
                            self.parent().addClass('has-error');
                        }
                    });

                    form.on('submit', function () {
                        var hasErrors = false,
                            form = $(this);

                        $.each(form.find('input, textarea').not('[type="radio"]'), function (index, input) {
                            var self = $(input),
                                required = self.attr('required') ? true : false;

                            if (self.attr('type') == 'email') {
                                if (required && self.val() === '') {
                                    hasErrors = true;
                                    self.parent().addClass('has-error');
                                }
                            } else {
                                if (required && self.val() === '') {
                                    hasErrors = true;
                                    self.parent().addClass('has-error');
                                }
                            }
                        });

                        $.each(form.find('select'), function (index, input) {
                            var self = $(input),
                                required = self.attr('required') ? true : false;

                            if (required && self.val() === '') {
                                hasErrors = true;
                                self.parent().addClass('has-error');
                            }
                        });

                        $.each(form.find('input[type="radio"]'), function (index, input) {
                            var self = $(input),
                                required = self.attr('required') ? true : false;

                            if (required && self.val() === '') {
                                hasErrors = true;
                                self.parent().addClass('has-error');
                            }
                        });

                        var inputs_data = {};

                        $.each(form.find('input, textarea, select'), function (index, input) {
                            input = $(input);

                            if (input.attr('name')) {
                                inputs_data[input.attr('name')] = {
                                    required: input.attr('required'),
                                    value: input.val(),
                                    type: input.attr('type')
                                };
                            }
                        });

                        if (!hasErrors) {
                            $.ajax({
                                type: 'POST',
                                url: form.attr('action'),
                                data: inputs_data,
                                dataType: 'json'
                            }).done(function (answer) {
                                if ((typeof answer.status != 'undefined') && (answer.status == 'ok')) {
                                    form[0].reset();
                                    $('.succs-msg').fadeIn().css("display","inline-block");
                                } else {
                                    alert('Message was not sent. Server-side error!');
                                }
                            }).fail(function () {
                                alert('Message was not sent. Client error or Internet connection problems.');
                            });
                        }
                        return false;
                    });
                });
            }
        },
        rez: function () {
            var instance = this,
                footer = $('.footer'),
                hfix = instance.vmenu.find('.header > div:last-child'),
                hfixHeight = hfix.outerHeight(),
                navbarHeight = instance.header.find('.navbar').outerHeight(),
                winHeight = $win.height(),
                hh = (instance.body.hasClass('vertical-menu')) ? 0 : instance.header.outerHeight(true);

            if (winHeight < (navbarHeight + hfixHeight + 65)){
                hfix.removeClass('navbar-fixed-bottom');
            } else {
                hfix.addClass('navbar-fixed-bottom');
            }

            if (instance.slider.hasClass('msnr-container')){
                setTimeout(function () {
                    instance.slider.filter('.msnr-container').find('.caroufredsel_wrapper').height(instance.slider.filter('.msnr-container').find('li:first').height());
                }, instance.options.speedAnimation);
            }

            if (instance.body.hasClass('vertical-menu')){
                setTimeout(function () {
                    instance.fSize();
                    instance.fMiddle();
                    instance.isotopeMix();
                    instance.masonryMix();
                    instance.sliders('.fullscreen.vertical');
                }, 310);
            }

            if (instance.body.hasClass('splash')) {
                footer = $('footer');
            }

            instance.wrapper.css('minHeight', winHeight - hh - (footer.outerHeight(true) || 0));

            setTimeout(function(){
                instance.sliders('.fullscreen.vertical');
            }, 0);
        },
        vswitcher: function() {
            var instance = this,
                winWidth = $win.width();

            if (!instance.header.hasClass('showtoggle')) {
                if (winWidth < 1260) {
                    $('.vertical-menu .header').addClass('vhidden');
                    instance.vSide.removeClass('active');
                } else {
                    $('.vertical-menu .header').removeClass('vhidden');
                    instance.vSide.addClass('active');
                }
            }
        },
        scrll: function () {
            var instance = this,
                toggleTop = instance.sidemenuToggle.data('top-position');

            if ($win.scrollTop() > 130){
                instance.sidemenuToggle.css('top', 130);
                $('.vertical-menu').find(instance.sidemenuToggle).css('top', 50);
            } else{
                instance.sidemenuToggle.css('top', toggleTop);
            }

            if ($win.scrollTop() > instance.options.scrollTopButtonOffset) {
                instance.scrTop.addClass('vis');
            } else {
                instance.scrTop.removeClass('vis').removeAttr('style');
            }

            instance.chars();
            instance.countUp();
        },
        scrollbarWidth: function () {
            var a,
                b,
                c;

            if (c === undefined) {
                a = $('<div style="width:50px; height:50px; overflow:auto;"><div/>').appendTo('body');
                b = a.children();
                c = b.innerWidth() - b.height(99).innerWidth();
                a.remove();
            }

            return c;
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);

(function ($) {
    $(document.body).Aisconverse();

    // *** IE9 placeholder *** //
    if(document.all && !window.atob){$('[placeholder]').focus(function(){var input=$(this);if(input.val()==input.attr('placeholder')){input.val('');input.removeClass('placeholder');}}).blur(function(){var input=$(this);if(input.val()==''||input.val()==input.attr('placeholder')){input.addClass('placeholder');input.val(input.attr('placeholder'));}}).blur().parents('form').submit(function(){$(this).find('[placeholder]').each(function(){var input=$(this);if(input.val()==input.attr('placeholder')){input.val('');}})});}
})(jQuery);
