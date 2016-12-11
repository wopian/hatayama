$(window).on('scroll', function () {
  if ($(this).scrollTop() < 250) {
    $('header').addClass('transparent');
  } else {
    $('header').removeClass('transparent');
  }
});
