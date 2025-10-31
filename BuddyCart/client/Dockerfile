# 构建阶段：打包 CRA 前端
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # CRA 产物在 /app/build

# 运行阶段：用 nginx 提供静态文件
FROM nginx:alpine
# 用你的 nginx.conf（含 SPA 回退）
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 从 builder 拷贝 build（不受 .dockerignore 影响）
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
