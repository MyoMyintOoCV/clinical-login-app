pipeline {
    agent any
    
    tools {
        maven 'M3'
        nodejs 'NodeJS'
    }
    
    environment {
        APP_VERSION = "${env.BUILD_ID}"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_NAMESPACE = 'ummoo'
        FRONTEND_IMAGE_NAME = "clinical-login-frontend"
        BACKEND_IMAGE_NAME = "clinical-login-backend"
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
                        echo "package.json exists and is not empty"
                    } else {
                        error "package.json not found in frontend directory!"
                    }
                    
                    // Check backend files
                    if (fileExists('backend/pom.xml')) {
                        echo "pom.xml exists"
                    } else {
                        error "pom.xml not found in backend directory!"
                    }
                    
                    // Check Dockerfiles exist
                    if (!fileExists('frontend/Dockerfile')) {
                        error "frontend/Dockerfile not found!"
                    }
                    if (!fileExists('backend/Dockerfile')) {
                        error "backend/Dockerfile not found!"
                    }
                    
                    echo "All required files exist"
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
                        echo "Frontend build completed successfully"
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "=== Backend Build Started ==="
                        echo "Compiling main source code..."
                        mvn compile -q
                        echo "Packaging application..."
                        mvn package -DskipTests -q
                        echo "Backend build completed successfully"
                        echo "Generated JAR file:"
                        ls -la target/*.jar
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    echo "=== Building Docker Images ==="
                    
                    // Build Frontend Docker Image
                    sh """
                        echo "Building Frontend Docker image..."
                        docker build -t ${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE_NAME}:${APP_VERSION} ./frontend
                        docker tag ${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE_NAME}:${APP_VERSION} ${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE_NAME}:latest
                    """
                    
                    // Build Backend Docker Image
                    sh """
                        echo "Building Backend Docker image..."
                        docker build -t ${DOCKERHUB_NAMESPACE}/${BACKEND_IMAGE_NAME}:${APP_VERSION} ./backend
                        docker tag ${DOCKERHUB_NAMESPACE}/${BACKEND_IMAGE_NAME}:${APP_VERSION} ${DOCKERHUB_NAMESPACE}/${BACKEND_IMAGE_NAME}:latest
                    """
                    
                    // List built images
                    sh """
                        echo "Docker images built successfully:"
                        docker images | grep ${DOCKERHUB_NAMESPACE}
                    """
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                script {
                    echo "=== Logging into Docker Hub ==="
                    sh """
                        echo \"${DOCKERHUB_CREDENTIALS_PSW}\" | docker login -u \"${DOCKERHUB_CREDENTIALS_USR}\" --password-stdin
                        echo "Successfully logged into Docker Hub"
                    """
                }
            }
        }
        
        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    echo "=== Pushing Docker Images to Docker Hub ==="
                    
                    // Push Frontend Image
                    sh """
                        echo "Pushing Frontend image..."
                        docker push ${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE_NAME}:${APP_VERSION}
                        docker push ${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE_NAME}:latest
                        echo "Frontend image pushed successfully"
                    """
                    
                    // Push Backend Image
                    sh """
                        echo "Pushing Backend image..."
                        docker push ${DOCKERHUB_NAMESPACE}/${BACKEND_IMAGE_NAME}:${APP_VERSION}
                        docker push ${DOCKERHUB_NAMESPACE}/${BACKEND_IMAGE_NAME}:latest
                        echo "Backend image pushed successfully"
                    """
                    
                    echo "All Docker images pushed to Docker Hub!"
                }
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
                
                sh '''
                    echo "=== Build Artifacts Summary ==="
                    echo "Backend JAR:"
                    ls -la backend/target/*.jar
                    echo "Frontend build:"
                    ls -la frontend/build/
                    echo "Docker images:"
                    docker images | grep clinical-login
                '''
            }
        }
    }
    
    post {
        always {
            echo "Build completed with status: ${currentBuild.result}"
            
            // Clean up Docker images to save space
            sh '''
                echo "Cleaning up local Docker images..."
                docker images -q | xargs -r docker rmi -f || true
            '''
            
            cleanWs()
        }
        success {
            script {
                echo "SUCCESS: Clinical Login App built and deployed to Docker Hub!"
                echo "Docker Images:"
                echo "- Frontend: ${DOCKERHUB_NAMESPACE}/${FRONTEND_IMAGE_NAME}:${APP_VERSION}"
                echo "- Backend: ${DOCKERHUB_NAMESPACE}/${BACKEND_IMAGE_NAME}:${APP_VERSION}"
                echo "Latest tags also available"
            }
        }
        failure {
            echo "FAILURE: Build failed. Check the logs above for details."
        }
    }
}