pipeline {
    agent any
    tools{
        nodejs 'node18'
    }
    
    environment{
        SCANNER_HOME= tool 'sonar-scanner'
    }
    
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/viddhant1205/event-management.git'
            }
        }

         stage('Trivy FS Scan') {
            steps {
                sh "trivy fs ."
            }
        }
        
        stage('OWASP Scan') {
            steps {
                dependencyCheck additionalArguments: ' --scan ./ ', odcInstallation: 'DC'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Sonarqube') {
            steps {
                withSonarQubeEnv('sonar-server'){
                   sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=event-management-app \
                   -Dsonar.projectKey=event-management-app  '''
               }
            }
        }

       stage('Build & Tag Docker Image') {
            steps {
                script{
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh "docker build -t event-management:latest ."
                        sh "docker tag  event-management:latest kubegourav/event-management:latest"
                    }
                }
            }
        }

       stage('Trrivy Image Scan') {
            steps {
                sh "trivy image kubegourav/event-management:latest"
            }
        }
        
       stage('Push Docker Image') {
            steps {
                script{
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh "docker push kubegourav/event-management:latest"
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script{
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh "docker run -d -p 3000:80 kubegourav/event-management:latest"
                    }
                }
            }
        }

        
        }   
    }
