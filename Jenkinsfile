pipeline {
    agent any
    
    tools {
        maven 'M3'
        nodejs 'NodeJS'
    }
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        APP_VERSION = "${env.BUILD_ID}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/your-username/clinical-login-app.git'
            }
        }
        
        stage('Frontend Build & Test') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'npm test -- --coverage --watchAll=false'
                }
            }
        }
        
        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    sh 'mvn clean compile'
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Backend Package') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build Backend Docker image
                    docker.build("${DOCKER_REGISTRY}/clinical-backend:${APP_VERSION}", './backend')
                    
                    // Build Frontend Docker image
                    docker.build("${DOCKER_REGISTRY}/clinical-frontend:${APP_VERSION}", './frontend')
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://your-registry.com', 'docker-credentials') {
                        docker.image("${DOCKER_REGISTRY}/clinical-backend:${APP_VERSION}").push()
                        docker.image("${DOCKER_REGISTRY}/clinical-frontend:${APP_VERSION}").push()
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                script {
                    // Add your deployment steps here
                    echo "Deploying version ${APP_VERSION} to staging environment"
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The build ${env.BUILD_URL} completed successfully.",
                to: "dev-team@yourcompany.com"
            )
        }
        failure {
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The build ${env.BUILD_URL} failed. Please check the console output.",
                to: "dev-team@yourcompany.com"
            )
        }
    }
}