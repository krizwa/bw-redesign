(function (BW, $, undefined) {
/* ==========================================================================
    2:          Carousel
    Desription: 
                
    Templates:  
    Components: C217, C222
 ========================================================================== */
     BW.Carousel = (function () {
       var Carousel = function () {

         var c = this;
         
         // This is a loaded flag as the transition function needs to kill
         // the carousel before removing the page
         this.loaded = false;
         
         //methods 
         this.init = function(container, scroll, wrap, expert) {

           if(typeof(scroll)==='undefined') scroll = 1;
           if(typeof(wrap)==='undefined') wrap = 'circular';
           if(typeof(expert)==='undefined') expert = false;

           this.carousel = container.children('.jcarousel');

           //initialise carousel
           this.carousel.jcarousel({ 
             'scroll' : scroll,
             'wrap' : wrap
           });
           this.loaded = true;

           //initialise prev / next navigation
           container.children('.jcarousel-prev').jcarouselControl({
               target: '-='+scroll
           });
           container.children('.jcarousel-next').jcarouselControl({
               target: '+='+scroll
           });

           //initialise navigation
           this.pagination = container.children('.jcarousel-pagination');
           this.pagination.jcarouselPagination();
           this.pagination.children("a:first-child").addClass("active");

           //event listener to add active class to navigation
           this.pagination.on('jcarouselpagination:active','a', function() {
             $(this).addClass('active');
           }).on('jcarouselpagination:inactive','a', function() {
             $(this).removeClass('active');
           });

           //Making the heading in center 
           if (container.hasClass('carousel-large')) {
             var imgwdth = [],
                 vedioImgSectionwdth = [],
                 totalwdth = $('.carousel-large li').width();

             for(i=0; i<=$('.image-section').has('img').length; i++) {
               
               var imageWidth = parseInt($('.carousel-large li').eq(i).children('.image-section').find('img').width()) || 0,
                   imagePaddingRight = parseInt($('.carousel-large li').eq(i).find('img').css('padding-right')) || 0,
                   imagePaddingLeft =  parseInt($('.carousel-large li').eq(i).find('img').css('padding-left')) || 0,
                   imageMarginRight =  parseInt($('.carousel-large li').eq(i).find('img').css('margin-right')) || 0,
                   imageMarginLeft =  parseInt($('.carousel-large li').eq(i).find('img').css('margin-left')) || 0,
                   
                   videoImgwdth = parseInt($('.carousel-large li.video .video-thumbnail').eq(i).children('img').width()) || 0,
                   videoimgHt = parseInt($('.carousel-large li.video .video-thumbnail').eq(i).children('img').height()) || 0;
               
                   imgwdth[i] =  imageWidth + imagePaddingRight + imagePaddingLeft + imageMarginRight + imageMarginLeft +'px';
                           
                 $('.carousel-large li').eq(i).children('.image-section').css('width', imgwdth[i]); 
                 $('.carousel-large li').eq(i).children('.text-section').css('width', (totalwdth - imgwdth[i].replace('px', '')) + 'px'); 

                 $('.carousel-large li.video .video-thumbnail').eq(i).children('a.icon-video').css({
                   "top": ((videoimgHt - 65) /2) + 'px',
                   "right": ((videoImgwdth - 65)/2) + 'px'
                 });
             }
             for(i=0; i<$('.carousel-large li.video').length; i++) {
               
             var vedioImgSection = parseInt($('.carousel-large li.video ').eq(i).children('.image-section').width()) || 0,
                 imagePositionRight =  parseInt($('.carousel-large li.video .video-thumbnail').css('right')) || 0;

                 vedioImgSectionwdth[i] = vedioImgSection + imagePositionRight +'px';

               $('.carousel-large li.video').eq(i).children('.image-section').css('width', vedioImgSectionwdth[i]);
               $('.carousel-large li.video').eq(i).children('.text-section').css('width', (totalwdth - vedioImgSectionwdth[i].replace('px', '')) + 'px');
             }
           }
          
           //Code by Anwar for fecthing title for pagination links BWP-987 
           var title = new Array();
           for(i=0;i<=this.carousel.find("li").length;i++){
               title[i] = this.carousel.find("li").children(".slide-title-holder").eq(i).children(".slide-title").val();
           }

           //fetches & adds title when pagination is created //Refactoring needed as the code is duplicated twice on line 267
           this.pagination.on('create.jcarouselcontrol', function() {
             for(i=0;i<$(this).find("a").length;i++){
               $(this).find("a").eq(i).attr("title",title[i]).text(title[i]);
             }
           });

           //fetches & adds title when page is refreshed
           if (this.pagination.children("a").length > 0) {
             t = this.pagination;
             for(i=0;i<t.find("a").length;i++){
               t.find("a").eq(i).attr("title",title[i]).text(title[i]);
             }
           } 

           //add left class to last five visible elements on expert carousel
           if (expert) {
             this.carousel.on('scrollend.jcarousel', function(event, c) {
               var v = c.fullyvisible();
               for (var i = 0, l = v.length; i < l; i++) {
                 profile = v[i];
                 if (i<5) $(profile).children('.expert-panel-tooltip').removeClass('left');
                 else $(profile).children('.expert-panel-tooltip').addClass('left');
               }
             });
           }
         }

         this.kill = function () {
           if (this.carousel && this.loaded == "true") {
             $('.jcarousel').jcarousel('destroy');
             this.loaded = false;
           }
         }

       }
       return new Carousel();
     }());
     }(window.BW = window.BW || {}, jQuery));