FROM node:22-alpine AS build
WORKDIR /app

COPY beatflow-frontend/package*.json ./
RUN npm ci

COPY beatflow-frontend ./
RUN npm run build

FROM nginx:alpine
COPY beatflow-frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8180
CMD ["nginx", "-g", "daemon off;"]