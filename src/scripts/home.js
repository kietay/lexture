$(document).ready(function() {
  $('#lexture-search-btn').click(function() {
    // todo grab search bar input and send as query
    let searchTerm = $('#lexture-search-bar').val()
    const params = jQuery.param({
      searchq: searchTerm,
    })
    console.log(`Searching for ${searchTerm}`)
    window.location.href = '/search?' + params
    return false
  })
})
