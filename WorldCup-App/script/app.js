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
      updateMatchScore();
      updateMatchProgress();
    });

    setTimeout(updatePage, ONE_MINUTE);
  }

  function updateMatchScore() {
    var $allMatches = $('.jumbotron');

    $allMatches.each(function(index) {
      var $homeTeamScore = $(this).find('span.score.home-team'),
          $awayTeamScore = $(this).find('span.score.away-team');

      $homeTeamScore.text(mathesData[index].home_team.goals);
      $awayTeamScore.text(mathesData[index].away_team.goals);
    });
  }

  function updateMatchProgress() {
    var averagePeriodLength = 48,
        matchHalfTime = 15,
        averageMatchLength = 2 * averagePeriodLength + matchHalfTime,
        timeNow = new Date(),
        $allMatches = $('.jumbotron');

    $allMatches.each(function() {
      var $match = $(this),
          matchDateTime = new Date($match.attr('data-datetime')),
          minutesPassedSinceMatchStart = (timeNow - matchDateTime) / ONE_MINUTE,
          minutesPassedAsPercent = (minutesPassedSinceMatchStart / averageMatchLength) * 100,
          $progressBar = $match.find('.progress-bar').first();

          if (isMatchInProgress(minutesPassedSinceMatchStart, averageMatchLength)) {
            $match.find('p.match-datetime').hide();

            if (isMatchInHalfTime(minutesPassedSinceMatchStart,
                averagePeriodLength, matchHalfTime)) {

              $match.find('p.match-time-left').find('span').text('Half Time');
            } else {

              $match.find('p.match-time-left').find('span')
              .text(Math.floor(averageMatchLength -
                (matchHalfTime + minutesPassedSinceMatchStart)));
            }

            $progressBar.width(minutesPassedAsPercent + '%');
          } else {
            $match.find('div.progress').hide();
            $match.find('p.match-time-left').hide();
            $match.nextAll('p.match-datetime').show();
          }
    });
  }

  function isMatchInProgress(minutesPassed, matchLength) {
    return 0 < minutesPassed && minutesPassed <= matchLength;
  }

  function isMatchInHalfTime(passedMinutes, periodLength, halfTimeLenght) {
    return periodLength < passedMinutes &&
                          passedMinutes < periodLength + halfTimeLenght;
  }

});
