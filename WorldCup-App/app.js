$(document).ready(function() {
  'use strict';

  $.getJSON('http://worldcup.sfg.io/matches/today', function(matches) {

    generateMatches(matches);
    parseDates();

  });

  function generateMatches(allMatches) {
    var source = $('#match-template').html(),
        template = Handlebars.compile(source),
        generatedHTML = template({
          matches: allMatches
        });

    $('#matches-container').append(generatedHTML);
  }

  function parseDates() {
    var dates = $('#matches-container').find('.datetime');

    dates.each(function() {
      var parsedDate = new Date($(this).text()),
          options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'};

      $(this).text(parsedDate.toLocaleString('bg-BG', options));
    });
  }

});
