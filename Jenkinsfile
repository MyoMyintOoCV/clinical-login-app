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
                    
                    // List project structure
                    sh '''
                        echo "=== Project Structure ==="
                        find . -name "*.json" -o -name "*.xml" -o -name "*.java" -o -name "*.js" | head -20
                        echo ""
                        echo "=== Frontend Structure ==="
                        ls -la frontend/ || echo "No frontend directory"
                        ls -la frontend/src/ || echo "No src directory"
                        echo ""
                        echo "=== Backend Structure ==="
                        ls -la backend/ || echo "No backend directory"
                        ls -la backend/src/ || echo "No src directory"
                    '''
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "=== Frontend Build Started ==="
                        echo "Current directory:"
                        pwd
                        echo "package.json content:"
                        cat package.json
                        echo ""
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
                        echo "Compiling..."
                        mvn clean compile
                        echo "Running tests..."
                        mvn test
                        echo "Packaging..."
                        mvn package -DskipTests
                        echo "✅ Backend build completed successfully"
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