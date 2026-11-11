# 05. KỊCH BẢN CI/CD ĐA NỀN TẢNG: GITLAB CI & JENKINS PIPELINE
## (MULTI-PLATFORM CI/CD PIPELINES: GITLAB CI, JENKINS & GITHUB ACTIONS)

> **Khả năng thích ứng của DevOps:** *"Tùy thuộc vào việc các phòng ban phía trên (Ban Giám Đốc, Project Manager hoặc Solution Architect) quyết định sử dụng nền tảng nào: **GitHub Actions**, **GitLab CI** hay cụm **Jenkins** tự lưu trữ nội bộ, DevOps đã chuẩn bị sẵn các bộ kịch bản tự động hóa hoàn chỉnh để triển khai ngay lập tức mà không gặp bất kỳ trở ngại nào."*

---

## 1. Bảng Tiêu Chí Lựa Chọn Nền Tảng CI/CD Cho Dự Án

| Nền Tảng | Ưu Điểm Lớn Nhất | Khi Nào Nên Lựa Chọn? | Bộ Kịch Bản Đi Kèm |
|---|---|---|---|
| **GitHub Actions** | Không cần cài đặt máy chủ CI riêng, tích hợp native với GitHub Repo, quản lý Secret cực tốt | Dự án khởi nghiệp đến doanh nghiệp vừa, cần tốc độ triển khai nhanh, tiết kiệm nhân lực bảo trì | File [`github_actions_production_pipeline.yml`](./github_actions_production_pipeline.yml) |
| **GitLab CI** | Có sẵn Container Registry nội bộ, quản lý phân quyền nhóm xuất sắc | Doanh nghiệp muốn tự host toàn bộ máy chủ Git trên hạ tầng riêng để bảo mật mã nguồn | File `.gitlab-ci.yml` (Bên dưới) |
| **Jenkins** | Tùy biến vô hạn bằng plugin, chạy được trong mạng cô lập (Air-gapped) | Khối Ngân hàng, Viễn thông, Doanh nghiệp lớn có hạ tầng máy chủ On-Premise truyền thống | File `Jenkinsfile` (Bên dưới) |

---

## 2. Kịch Bản Mẫu Cho GitLab CI (`.gitlab-ci.yml`)

Dành cho các dự án triển khai trên hệ thống GitLab nội bộ:

```yaml
stages:
  - test
  - security
  - build
  - deploy

variables:
  DOCKER_IMAGE_TAG: $CI_REGISTRY_IMAGE/backend-core:$CI_COMMIT_SHORT_SHA

# GIAI ĐOẠN 1: KIỂM THỬ TỰ ĐỘNG
lint_and_unit_test:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm run lint
    - npm run test:cov
  rules:
    - if: $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_BRANCH == "staging"

# GIAI ĐOẠN 2: QUÉT LỖ HỔNG CONTAINER BẰNG TRIVY
security_scan:
  stage: security
  image: 
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image --severity HIGH,CRITICAL --exit-code 1 $DOCKER_IMAGE_TAG
  allow_failure: false
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# GIAI ĐOẠN 3: BUILD & PUSH DOCKER IMAGE
build_image:
  stage: build
  image: docker:24.0
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_IMAGE_TAG .
    - docker push $DOCKER_IMAGE_TAG
  rules:
    - if: $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_BRANCH == "staging"

# GIAI ĐOẠN 4: DEPLOY KHÔNG GIÁN ĐOẠN LÊN STAGING
deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client curl
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
  script:
    - ssh -o StrictHostKeyChecking=no $STAGING_SERVER_USER@$STAGING_SERVER_IP "cd /opt/app && docker compose pull && docker compose up -d"
    - curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage -d chat_id=$TELEGRAM_CHAT_ID -d text="🚀 Đã deploy thành công lên STAGING!"
  environment:
    name: staging
  rules:
    - if: $CI_COMMIT_BRANCH == "staging"
```

---

## 3. Kịch Bản Mẫu Cho Jenkins (`Jenkinsfile` - Declarative Pipeline)

Dành cho các doanh nghiệp sử dụng cụm máy chủ Jenkins chuyên dụng:

```groovy
pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io/org/backend-core"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        TELEGRAM_BOT_TOKEN = credentials('telegram-bot-token')
        TELEGRAM_CHAT_ID = credentials('telegram-chat-id')
    }

    stages {
        stage('1. Code Quality & Unit Test') {
            steps {
                echo 'Đang chạy kiểm tra cú pháp và Unit Tests...'
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm run test:cov'
            }
        }

        stage('2. Build & Tag Docker Image') {
            steps {
                echo 'Đang đóng gói Docker Image đa tầng tối giản...'
                sh "docker build -t ${REGISTRY}:${IMAGE_TAG} -t ${REGISTRY}:latest ."
            }
        }

        stage('3. Trivy Security Audit') {
            steps {
                echo 'Quét lỗ hổng bảo mật tệp Image trước khi deploy...'
                sh "trivy image --severity HIGH,CRITICAL --exit-code 0 ${REGISTRY}:${IMAGE_TAG}"
            }
        }

        stage('4. Deploy Production Rolling Restart') {
            when {
                branch 'main'
            }
            steps {
                echo 'Đang triển khai an toàn không gián đoạn lên Production VPS...'
                sh '''
                    ssh deployer@192.168.1.100 "cd /opt/enterprise-app && \
                    docker compose pull && \
                    docker compose up -d --no-deps backend-core && \
                    docker exec enterprise-nginx nginx -s reload"
                '''
            }
        }
    }

    post {
        success {
            sh '''
                curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                -d chat_id=${TELEGRAM_CHAT_ID} \
                -d text="✅ [JENKINS SUCCESS] Bản build #${BUILD_NUMBER} đã deploy an toàn lên máy chủ Production!"
            '''
        }
        failure {
            sh '''
                curl -s -X POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
                -d chat_id=${TELEGRAM_CHAT_ID} \
                -d text="❌ [JENKINS FAILED] Bản build #${BUILD_NUMBER} gặp sự cố! Kiểm tra ngay console log."
            '''
        }
    }
}
```

