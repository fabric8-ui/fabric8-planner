#!/bin/bash

# This file is supposed to be executed by CICO build (ci.centos.org/view/Devtools/)
# It will:
#   1. Build fabric8-planner 
#   2. Update Tag on github
#   3. Push fabric8-planner to npmjs.org
#   4. Create PR with new planner version on fabric8-npm-dependencies repo
#   5. Merge the PR on fabric8-npm-dependencies repo

# Show command before executing
set -x

# Exit on error
set -e

function main {
    # Source environment variables of the jenkins slave
    # that might interest this worker.
    if [ -e "jenkins-env" ]; then
    cat jenkins-env \
        | grep -E "(JENKINS_URL|DEVSHIFT_USERNAME|DEVSHIFT_PASSWORD|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId)=" \
        | sed 's/^/export /g' \
        > /tmp/jenkins-env
    source /tmp/jenkins-env
    fi

    # # We need to disable selinux for now, XXX
    /usr/sbin/setenforce 0

    export GH_TOKEN=""
    export NPM_TOKEN=""

    # Build and Release Planner (It will update the tag on github and push fabric8-planner to npmjs.org)
    npm run semantic-release

    # extract version number from latest git tag
    new_planner_version=$(git tag --sort=-v:refname | head -1 | cut -d'v' -f 2)

    # Create PR on fabric8-npm-dependencies and merge it
    repo="fabric8-npm-dependencies"
    org="jarifibrahim" #"fabric8-ui"
    project="${org}/${repo}"
    baseUrl="https://api.github.com/repos"
    id=$(uuidgen)
    git clone "https://github.com/${project}.git"
    cd ${repo} && git checkout -b versionUpdate"${id}"

    # find fabric8-planner > extract version number > remove ", char > trim whitespacs
    current_planner_version=$( grep my-test123 package.json \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[:space:]' )
    echo $new_planner_version
    echo $current_planner_version
    if [ "$new_planner_version" == "$current_planner_version" ]; then
        echo "Skippping as my-test123 is already on version $new_planner_version"
        exit 0
    fi

    git config --global user.email fabric8-admin@googlegroups.com
    git config --global user.name fabric8-release

    message="fix(version): update package.json fabric8-planner to ${new_planner_version}"
    updatePackageJSONVersion "$new_planner_version"
    git add package.json
    git commit -m \""${message}"\"
    git push origin versionUpdate"${id}"
    local body="{
        \"title\": \"${message}\",
        \"head\": \"versionUpdate${id}\",
        \"base\": \"master\"
        }"

    apiUrl="${baseUrl}/${project}/pulls"
    echo "Creating PR for ${apiUrl}"
    PR_id=$(curl --silent -X POST -H "Authorization: Bearer $GH_TOKEN" -d "${body}" "${apiUrl}" \
            | sed -n 's/.*"number": \(.*\),/\1/p' )
    echo "Received PR id: ${PR_id}"

    # Wait for all CI checks on PR to be successful
    waitUntilSuccess "${PR_id}" "${project}"

    # Merge PR
    apiUrl="${baseUrl}/${project}/pulls/${PR_id}/merge"
    echo "Merging PR ${PR_id}"
    curl --silent -X PUT -H "Authorization: Bearer $GH_TOKEN" "${apiUrl}"
}

# Updates fabric8-planner's version in package.json file
function updatePackageJSONVersion {
    local f="package.json"
    local p="my-test123"
    local v=$1
    sed -i -r "s/\"${p}\": \"[0-9][0-9]{0,2}.[0-9][0-9]{0,2}(.[0-9][0-9]{0,2})?(.[0-9][0-9]{0,2})?(-development)?\"/\"${p}\": \"${v}\"/g" ${f}
}

# Wait for all CI checks to pass
function waitUntilSuccess {
    pr_id=$1
    project=$2
    ref=$( curl --silent -X GET https://api.github.com/repos/"${project}"/pulls/"${pr_id}" \
           | sed -n 's/.*"ref": "\(.*\)",/\1/p' | head -1) # Extract "ref" value from the response
    status="NA"
    NEXT_WAIT_TIME=0
    until [ "$status" == "success" ] || [ $NEXT_WAIT_TIME -eq 25 ]; do
        status=$( curl --silent -X GET https://api.github.com/repos/"${project}"/commits/"${ref}"/status \
                  | sed -n 's/.*"state": "\(.*\)",/\1/p')  # Extract "state" value from the response
        echo "Pull Request status: ${status}.  Waiting to merge..."
        sleep $(( NEXT_WAIT_TIME++ ))
    done
}

main