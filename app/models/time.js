// Generate human-readable time stamps
// eslint-disable-next-line no-unused-vars
const humanTime = (updated) => {
  // TODO: Redesign object to allow proper i18n localisation
  const locale = {
          sufix:     'ago',
          separator: ' ',
          seconds:   'moments',
          minute:    '%d minute',
          minutes:   '%d minutes',
          hour:      '%d hour',
          hours:     '%d hours',
          day:       '%d day',
          days:      '%d days',
          month:     '%d month',
          months:    '%d months',
          year:      '%d year',
          years:     '%d years'
        },
        // Calculate seconds difference between current time and passed time
        seconds = Math.floor((new Date().getTime() - new Date(updated).getTime()) / 1000),
        period = {
          year:   seconds / 31536000,
          month:  seconds / 2592000,
          day:    seconds / 86400,
          hour:   seconds / 3600,
          minute: seconds / 60
        };
  let checkIfSingular,
      output = locale.separator,
      elapsed = locale.seconds;

  for (const key in period) {
    checkIfSingular = Math.floor(period[key]);
    if (checkIfSingular > 1) {
      elapsed = locale[`${key}s`];
      break;
    } else if (checkIfSingular === 1) {
      elapsed = locale[key];
      break;
    }
  }

  elapsed = elapsed.replace(/%d/i, checkIfSingular);
  output += elapsed + locale.separator + locale.sufix;
  return output.trim();
};
