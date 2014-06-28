Handlebars.registerHelper('formatToBgDate', function(date) {
  'use strict';
  var parsedDate = new Date(date),
      options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'};

  return parsedDate.toLocaleString('bg-BG', options);
});

Handlebars.registerHelper('isInProgress', function(conditional, options) {
  'use strict';
  if(conditional === 'in progress') {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('displayResults', function(countryObj) {
  'use strict';
  var gamesPlayed = countryObj.games_played || 0,
      wins = countryObj.wins || 0,
      draws = countryObj.draws || 0,
      loses= countryObj.loses || 0,
      points = countryObj.points || 0,
      group = countryObj.group_letter;

  var html = [countryObj.country, ' is in group ', group, ', with ', wins, ' win/s, ',
  loses, ' loses and ', draws, ' draw/s in ', gamesPlayed,
  ' games played. Total points: ', points, '.'];

  return html.join('');
});
