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
                    
                    // List Java files to verify structure
                    sh '''
                        echo "=== Backend Java Files ==="
                        find backend/src -name "*.java" | head -10
                    '''
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
        
        stage('Build Backend - Compile Only') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Backend Compilation ==="
                        echo "Compiling main source code..."
                        # Use compile-only goal that doesn't compile tests
                        mvn compile -q
                        echo "✅ Backend compilation successful"
                    '''
                }
            }
        }
        
        stage('Package Backend - Skip Tests') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Backend Packaging ==="
                        echo "Packaging application (skipping tests)..."
                        mvn package -DskipTests -q
                        echo "✅ Backend packaging successful"
                        
                        echo "Generated JAR file:"
                        ls -la target/*.jar
                    '''
                }
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
                
                sh '''
                    echo "=== Build Artifacts ==="
                    echo "Backend JAR:"
                    ls -la backend/target/*.jar || echo "No JAR file found"
                    echo "Frontend build:"
                    ls -la frontend/build/ || echo "No frontend build found"
                '''
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