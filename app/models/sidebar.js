// Shrink flag aside once scrolled below map (243px)
// + restore original size when scrolled up
$(window).on('scroll', function () {
  if ($(this).scrollTop() > 243) {
    $('aside').addClass('shrink');
  } else {
    $('aside').removeClass('shrink');
  }
});
