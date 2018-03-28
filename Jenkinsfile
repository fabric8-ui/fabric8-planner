@Library('github.com/fabric8io/fabric8-pipeline-library@chmod')
def utils = new io.fabric8.Utils()
def flow = new io.fabric8.Fabric8Commands()
def project = 'fabric8-ui/fabric8-planner'
def tempVersion
def imageName
node{
    properties([
        disableConcurrentBuilds()
        ])
}

fabric8UITemplate{
    dockerNode{
        ws {
            timeout(time: 1, unit: 'HOURS') {
                checkout scm

                ci()

                if (utils.isCI()){

                    tempVersion = buildF8UI(project)

                    imageName = "fabric8/fabric8-ui:${tempVersion}"
                    container('docker'){
                        buildImage(imageName)
                    }

                    // deploy a snapshot fabric8-ui pod and notify pull request of details
                    def prj = 'fabric8-ui-'+ env.BRANCH_NAME
                    prj = prj.toLowerCase()
                    def route
                    timeout(time: 10, unit: 'MINUTES') {
                        deployOpenShiftNode(openshiftConfigSecretName: 'fabric8-intcluster-config'){
                            stage("deploy ${prj}"){
                                route = deployOpenShiftSnapshot{
                                    mavenRepo = 'http://central.maven.org/maven2/io/fabric8/online/apps/fabric8-ui'
                                    githubRepo = 'fabric8-ui'
                                    originalImageName = 'registry.devshift.net/fabric8-ui/fabric8-ui'
                                    newImageName = imageName
                                    openShiftProject = prj
                                    githubProject = project
                                }
                            }
                            stage('notify'){
                                def changeAuthor = env.CHANGE_AUTHOR
                                if (!changeAuthor){
                                    error "no commit author found so cannot comment on PR"
                                }
                                def pr = env.CHANGE_ID
                                if (!pr){
                                    error "no pull request number found so cannot comment on PR"
                                }
                                def message = "@${changeAuthor} ${imageName} is deployed and available for testing at https://${route}"
                                container('clients'){
                                    flow.addCommentToPullRequest(message, pr, project)
                                }
                            }
                        }
                    }

                } else if (utils.isCD()){

                    def branch
                    container('ui'){
                        branch = utils.getBranch()
                    }

                    def published
                    container('ui'){

                        stage('Repo Fix'){
                            sh './scripts/fix-git-repo.sh'
                        }

                        stage('Setup & Build'){
                            sh 'npm install'
                            sh 'npm run build'
                        }

                        stage('Unit Tests'){
                            sh 'npm run tests -- --unit'
                        }

                        stage('Functional Tests'){
                            container('ui'){
                                sh '''
                                npm cache clean --force
                                npm cache verify
                                npm install
                                DEBUG=true HEADLESS_MODE=true ./scripts/run-functests.sh smokeTest
                            '''
                            }
                        }

                        stage('Release'){
                            published = npmRelease{
                                branch = branch
                            }
                        }
                    }

                    def releaseVersion
                    container('ui'){
                        releaseVersion = utils.getLatestVersionFromTag()
                    }

                    if (published){
                        updateDownstreamProjects(releaseVersion)
                    }
                }
            }
        }
    }
}

def ci (){
    stage('Setup & Build'){
        container('ui'){
            sh 'npm cache clean --force'
            sh 'npm cache verify'
            sh 'npm install'
            sh 'npm run build'
            sh 'npm pack dist/'
        }
    }

    stage('Unit Tests'){
        container('ui'){
            sh 'npm run tests -- --unit'
            sh 'scripts/upload_to_codecov.sh'
        }
    }

    stage('Functional Tests'){
        container('ui'){
            sh '''
            npm cache clean --force
            npm cache verify
            npm install
            DEBUG=true HEADLESS_MODE=true ./scripts/run-functests.sh
        '''
        }
    }
}

def buildF8UI(project){
    def tempVersion
    stage('Build fabric8-ui'){
        container('ui'){
            tempVersion = buildSnapshotFabric8UI{
                pullRequestProject = project
            }
        }
    }
    return tempVersion
}

def buildImage(imageName){
    stage('Snapshot Image'){
        sh "cd fabric8-ui && docker build -t ${imageName} -f Dockerfile.deploy ."
        sh "cd fabric8-ui && docker push ${imageName}"
    }
}

def updateDownstreamProjects(v){
    echo 'we would Update Downstream Projects'
    pushPackageJSONChangePR{
        propertyName = 'fabric8-planner'
        projects = [
                'fabric8-ui/fabric8-npm-dependencies'
        ]
        version = v
        containerName = 'ui'
        autoMerge = true
    }
}
