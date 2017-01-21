// Make the header transparent on flag pages when map is visible
// Header becomes visible when reaches flag/name
$(window).on('scroll', function () {
  if ($(this).scrollTop() < 250) {
    $('header').addClass('transparent');
  } else {
    $('header').removeClass('transparent');
  }
});
