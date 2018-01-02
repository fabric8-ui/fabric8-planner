// Populate repo stats
$.get("https://api.github.com/repos/fabric8-ui/fabric8-planner", function (response) {
  var watches = response.watchers_count,
      stars   = response.stargazers_count,
      forks   = response.forks_count;

  $(document).ready(function() {
    $("#repoWatches").text(watches);
    $("#repoStars").text(stars);
    $("#repoForks").text(forks);

    $("#repoDetails").css({ display: "flex" });
  });
})

// Populate contributor details
$.get("https://api.github.com/repos/fabric8-ui/fabric8-planner/contributors", function (contributors) {

  $(document).ready(function () {
    if ('content' in document.createElement('template')) {

      var contribCard = document.getElementById("contributorCardTemplate");

      var theirPhoto = contribCard.content.querySelector("img"),
          theirTitle = contribCard.content.querySelector(".card-title a"),
          theirWorks = contribCard.content.querySelector(".card-subtitle");

      for (var i=0; i<8; i++) {
        var contributor = contributors[i];

        theirPhoto.src = contributor.avatar_url;
        theirTitle.href = contributor.html_url;
        theirTitle.innerText = contributor.login;
        theirWorks.innerText = "" + contributor.contributions + " Contributions";

        var templateClone = document.importNode(contribCard.content, true);
        document.getElementById("contributorList").appendChild(templateClone);
      }
    } // @TODO: else {}

    $("#noContributors").remove();
    $("#contributors").show();
  })

});
