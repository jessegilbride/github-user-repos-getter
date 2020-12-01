'use strict';

// const apiKey = ???;

function generateListItem(repoItem) {
  return `
  <li>
    <h3>
      <a href=${repoItem.html_url} target=_blanks>${repoItem.name}</a>
    </h3>
  </li>`
}

function generateListItemString(jsonData) {
  const repoListString = jsonData.map(repoItem => generateListItem(repoItem));
  return repoListString.join('');
}

function noReposFound() {
  return `
  <p>(This user has no repositories.)</p>`
}

function displayRepos(jsonData) {
  $('#results').removeClass('hidden');
  if (jsonData.length === 0) {
    $('#js-repo-list').append(noReposFound());
  }
  else {
    const repoList = generateListItemString(jsonData);
    $('#js-repo-list').append(repoList);
  }
}

function getRepos(username) {
  let searchURL = `https://api.github.com/users/${username}/repos`;

  // get API data
  fetch(searchURL)
  .then(
    response => {
    // if response is okay, convert it to JSON
    if (response.ok) {
      return response.json();
    }
    // else log an error
    throw new Error(response.statusText);
  })
  .then(
    // add repo info (in JSON) to the DOM
    responseJSON => displayRepos(responseJSON)
  )
  .catch(
    // display the error to the user
    error => {
      $('#results').addClass('hidden');
      $('#js-error-message').text(`Sorry, user ${error.message.toLowerCase()}`);
    }
  );
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    
    // clear prior results
    $('#js-error-message').empty();
    $('#js-repo-list').empty();

    const username = $('#js-username').val();
    getRepos(username);
  });
}

$(watchForm);