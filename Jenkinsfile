pipeline {
    agent any
    
    tools {
        maven 'M3'
        nodejs 'NodeJS'
    }
    
    environment {
        DOCKER_REGISTRY = 'clinical-registry'
        APP_VERSION = "${env.BUILD_ID}"
        NODE_ENV = 'production'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    
    stage('Checkout') {
    steps {
        git branch: 'main',
            url: 'git@github.com:MyoMyintOoCV/clinical-login-app.git',
            credentialsId: 'jenkins-ssh-key'
    }
}
    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    credentialsId: 'UMMOO-GIT', // Use your existing credential
                    url: 'https://github.com/MyoMyintOoCV/clinical-login-app.git' // Your actual repo
            }
        }
        
        stage('Environment Check') {
            steps {
                sh '''
                    echo "=== Environment Verification ==="
                    echo "Java Version:"
                    java -version
                    echo "Maven Version:"
                    mvn -version
                    echo "Node Version:"
                    node --version
                    echo "NPM Version:"
                    npm --version
                    echo "Git Version:"
                    git --version
                '''
            }
        }
        
        stage('Frontend Build & Test') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "=== Frontend Build ==="
                        npm install
                        npm run build
                        echo "Frontend build completed successfully"
                    '''
                }
            }
        }
        
        stage('Backend Build & Test') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Backend Build ==="
                        mvn clean compile
                        mvn test
                        mvn package -DskipTests
                        echo "Backend build completed successfully"
                    '''
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
            }
        }
    }
    
    post {
        always {
            echo "Build completed with status: ${currentBuild.result}"
            cleanWs()
        }
        success {
            echo "🎉 Build succeeded!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}