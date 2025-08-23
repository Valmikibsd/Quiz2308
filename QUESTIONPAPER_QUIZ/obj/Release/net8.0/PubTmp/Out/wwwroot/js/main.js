$(window).on("load", function () {
    // executes when complete page is fully loaded, including all frames, objects and images
    $('.overlay').css('display', 'block');
    $('.lang-box').css('display', 'block');
});



$(document).ready(function () {
    $('.popup-close').click(function () {
        $('.lang-box').css('display', 'none');
        $('.overlay').css('display', 'none');
    });

    $('.mock-btn').click(function () {
        $('.mock-question').css('display', 'none');
        $('.popup').css('display', 'block');
    });
    //Check to see if the window is top if not then display button
    $(window).scroll(function () {
        if ($(window).width() > 1023) {
            var sticHeight = $('header').outerHeight();
            if ($(window).scrollTop() > 0) {
                $('header').addClass('fixed');
                $('body').css('padding-top', +sticHeight);
                $('.mock-q-attempt').addClass('mock-q-attempt_fixed');
            }
            else {
                $('header').removeClass('fixed');
                $('body').css('padding-top', '0px');
            }
        }
    });




});

//$(function () {
//    // bind change event to select
//    $('#dynamic_select').on('change', function () {
//        $('.lang-box').css('display', 'none');
//        $('.popup').css('display', 'none');
//        $('.overlay').css('display', 'none');
//        var url = $(this).val(); // get selected value
//        if (url) { // require a URL
//            window.location = url; // redirect
//        }
//        return false;
//    });
//});

