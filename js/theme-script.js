/* ------------------------------------------------
  Project:   Rizal - Personal Portfolio HTML5 Template
  Author:    ThemeHt
------------------------------------------------ */
/* ------------------------
    Table of Contents

  1. Predefined Variables
  2. Preloader  
  3. Menu  
  4. Counter
  5. Scroll to top
  6. Search
  7. HT Window load and functions   

------------------------ */

(function($) {

"use strict";

/*------------------------------------
  HT Predefined Variables
--------------------------------------*/
var jQuerywindow = jQuery(window),
    jQuerydocument = jQuery(document),
    jQuerybody = jQuery('body');

//Check if function exists
jQuery.fn.exists = function () {
  return this.length > 0;
};


/*------------------------------------
  HT Counter
--------------------------------------*/
function counter() {  
  var elementSelector = jQuery('.count-number');
    elementSelector.each(function(){
        elementSelector.appear(function(e) {
            var el = this;
            var updateData = jQuery(el).attr("data-count");
            var od = new Odometer({
                el: el,
                format: 'd',
                duration: 2000
            });
            od.update(updateData);
        });
    });
};


/*------------------------------------
  HT Contact Form
--------------------------------------*/
function contactform() { 

    // when the form is submitted
    jQuery('#contact-form').on('submit', function (e) {

    // if the validator does not prevent form submit
    if (!e.isDefaultPrevented()) {
        var url = "php/contact.php";

        // POST values in the background the the script URL
        jQuery.ajax({
            type: "POST",
            url: url,
            data: jQuery(this).serialize(),
            success: function (data)
            {
            // data = JSON object that contact.php returns

            // we recieve the type of the message: success x danger and apply it to the 
            var messageAlert = 'alert-' + data.type;
            var messageText = data.message;

            // let's compose Bootstrap alert box HTML
            var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
            
            // If we have messageAlert and messageText
            if (messageAlert && messageText) {
                // inject the alert to .messages div in our form
                jQuery('#contact-form').find('.messages').html(alertBox).show().delay(2000).fadeOut('slow');
                // empty the form
                jQuery('#contact-form')[0].reset();
            }
          }
        });
        return false;
    }
 })    
};


/*------------------------------------------
  HT Text Color, Background Color And Image
---------------------------------------------*/
function databgcolor() {
    jQuery('[data-bg-color]').each(function(index, el) {
        jQuery(el).css('background-color', jQuery(el).data('bg-color'));
    });
    jQuery('[data-text-color]').each(function(index, el) {
        jQuery(el).css('color', jQuery(el).data('text-color'));
    });
    jQuery('[data-bg-img]').each(function() {
        jQuery(this).css('background-image', 'url(' + jQuery(this).data("bg-img") + ')');
    });
};

var $stickysec = $('.js-sticky').length;
function sticky() {
    if($stickysec != ''){
        const sticky_sec = document.querySelector(".js-sticky");
    var stickyEl = new Sticksy('.js-sticky', {
                topSpacing: 60,
            })
            stickyEl.onStateChanged = function (state) {
                if (state === 'fixed') stickyEl.nodeRef.classList.add('sticky-item')
                else stickyEl.nodeRef.classList.remove('sticky-item')
            }
             };
};


function aos() {
   AOS.init({
            duration: 1500,
            once: true,
        })
};



/*------------------------------------
  HT Window load and functions
--------------------------------------*/
jQuery(document).ready(function() {    
    counter(),
    contactform(),
    databgcolor(),
    sticky();
});

jQuery(window).on('load', function() {
    aos();
});

})(jQuery);