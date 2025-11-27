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
    
    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    credentialsId: 'UMMOO-GIT',
                    url: 'https://github.com/MyoMyintOoCV/clinical-login-app.git'
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
                    echo "Current directory:"
                    pwd
                    echo "Workspace contents:"
                    ls -la
                '''
            }
        }
        
        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "=== Frontend Build ==="
                        echo "Installing dependencies..."
                        npm install
                        echo "Building application..."
                        npm run build
                        echo "Frontend build completed successfully"
                        echo "Build directory contents:"
                        ls -la build/
                    '''
                }
            }
        }
        
        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Backend Build ==="
                        echo "Compiling..."
                        mvn clean compile
                        echo "Running tests..."
                        mvn test
                        echo "Packaging..."
                        mvn package -DskipTests
                        echo "Backend build completed successfully"
                        echo "Target directory contents:"
                        ls -la target/
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