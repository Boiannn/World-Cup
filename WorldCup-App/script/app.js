$(document).ready(function() {
  'use strict';

  var ONE_MINUTE = 1000 * 60,
      mathesData,
      teamResults;

  $.when(

    $.getJSON('http://worldcup.sfg.io/matches/today', function(matches) {
      mathesData = matches;
    }),
    $.getJSON('http://worldcup.sfg.io/teams/results', function(results) {
      teamResults = results;
    })

    ).then(function() {

      unifyCountryResults();
      generatePage();

      $('[data-toggle="popover"]').popover().on('click', function(ev) {
        // stop the page from scrolling up
        // when a link with href="#" is clicked
        ev.preventDefault();
      });

      updateMatchProgress();
      setTimeout(updatePage, ONE_MINUTE);

    });

  function unifyCountryResults() {
    var resultsByCountry = _.groupBy(teamResults, function(obj) {
        return obj.country;
      });

    mathesData.forEach(function(match) {
      var homeCountryResults = resultsByCountry[match.home_team.country],
          awayCountryResults = resultsByCountry[match.away_team.country],
          dataToBeUnified = ['games_played', 'wins', 'loses',
          'draws', 'points', 'group_letter'];

      if (homeCountryResults && awayCountryResults) {
        dataToBeUnified.forEach(function(prop) {
          match.home_team[prop] = homeCountryResults[0][prop];
          match.away_team[prop] = awayCountryResults[0][prop];
        });
      }
    });
  }

  function generatePage() {
    var source = $('#match-template').html(),
        template = Handlebars.compile(source),
        generatedHTML = template({
          matches: mathesData
        });

    $('#matches-container').empty();
    $('#matches-container').append(generatedHTML);
  }

  function updatePage() {
    $.getJSON('http://worldcup.sfg.io/matches/today', function(matches) {
      mathesData = matches;
      unifyCountryResults();
      generatePage();
      updateMatchProgress();
    });

    setTimeout(updatePage, ONE_MINUTE);
  }

  function updateMatchProgress() {
    var averagePeriodLength = 48,
        matchHalfTime = 15,
        averageMatchLength = 2 * averagePeriodLength + matchHalfTime,
        $progressDivs = $('.progress'),
        timeNow = new Date();

    $progressDivs.each(function(div) {

      var matchDateTime = new Date($(this).attr('data-datetime')),
          $progressBar = $(this).find('.progress-bar').first(),
          minutesPassedSinceMatchStart = (timeNow - matchDateTime) / ONE_MINUTE;

          if (minutesPassedSinceMatchStart > 0 &&
              (minutesPassedSinceMatchStart <= averagePeriodLength ||
              minutesPassedSinceMatchStart > averagePeriodLength + matchHalfTime)) {
            $progressBar.closest('.progress').removeClass('hidden');

            $(this).nextAll('p.time-left').removeClass('hidden')
            .find('span')
            .text(Math.floor(averageMatchLength - (minutesPassedSinceMatchStart + matchHalfTime)));

            $(this).nextAll('p.datetime').addClass('hidden');

            var minutesPassedAsPercent = (minutesPassedSinceMatchStart / averageMatchLength) * 100;
            $progressBar.width(minutesPassedAsPercent + '%');
          }

          if (minutesPassedSinceMatchStart > averageMatchLength) {
            $progressBar.closest('.progress').addClass('hidden');
            $(this).nextAll('p.time-left').addClass('hidden');
            $(this).nextAll('p.datetime').removeClass('hidden');
          }
    });

    setTimeout(updateMatchProgress, 1000*60);
  }

});
