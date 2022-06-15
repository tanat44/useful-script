# Stage 1 - build react
FROM node:latest as build
WORKDIR /app
COPY package.json package-lock.json ./
COPY . ./
RUN npm i
RUN npm run build


# Stage 2 - serve with nginx
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html