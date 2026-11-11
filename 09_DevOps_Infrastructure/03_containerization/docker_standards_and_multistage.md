# TIÊU CHUẨN ĐÓNG GÓI DOCKER ĐA TẦNG (MULTI-STAGE DOCKERFILE)

Dockerfile mẫu áp dụng kỹ thuật Multi-stage build giúp giảm dung lượng image từ 1.2GB xuống dưới **120MB**, đồng thời chạy dưới quyền người dùng không phải root (`non-root user`) để chống tấn công leo thang đặc quyền:

```dockerfile
# ----------------------------------------------------
# GIAI ĐOẠN 1: DEPENDENCIES & BUILD
# ----------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Cài đặt công cụ build cần thiết
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .

# Biên dịch mã nguồn TypeScript sang JavaScript thuần
RUN npm run build
# Loại bỏ devDependencies để thu nhỏ thư mục node_modules
RUN npm prune --production

# ----------------------------------------------------
# GIAI ĐOẠN 2: RUNTIME RUNNER NHẸ & BẢO MẬT
# ----------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Tạo nhóm và người dùng không có đặc quyền root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Chỉ sao chép những file cần thiết để chạy
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist

# Chuyển quyền thực thi sang user không phải root
USER nestjs

EXPOSE 3000

# Kiểm tra sức khỏe container định kỳ (Health Check)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
```

