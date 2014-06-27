$(document).ready(function() {
  'use strict';

  var mathesData,
      teamResults;

  $.when(

    $.getJSON('http://worldcup.sfg.io/matches', function(matches) {
      mathesData = matches.slice(0, 11);
    }),
    $.getJSON('http://worldcup.sfg.io/teams/results', function(results) {
      teamResults = results;
    })

    ).then(function() {

      var resultsByCountry = _.groupBy(teamResults, function(obj) {
        return obj.country;
      });

      unifyMatachesAndResults(resultsByCountry);

      generatePage(mathesData, resultsByCountry);

      $('[data-toggle="popover"]').popover().on('click', function(ev) {
        // stop the page from scrolling up
        // when a link with href="#" is clicked
        ev.preventDefault();
      });

    });

  function unifyMatachesAndResults(result) {
    mathesData.forEach(function(match) {
      var homeCountryResults = result[match.home_team.country],
          awayCountryResults = result[match.away_team.country];

      if (homeCountryResults && awayCountryResults) {
        match.home_team.games_played = homeCountryResults[0].games_played;
        match.home_team.wins = homeCountryResults[0].wins;
        match.home_team.loses = homeCountryResults[0].loses;
        match.home_team.draws = homeCountryResults[0].draws;
        match.home_team.points = homeCountryResults[0].points;
        match.home_team.group_letter = homeCountryResults[0].group_letter;

        match.away_team.games_played = awayCountryResults[0].games_played;
        match.away_team.wins = awayCountryResults[0].wins;
        match.away_team.loses = awayCountryResults[0].loses;
        match.away_team.draws = awayCountryResults[0].draws;
        match.away_team.points = awayCountryResults[0].points;
        match.away_team.group_letter = awayCountryResults[0].group_letter;
      }
    });
  }

  function generatePage(mathes, results) {
    var source = $('#match-template').html(),
        template = Handlebars.compile(source),
        generatedHTML = template({
          matches: mathes,
          results: results
        });

    $('#matches-container').append(generatedHTML);
  }

});
