$(document).ready(function() {
  'use strict';

  $.getJSON('http://worldcup.sfg.io/matches', function(matches) {

    generateMatches(matches);
    $('[data-toggle="popover"]').popover();

  });

  function generateMatches(allMatches) {
    var source = $('#match-template').html(),
        template = Handlebars.compile(source),
        generatedHTML = template({
          matches: allMatches
        });

    $('#matches-container').append(generatedHTML);
  }

});
