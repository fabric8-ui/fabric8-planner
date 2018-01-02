// Populate repo stats
$.get("https://api.github.com/repos/fabric8-ui/fabric8-planner", function (response) {
  var watches = response.watchers_count,
      stars   = response.stargazers_count,
      forks   = response.forks_count;

  $(document).ready(function() {
    $("#repoWatches").text(watches);
    $("#repoStars").text(stars);
    $("#repoForks").text(forks);

    $("#repoInfo .spinner").remove();
    $("#repoDetails").css({ display: "flex" });
  });
})

// Populate contributor details
$.get("https://api.github.com/repos/fabric8-ui/fabric8-planner/contributors", function (contributors) {
  var contributorList = [];

  for (var contributor of contributors) {
    contributorList.push(contributor.login)
  }

  $(document).ready(function() {
    $("#repoContrib").text(contributorList.join(", "));
  });
})
