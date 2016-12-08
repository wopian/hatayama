$(window).on('scroll', function () {
  if ($(this).scrollTop() > 243) {
    $('aside').addClass('shrink');
  } else {
    $('aside').removeClass('shrink');
  }
});
