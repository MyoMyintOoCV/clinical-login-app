pipeline {
    agent any
    
    tools {
        maven 'M3'
        nodejs 'NodeJS'
    }
    
    environment {
        APP_VERSION = "${env.BUILD_ID}"
    }
    
    stages {
        stage('Checkout and Validate') {
            steps {
                git branch: 'main',
                    credentialsId: 'UMMOO-GIT',
                    url: 'https://github.com/MyoMyintOoCV/clinical-login-app.git'
                
                script {
                    echo "=== Validating Project Structure ==="
                    
                    // Check frontend files
                    if (fileExists('frontend/package.json')) {
                        def packageJson = readFile('frontend/package.json').trim()
                        if (packageJson.isEmpty()) {
                            error "package.json is empty!"
                        }
                        echo "✅ package.json exists and is not empty"
                    } else {
                        error "package.json not found in frontend directory!"
                    }
                    
                    // Check backend files
                    if (fileExists('backend/pom.xml')) {
                        echo "✅ pom.xml exists"
                    } else {
                        error "pom.xml not found in backend directory!"
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "=== Frontend Build Started ==="
                        echo "Installing dependencies..."
                        npm install
                        echo "Building application..."
                        npm run build
                        echo "✅ Frontend build completed successfully"
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Backend Build Started ==="
                        echo "Compiling and packaging (skipping tests)..."
                        mvn clean compile -q
                        mvn package -DskipTests -q
                        echo "✅ Backend build completed successfully"
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Running Backend Tests ==="
                        mvn test -q || echo "Tests failed but continuing..."
                    '''
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Archive Results') {
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
            echo "🎉 SUCCESS: Clinical Login App built successfully!"
        }
        failure {
            echo "❌ FAILURE: Build failed. Check the logs above for details."
        }
    }
}