#!/usr/bin/groovy
def ci (){
    stage('build planner npm'){
        container('ui'){
            sh '''
            top -n2
            free -m
            npm cache clean --force
            npm install
            top -n2
            free -m
            npm run build
            npm pack dist/
            top -n2
            free -m
            '''
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
            top -n2
            free -m
        npm cache clean --force
        top -n2
        free -m
        npm install
        top -n2
        free -m
        cd src/tests/functionalTests
        top -n2
        free -m
        DEBUG=true HEADLESS_MODE=true ./run_ts_functional_tests.sh smokeTest
        top -n2
        free -m
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

def buildImage(imageName){
    stage('build snapshot image'){
        sh "cd fabric8-ui && docker build -t ${imageName} -f Dockerfile.deploy ."
    }

    stage('push snapshot image'){
        sh "cd fabric8-ui && docker push ${imageName}"
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
        npm cache clean --force
        npm install
        cd src/tests/functionalTests
        DEBUG=true HEADLESS_MODE=true ./run_ts_functional_tests.sh smokeTest
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
