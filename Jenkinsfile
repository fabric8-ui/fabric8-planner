@Library('github.com/pranavgore09/fabric8-pipeline-library@standalone-planner')
def utils = new io.fabric8.Utils()
def flow = new io.fabric8.Fabric8Commands()
def project = 'fabric8-ui/fabric8-planner'
def ciDeploy = false
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
            timeout(time: 45, unit: 'MINUTES') {
                checkout scm
                readTrusted 'deploy/release.groovy'
                def pipeline = load 'deploy/release.groovy'
                if (utils.isCI()){

                    // build standalone planner
                    imageName = "fabric8/fabric8-planner:standalone"
                    // container('ui'){
                    //     tempVersion = pipeline.ciBuildPlannerProject(project)
                    // }
                    container('ui'){
                        stage('build planner npm'){
                            sh '''
                                npm cache clean --force
                                export API_URL=https://api.prod-preview.openshift.io/api/
                                export FORGE_URL=https://forge.api.prod-preview.openshift.io/
                                export FABRIC8_REALM=fabric8-test
                                export FABRIC8_WIT_API_URL=https://api.prod-preview.openshift.io/api/
                                export FABRIC8_SSO_API_URL=https://sso.prod-preview.openshift.io/
                                export FABRIC8_AUTH_API_URL=https://auth.prod-preview.openshift.io/api/
                                export PROXY_PASS_URL=https://api.free-int.openshift.com
                                npm install
                                env
                                npm run build
                            '''
                        }

                        stage('build runtime npm'){
                            dir('runtime'){
                                sh 'pwd'
                                sh 'npm cache clean --force'
                                sh 'npm install'
                                // sh 'npm link ../dist/'
                                sh 'env'
                                sh '''
                                    export API_URL=https://api.prod-preview.openshift.io/api/
                                    export FORGE_URL=https://forge.api.prod-preview.openshift.io/
                                    export FABRIC8_REALM=fabric8-test
                                    export FABRIC8_WIT_API_URL=https://api.prod-preview.openshift.io/api/
                                    export FABRIC8_SSO_API_URL=https://sso.prod-preview.openshift.io/
                                    export FABRIC8_AUTH_API_URL=https://auth.prod-preview.openshift.io/api/
                                    export PROXY_PASS_URL=https://api.free-int.openshift.com
                                    npm run build
                                '''
                            }
                        }

                        imageName = "fabric8/fabric8-planner:standalone"
                        stage('build standalone snapshot image'){
                            container('docker'){
                                sh 'pwd'
                                sh "docker build -t ${imageName} -f ./Dockerfile.deploy.runtime ."
                            }
                        }

                        stage('push standalone snapshot image'){
                            container('docker'){
                                sh 'pwd'
                                sh "docker push ${imageName}"
                            }
                        }
                    }
                    // ciDeploy = true

                } else if (utils.isCD()){
                    sh "git checkout master"
                    sh "git pull"
                    sh "git remote set-url origin git@github.com:${project}.git"

                    sh "skip following content, not needed as of now"
                    // container('ui'){
                    //     pipeline.ci()
                    // }

                    // def branch
                    // container('ui'){
                    //     branch = utils.getBranch()
                    // }

                    // def published
                    // container('ui'){
                    //     published = pipeline.cd(branch)
                    // }

                    // def releaseVersion
                    // container('ui'){
                    //     releaseVersion = utils.getLatestVersionFromTag()
                    // }

                    // if (published){
                    //     pipeline.updateDownstreamProjects(releaseVersion)
                    // }
                }
            }
        }
    }
}

// deploy a snapshot fabric8-ui pod and notify pull request of details
if (ciDeploy){
   def prj = 'fabric8-ui-'+ env.BRANCH_NAME
   prj = prj.toLowerCase()
   def route
   deployOpenShiftNode(openshiftConfigSecretName: 'fabric8-intcluster-config'){
    //    stage("deploy ${prj}"){
    //        route = deployOpenShiftSnapshot{
    //            mavenRepo = 'http://central.maven.org/maven2/io/fabric8/online/apps/fabric8-ui'
    //            githubRepo = 'fabric8-ui'
    //            originalImageName = 'registry.devshift.net/fabric8-ui/fabric8-ui'
    //            newImageName = imageName
    //            openShiftProject = prj
    //            githubProject = project
    //        }
    //    }
    //    stage('notify'){
    //        def changeAuthor = env.CHANGE_AUTHOR
    //        if (!changeAuthor){
    //            error "no commit author found so cannot comment on PR"
    //        }
    //        def pr = env.CHANGE_ID
    //        if (!pr){
    //            error "no pull request number found so cannot comment on PR"
    //        }
    //        def message = "@${changeAuthor} ${imageName} is deployed and available for testing at https://${route}"
    //        container('clients'){
    //            flow.addCommentToPullRequest(message, pr, project)
    //        }
    //    }
        prj = 'fabric8-planner-'+ env.BRANCH_NAME
        prj = prj.toLowerCase()
        stage("deploy ${prj}"){
           route = deployOpenShiftSnapshot{
               mavenRepo = 'http://central.maven.org/maven2/io/fabric8/online/apps/fabric8-planner'
               githubRepo = 'fabric8-planner'
               originalImageName = 'docker.io/almightyui/almighty-ui:demo'
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
