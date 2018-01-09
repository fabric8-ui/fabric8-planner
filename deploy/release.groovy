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
    stage('build standalone fabric8-planner npm run build:prod'){
        return buildSnapshotStandalonePlanner{
            pullRequestProject = project
        }
    }
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
