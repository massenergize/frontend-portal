/***************************************************************************************************************
||||||||||||||||||||||||||||       MASTER SCRIPT FOR ECOGREEN      ||||||||||||||||||||||||||||||||||||
****************************************************************************************************************
||||||||||||||||||||||||||||              TABLE OF CONTENT                  ||||||||||||||||||||||||||||||||||||
****************************************************************************************************************
****************************************************************************************************************

01. Prealoder
02. Sticky header
03. Fact counter
04. Scroll to top
05. Main menu
06. Revolution slider
07. Contact Form 
08. Select menu 
09. Tooltip
10. Language switcher
11. Price Ranger
12. Cart Touch Spin
13. Tabs Box
14. Image popup
15. Gallery masonary
16. Fancybox activator
17. Accrodion_box
18. wow animation
19. Donate Popup
20. owlCarousel


****************************************************************************************************************
||||||||||||||||||||||||||||            End TABLE OF CONTENT                ||||||||||||||||||||||||||||||||||||
****************************************************************************************************************/










(function($) {
	
	"use strict";


// Prealoder
function handlePreloader() {
	if($('.preloader').length){
		$('.preloader').delay(200).fadeOut(500);
	}
}

// stickyheader
function stickyHeader () {
	if ($('.stricky').length) {
		var strickyScrollPos = 100;
		if($(window).scrollTop() > strickyScrollPos) {
			$('.stricky').removeClass('fadeIn animated');
	      	$('.stricky').addClass('stricky-fixed fadeInDown animated');
	      	$('.scroll-to-top').fadeIn(500);
		}
		else if($(this).scrollTop() <= strickyScrollPos) {
			$('.stricky').removeClass('stricky-fixed fadeInDown animated');
	      	$('.stricky').addClass('slideIn animated');
	      	$('.scroll-to-top').fadeOut(500);
		}
	};
}


	
// Fact Counter
function factCounter() {
	if($('.fact-counter').length){
		$('.fact-counter .counter-column.animated').each(function() {
	
			var $t = $(this),
				n = $t.find(".count-text").attr("data-stop"),
				r = parseInt($t.find(".count-text").attr("data-speed"), 10);
				
			if (!$t.hasClass("counted")) {
				$t.addClass("counted");
				$({
					countNum: $t.find(".count-text").text()
				}).animate({
					countNum: n
				}, {
					duration: r,
					easing: "linear",
					step: function() {
						$t.find(".count-text").text(Math.floor(this.countNum));
					},
					complete: function() {
						$t.find(".count-text").text(this.countNum);
					}
				});
			}
			
		});
	}
}

// Scroll to top
function scrollToTop() {
    if ($('.scroll-top').length) {
    	var h = $('.scroll-top');
        //Check to see if the window is top if not then display button
        $(window).scroll(function() {
            if ($(this).scrollTop() > 200) {
                h.fadeIn();
            } else {
                h.fadeOut();
            }
        });

        //Click event to scroll to top
        h.click(function() {
            $('html, body').animate({ scrollTop: 0 }, 1500);
            return false;
        });
    }
}

// Main Menu  
function themeMenu() {
    if ($("#main_menu").length) {
        $("#main_menu").menuzord({
            animation: "zoom-out"
        });
    }
}

// revolution slider
function revolutionSliderActiver () {
	if ($('.rev_slider_wrapper #slider1').length) {
		jQuery("#slider1").revolution({
			sliderType:"standard",
			sliderLayout:"auto",
			dottedOverlay:"yes",
			delay:5000,
			navigation: {
				arrows:{enable:true,
						left: {
                        h_align: "left",
                        v_align: "center",
                        h_offset: 60,
                        v_offset: 0
                    },
                    right: {
                        h_align: "right",
                        v_align: "center",
                        h_offset: 60,
                        v_offset: 0
                    }

				} 
			}, 
            gridwidth: [1200,],
            gridheight: [790,],
            lazyType: "none",
            parallax: {
                type: "mouse",
                origo: "slidercenter",
                speed: 2000,
                levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50],
            },
            shadow: 0,
            spinner: "off",
            stopLoop: "off",
            stopAfterLoops: -1,
            stopAtSlide: -1,
            shuffle: "off",
            autoHeight: "off",
            hideThumbsOnMobile: "off",
            hideSliderAtLimit: 0,
            hideCaptionAtLimit: 0,
            hideAllCaptionAtLilmit: 0,
            debugMode: false,
            fallbacks: {
                simplifyAll: "off",
                nextSlideOnWindowFocus: "off",
                disableFocusListener: false,
            }
		});
	};
}

//Contact Form
function contactform() {
    if($("#contact-form").length){
		$("#contact-form").validate({
		    submitHandler: function(form) {
		      var form_btn = $(form).find('button[type="submit"]');
		      var form_result_div = '#form-result';
		      $(form_result_div).remove();
		      form_btn.before('<div id="form-result" class="alert alert-success" role="alert" style="display: none;"></div>');
		      var form_btn_old_msg = form_btn.html();
		      form_btn.html(form_btn.prop('disabled', true).data("loading-text"));
		      $(form).ajaxSubmit({
		        dataType:  'json',
		        success: function(data) {
		          if( data.status == 'true' ) {
		            $(form).find('.form-control').val('');
		          }
		          form_btn.prop('disabled', false).html(form_btn_old_msg);
		          $(form_result_div).html(data.message).fadeIn('slow');
		          setTimeout(function(){ $(form_result_div).fadeOut('slow') }, 6000);
		        }
		      });
		    }
		});
	}
} 

// select menu
function selectMenu () {
	if ($('.select-menu').length) {
		$('.select-menu').selectmenu();
	};
}

// Tooltip
function tooltip () {
	if ($('.tool_tip').length) {
			$('.tool_tip').tooltip();
		};
	$
}

// Language switcher
function languageSwitcher() {

    if ($("#polyglot-language-options").length) {
        $('#polyglotLanguageSwitcher').polyglotLanguageSwitcher({
            effect: 'slide',
            animSpeed: 150,
            testMode: true,
            onChange: function(evt) {
                    alert("The selected language is: " + evt.selectedItem);
                }

        });
    };
}

// Price Ranger 
function priceFilter() {
    if ($('.price-ranger').length) {
        $('.price-ranger #slider-range').slider({
            range: true,
            min: 10,
            max: 200,
            values: [11, 99],
            slide: function(event, ui) {
                $('.price-ranger .ranger-min-max-block .min').val('$' + ui.values[0]);
                $('.price-ranger .ranger-min-max-block .max').val('$' + ui.values[1]);
            }
        });
        $('.price-ranger .ranger-min-max-block .min').val('$' + $('.price-ranger #slider-range').slider('values', 0));
        $('.price-ranger .ranger-min-max-block .max').val('$' + $('.price-ranger #slider-range').slider('values', 1));
    };
}

// Cart Touch Spin
function cartTouchSpin () {
	if($('.quantity-spinner').length){
		$("input.quantity-spinner").TouchSpin({
		  verticalbuttons: true
		});
	}
}

// Tabs Box
function tabbox() {
	if($('.tabs-box').length){
		
		//Tabs
		$('.tabs-box .tab-buttons .tab-btn').click(function(e) {
			
			e.preventDefault();
			var target = $($(this).attr('data-tab'));
			
			target.parents('.tabs-box').find('.tab-buttons').find('.tab-btn').removeClass('active-btn');
			$(this).addClass('active-btn');
			target.parents('.tabs-box').find('.tabs-content').find('.tab').fadeOut(0);
			target.parents('.tabs-box').find('.tabs-content').find('.tab').removeClass('active-tab');
			$(target).fadeIn(300);
			$(target).addClass('active-tab');
		});
		
	}

}

// Image popup
function imgpopup() {
    if ($('.img-popup').length) {
        var groups = {};
        $('.img-popup').each(function() {
            var id = parseInt($(this).attr('data-group'), 10);

            if (!groups[id]) {
                groups[id] = [];
            }

            groups[id].push(this);
        });


        $.each(groups, function() {

            $(this).magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                closeBtnInside: false,
                gallery: { enabled: true }
            });

        });

    };
}

