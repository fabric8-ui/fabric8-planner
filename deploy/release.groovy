#!/usr/bin/groovy
def ci (){
    stage('build planner npm'){
        container('ui'){
            sh 'npm install'
            sh 'npm run build'
            sh 'npm pack dist/'
        }
    }

    stage('unit test'){
        container('ui'){
            sh 'npm run test:unit'
        }
    }

    stage('func test'){
        dir('runtime'){
            container('ui'){
                sh '''
        npm install
        HEADLESS_MODE=true ./tests/run_functional_tests.sh smokeTest
'''
            }
        }
    }
}

def ciBuildDownstreamProject(project){
    stage('build fabric8-ui npm'){
        return buildSnapshotFabric8UI{
            pullRequestProject = project
        }
    }
}

def ciBuildPlannerProject(project){
     stage('build planner npm'){
        sh 'pwd'
        sh 'npm cache clean --force'
        sh '''
            export API_URL=https://api.prod-preview.openshift.io/api/
            export FORGE_URL=https://forge.api.prod-preview.openshift.io/
            export FABRIC8_REALM=fabric8-test
            export FABRIC8_WIT_API_URL=https://api.prod-preview.openshift.io/api/
            export FABRIC8_SSO_API_URL=https://sso.prod-preview.openshift.io/
            export FABRIC8_AUTH_API_URL=https://auth.prod-preview.openshift.io/api/
            export PROXY_PASS_URL=https://api.free-int.openshift.com
        '''
        sh 'npm install'
        sh 'env'
        sh 'npm run build'
    }

    stage('build runtime npm'){
        dir('runtime'){
            sh 'pwd'
            sh 'npm cache clean --force'
            sh 'npm install'
            // sh 'npm link ../dist/'
            sh 'env'
            sh 'npm run build:prod'
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

    // stage('build standalone fabric8-planner npm run build:prod'){
    //     return buildSnapshotStandalonePlanner{
    //         pullRequestProject = project
    //     }
    // }
}

def buildImage(imageName){
    stage('build snapshot image'){
        sh "cd fabric8-ui && docker build -t ${imageName} -f Dockerfile.deploy ."
    }

    stage('push snapshot image'){
        sh "cd fabric8-ui && docker push ${imageName}"
    }
}

def buildStandalonePlannerImage(imageName){
    stage('build standalone snapshot image'){
        // dir('runtime'){
            sh "pwd && cd fabric8-planner && pwd && docker build -t ${imageName} -f ./Dockerfile.deploy.runtime ."
        // }
    }

    stage('push standalone snapshot image'){
        sh "docker push ${imageName}"
    }
}

def cd (b){
    stage('fix git repo'){
        sh './scripts/fix-git-repo.sh'
    }

    stage('build'){
        sh 'npm install'
        sh 'npm run build'
    }

    stage('unit test'){
        sh 'npm run test:unit'
    }

    stage('func test'){
        dir('runtime'){
            container('ui'){
                sh '''
        npm install
        HEADLESS_MODE=true ./tests/run_functional_tests.sh smokeTest
    '''
            }
        }
    }

    stage('release'){
        def published = npmRelease{
            branch = b
        }
        return published
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
return this
