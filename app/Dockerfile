# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build react app for production
RUN npm run build

# Production stage - serve static files using nginx
FROM nginx:latest

# Copy the built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# (Optional) Copy your custom nginx config if you have one
# COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
