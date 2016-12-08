$(window).on('scroll', function () {
  if ($(this).scrollTop() > 250) {
    $('header').addClass('not-transparent');
  } else {
    $('header').removeClass('not-transparent');
  }
});
