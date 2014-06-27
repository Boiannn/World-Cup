Handlebars.registerHelper('formatToBgDate', function(date) {
  var parsedDate = new Date(date),
      options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'};

  return parsedDate.toLocaleString('bg-BG', options);
});

Handlebars.registerHelper('isCurrentlyPlaying', function(conditional, options) {
  if(conditional === 'playing') {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
