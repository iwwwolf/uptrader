$(function(){

    // Аккордион
    $('.accordion__name').on('click', function(){
        $(this).toggleClass('opened');
        $(this).parent().find('.accordion__content').slideToggle();
        if($('.accordion__name.opened').length){
            $('.ways').addClass('active');
        } else {
            $('.ways').removeClass('active');
        }
    });

    // Табы
    $('.tabs__link').on('click', function(e){
        e.preventDefault();

        if(!$(this).hasClass('active')){
            var target = $(this).attr('href');
            $('.tabs__link.active').removeClass('active');
            $(this).addClass('active');
            $('.accordion__item.showed').removeClass('showed').hide();
            $(target).show().addClass('showed');
        }
    });

    $('.ways-list__item').on('click', function(e){
        e.preventDefault();

        var href = $(this).attr('href');
        var waysTop = $('.ways').offset().top;

        $('html').animate({'scrollTop': waysTop-20 + 'px'}, 400);

        console.log()

        $('.tabs__link[href="' + href + '"]').click();
    });
});
