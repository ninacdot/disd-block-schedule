var $ = jQuery

/**
 * Get a list of holidays.
 */
function getHolidays() {
  var jqXHR = $.ajax({
    url: '/holidays.json',
    type: 'GET',
    async: false,
  })
  return JSON.parse(jqXHR.responseText)
}

/**
 * Assign the cohorts.
 * @param {*} isOdd
 */
function getCohort(isOdd) {
  isOdd = isOdd || false
  var even = {
    1: 'At School',
    2: 'Remote',
  }
  var odd = {
    1: 'Remote',
    2: 'At School',
  }
  return isOdd ? odd : even
}

/**
 * Determine if day is A or B.
 * @param {int} day
 */
function getAorB(day) {
  if (day == 1 || day == 2) {
    return 'A'
  }
  if (day == 3 || day == 4) {
    return 'B'
  }
  return ''
}

/**
 * Render text on page.
 * @param {object} textObj
 */
function render(textObj) {
  console.log(textObj)
  var block = $('#block-day')
  if (textObj.hasOwnProperty('letter')) {
    $('#letter h1', block).html(textObj.letter)
    $(document.body).addClass(textObj.letter)
  }
  if (textObj.hasOwnProperty('cohort') && textObj.cohort[1] !== undefined) {
    $('#cohort-1 h3', block).html('Cohort 1: ' + textObj.cohort[1])
    $('#cohort-2 h3', block).html('Cohort 2: ' + textObj.cohort[2])
  }
  if (textObj.hasOwnProperty('text')) {
    $('#text p', block).html(textObj.text)
  }
}

// Define some variables.
var disdCalendar = 'https://www.dentonisd.org/Page/2'
var today = moment()
// DEBUG (fake date)
// today = moment([2020, 09, 15])
var day = Math.abs(today.format('d'))
var holidays = getHolidays()
var renderText = {
  letter: getAorB(day),
  cohort: '',
  text: '',
}

// THIS SHOULD NEVER CHANGE (except for each new semester)
var cohortGenesis = moment([2020, 09, 11])
// THIS SHOULD NEVER CHANGE

// To calculate the no. of days between two dates
var day_diff = today.diff(cohortGenesis, 'days')
console.log(day_diff)

// Switch on Days
renderText.cohort = getCohort()
switch (day) {
  // Mon/Weds
  case 1:
  case 3:
    // do nothing?
    break

  // Tues/Thurs
  case 2:
  case 4:
    renderText.cohort = getCohort(true)
    break

  // Friday
  case 5:
    // Calculate Friday Cohort
    weeks_since = day_diff / 7
    if (weeks_since % 2 === 1) {
      renderText.cohort = getCohort(true)
    }

    break

  // Weekend
  case 0:
  case 6:
    renderText.cohort = ''
    renderText.letter = ''
    renderText.text = "It's the weekend!"
    break
}

// Check Holiday
if (holidays.hasOwnProperty(today.format('L'))) {
  // Holiday exists.
  renderText = { text: holidays(today.format('L')) }
}

// Render data
render(renderText)
