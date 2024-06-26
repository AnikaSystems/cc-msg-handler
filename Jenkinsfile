pipeline {
    agent any
    tools {nodejs "nodejs"}
    stages {
         stage('Clone repository') { 
            steps { 
                script{
                checkout scm
                }
            }
        }
        
        stage('Download dependencies') { 
            steps { 
                sh 'npm install'
            }
        }

        stage('Build') { 
            steps {
                sh 'rm -rf build'
                sh 'rm -rf package'
                sh 'mkdir build'
                sh 'mkdir package'
                sh 'cp index.js build/index.js'
                sh 'cp -r node_modules build/node_modules'
                zip zipFile: 'package/cc-message-handler.zip', archive: false, dir: 'build'
            }
        }

        stage('archiving artifacts into AWS s3') {
            steps {
                withAWS(region:'us-east-1',credentials:'aws-mo') {
                    s3Delete(bucket:'cc-message-handler', path:'/')
                    s3Upload(bucket:"cc-message-handler", workingDir:'package/', includePathPattern:'**/*');
                }
            }
        }
    }
}