function videopopup() {
	$('.gallery_video').each(function() { // the containers for all your galleries
	    $(this).magnificPopup({
	        delegate: 'a', // the selector for gallery item
	        disableOn: 700,
	        type: 'iframe',
	        mainClass: 'mfp-fade',
	        removalDelay: 160,
	        preloader: true,
	        fixedContentPos: false,
	        gallery: {
	          enabled:true
	        },
	        callbacks: {
	      lazyLoad: function(item) {
	        console.log(item); // Magnific Popup data object that should be loaded
	      }
	    }
	    });
	}); 

}

	


// Gallery masonary
function galleryMasonaryLayout() {
    if ($('.masonary-layout').length) {
        $('.masonary-layout').isotope({
            layoutMode: 'masonry'
        });
    }

    if ($('.post-filter').length) {
        $('.post-filter li').children('span').click(function() {
            var Self = $(this);
            var selector = Self.parent().attr('data-filter');
            $('.post-filter li').children('span').parent().removeClass('active');
            Self.parent().addClass('active');


            $('.filter-layout').isotope({
                filter: selector,
                animationOptions: {
                    duration: 500,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });
    }

    if ($('.post-filter.has-dynamic-filter-counter').length) {
        // var allItem = $('.single-filter-item').length;

        var activeFilterItem = $('.post-filter.has-dynamic-filter-counter').find('li');

        activeFilterItem.each(function() {
            var filterElement = $(this).data('filter');
            console.log(filterElement);
            var count = $('.gallery-content').find(filterElement).length;

            $(this).children('span').append('<span class="count"><b>' + count + '</b></span>');
        });
    };
}

// gallery fancybox activator 
function GalleryFancyboxActivator () {
  var galleryFcb = $('.fancybox');
  if(galleryFcb.length){
    galleryFcb.fancybox({
      openEffect  : 'elastic',
      closeEffect : 'elastic',
      helpers : {
        media : {}
      }
    });
  }
}


// Accrodion_box 
function accrodion() {
    if ($('.accordion-box').length) {
	    $('.accordion-box .acc-btn').click(function() {
	        if ($(this).hasClass('active') !== true) {
	            $('.accordion-box .acc-btn').removeClass('active');
	        }

	        if ($(this).next('.acc-content').is(':visible')) {
	            $(this).removeClass('active');
	            $(this).next('.acc-content').slideUp(500);
	        } else {
	            $(this).addClass('active');
	            $('.accordion-box .acc-content').slideUp(500);
	            $(this).next('.acc-content').slideDown(500);
	        }
	    });
	}
}
	
// wow animation 
function wowanimation() {
    if($('.wow').length){
		var wow = new WOW(
		  {
			boxClass:     'wow',     
			animateClass: 'animated', 
			offset:       0,          
			mobile:       true,       
			live:         true       
		  }
		);
		wow.init();
	}
}



function progressbar() {
	// Donation Progress Bar
	if ($('.animated-bar').length) {
		
		$('.animated-bar').appear(function(){
			var el = $(this);
			var percent = el.data('percent');
			$(el).css('width',percent).addClass('counted');
		},{accY: -10});

	}
}

function donatepopup() {	
	if($('#donate-popup').length){
		
		//Show Popup
		$('.donate-box-btn').click(function() {
			$('#donate-popup').addClass('popup-visible');
		});
		
		//Hide Popup
		$('.close-donate').click(function() {
			$('#donate-popup').removeClass('popup-visible');
		});
	}
}

// Date picker
function datepicker () {
    if ($('#datepicker').length) {
        $('#datepicker').datepicker();
    };
}

function countDownTimer () {
	if ($('.time-countdown').length) {

		$('.time-countdown').each(function () {
			var Self = $(this);
			var countDate = Self.data('countdown-time'); // getting date

			Self.countdown(countDate, function(event) {
	     		$(this).html('<h2>'+ event.strftime('%D : %H : %M : %S') +'</h2>');
	   		});
		});

		

	};
	if ($('.time-countdown-two').length) {

		$('.time-countdown-two').each(function () {
			var Self = $(this);
			var countDate = Self.data('countdown-time'); // getting date

			Self.countdown(countDate, function(event) {
	     		$(this).html('<li> <div class="box"> <span class="days">'+ event.strftime('%D') +'</span> <span class="timeRef">days</span> </div> </li> <li> <div class="box"> <span class="hours">'+ event.strftime('%H') +'</span> <span class="timeRef">hours</span> </div> </li> <li> <div class="box"> <span class="minutes">'+ event.strftime('%M') +'</span> <span class="timeRef">minutes</span> </div> </li> <li> <div class="box"> <span class="seconds">'+ event.strftime('%S') +'</span> <span class="timeRef">seconds</span> </div> </li>');
	   		});
		});

		

	};
}

if ($('.cause-carousel').length) {
	$('.cause-carousel').owlCarousel({
	    loop: true,
	    items:3,
	    autoplay:true,
	    nav:true,
	    margin:30,
	    smartSpeed: 3000,
	    navText: [
            '<i class="icon-left-arrow-angle"></i>',
            '<i class="icon-left-arrow-angle2"></i>'
        ],
        dots: false,
        responsive: {
	        0:{
	            items:1,
	            loop:true,
				dots:false
	        },
	        600:{
				items:2,
				loop:true,
			},
	        992:{
	            items:3,
	            loop:true
	        }
	    }
	});
}


	if ($('.testimonial-slider').length) {
		$('.testimonial-slider').owlCarousel({
		    loop: true,
		    items:1,
		    autoplay:true,
		    nav: false,
		    smartSpeed: 1500,
	        dots: true
		});
	}
	if ($('.event-carousel2').length) {
		$('.event-carousel2').owlCarousel({
		    loop: true,
		    items:1,
		    autoplay:true,
		    nav: true,
		    navText: [
	            '<i class="icon-left-arrow-angle"></i>',
	            '<i class="icon-left-arrow-angle2"></i>'
	        ],
	        dots: false,
		    smartSpeed: 1500
		})
	}
	if ($('.event-carousel3').length) {
		$('.event-carousel3').owlCarousel({
		    loop: true,
		    items:1,
		    autoplay:true,
		    nav: true,
		    navText: [
	            '<i class="icon-left-arrow-angle"></i>',
	            '<i class="icon-left-arrow-angle2"></i>'
	        ],
	        dots: false,
		    smartSpeed: 1500
		})
	}

	if ($('.event-carousel').length) {
		$('.event-carousel').owlCarousel({
		    loop: true,
		    items:2,
		    nav:true,
		    margin:30,
		    smartSpeed: 3000,
		    navText: [
	            '<i class="icon-left-arrow-angle"></i>',
	            '<i class="icon-left-arrow-angle2"></i>'
	        ],
	        dots: false,
	        responsive: {
		        0:{
		            items:1,
		            loop:true,
					dots:false
		        },
		        480:{
					items:1,
					loop:true,
				},
		        768:{
		            items:1,
		            loop:true,
		        },
		        1000:{
		            items:2,
		            loop:true
		        }
		    }
		});
	}
	
	if ($('.cause-carousel').length) {
		$('.cause-carousel').owlCarousel({
		    loop: true,
		    items:3,
		    autoplay:true,
		    nav:true,
		    margin:30,
		    smartSpeed: 3000,
		    navText: [
	            '<i class="icon-left-arrow-angle"></i>',
	            '<i class="icon-left-arrow-angle2"></i>'
	        ],
	        dots: false,
	        responsive: {
		        0:{
		            items:1,
		            loop:true,
					dots:false
		        },
		        600:{
					items:2,
					loop:true,
				},
		        992:{
		            items:3,
		            loop:true
		        }
		    }
		});
	}	

	if ($('.gallery-carousel').length) {
		$('.gallery-carousel').owlCarousel({
		    loop: true,
		    nav: false,
	        dots: false,
		    autoplay:true,
		    smartSpeed: 3000,
		    responsive: {
		        0:{
		            items:1,
		            loop:true,
					dots:false
		        },
		        480:{
					items:4,
					loop:true,
					dots:false
				},
		        768:{
		            items:4,
		            loop:true,
					dots:false
		        },
		        992:{
		            items:4,
		            loop:true
		        },
		        1200:{
		            items:5,
		            loop:true
		        }
		    }
		});
	}
	if ($('.brand-carousel').length) {
		$('.brand-carousel').owlCarousel({
		    loop: true,
		    margin: 30,
		    nav: false,
	        dots: false,
		    autoplay:true,
		    smartSpeed: 3000,
		    responsive: {
		        0:{
		            items:1,
		            loop:true,
					dots:false
		        },
		        480:{
					items:2,
					loop:true,
					dots:false
				},
				767:{
					items:3,
					loop:true,
					dots:false
				},
		        992:{
		            items:4,
		            loop:true,
					dots:false
		        },
		        1200:{
		            items:5,
		            loop:true
		        }
		    }
		});
	}
	if ($('.brand-carousel2').length) {
		$('.brand-carousel2').owlCarousel({
		    loop: true,
		    margin: 30,
		    nav: false,
	        dots: false,
		    autoplay:true,
		    smartSpeed: 3000,
		    responsive: {
		        0:{
		            items:1,
		            loop:true,
					dots:false
		        },
		        480:{
					items:2,
					loop:true,
					dots:false
				},
				767:{
					items:3,
					loop:true,
					dots:false
				},
		        992:{
		            items:4,
		            loop:true,
					dots:false
		        },
		        1200:{
		            items:4,
		            loop:true
		        }
		    }
		});
	}
	if ($('.client-carousel').length) {
		$('.client-carousel.owl-carousel').owlCarousel({
		    loop: true,
		    margin: 30,
		    nav: true,
	        navText: [
	            '<i class="icon-left-arrow-angle"></i>',
	            '<i class="icon-left-arrow-angle2"></i>'
	        ],
	        dots: false,
		    autoWidth: false,
		    autoplay:true,
		    autoplayTimeout:3000,
		    responsive: {
		        0:{
		            items:1,
		            autoWidth: false
		        },
		        380:{
		            items:2,
		            autoWidth: false
		        },
		        540:{
		            items:3,
		            autoWidth: false
		        },
		        740:{
		            items:4,
		            autoWidth: false
		        },
		        1000:{
		            items:5,
		            autoWidth: false
		        }
		    }
		});
	};
	if ($('.testimonials-slider2').length) {
		$('.testimonials-slider2').owlCarousel({
		    loop: true,
		    margin: 30,
		    nav: false,
	        dots: false,
		    responsive: {
		        0:{
		            items:1,
		            loop:true,
					dots:false
		        },
		        480:{
					items:1,
					loop:true,
					dots:false
				},
		        768:{
		            items:2,
		            loop:true,
					dots:false
		        },
		        1000:{
		            items:3,
		            loop:true
		        }
		    }
		});
	}

	$('.knob').pieChart({
	        barColor: '#8dc63f',
	        trackColor: '#f4f4f4',
	        lineCap: 'butt',
	        lineWidth: 12,
	        size: 220,
	        rotate: 0,
	        animate: {
	          duration: 1000,
	          enabled: true
	        },
	        onStep: function (from, to, percent) {
	            $(this.element).find('.pie-value').text(Math.round(percent) + '%');
	        }
	    });

// instance of fuction while Document ready event	
jQuery(document).ready(function () {
	(function ($) {
		scrollToTop();
		themeMenu();
		revolutionSliderActiver();		
		GalleryFancyboxActivator();
		selectMenu();		
		tooltip();		
		languageSwitcher();		
		priceFilter();
		cartTouchSpin();
		tabbox();
		imgpopup();
		videopopup();
		galleryMasonaryLayout();
		contactform();
		accrodion();
		wowanimation();
		progressbar();
		donatepopup();
		datepicker();
		countDownTimer();
		
	})(jQuery);
});

// instance of fuction while Window Load event
jQuery(window).load(function () {
	(function ($) {
		handlePreloader();
	})(jQuery);
});

// instance of fuction while Window Scroll event
jQuery(window).scroll(function () {	
	(function ($) {
		stickyHeader();
		factCounter();
	})(jQuery);
});











})(window.jQuery);