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
                sh 'cp index.js build/index.js'
                sh 'cp node_modules build/node_modules'
            }
        }

        stage('archiving artifacts into AWS s3') {
            steps {
                withAWS(region:'us-east-1',credentials:'aws-mo') {
                    s3Delete(bucket:'cc-message-handler', path:'/')
                    s3Upload(bucket:"cc-message-handler", workingDir:'build/', includePathPattern:'**/*');
                }
            }
        }
    }
}