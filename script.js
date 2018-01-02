// Populate repo stats
$.get("https://api.github.com/repos/fabric8-ui/fabric8-planner", function (response) {
  var watches = response.watchers_count
    , stars   = response.stargazers_count
    , forks   = response.forks_count
    ;

  $(document).ready(function() {
    $("#repoWatches").text(watches);
    $("#repoStars").text(stars);
    $("#repoForks").text(forks);

    $("#repoDetails").css({ display: "flex" });
  });
})