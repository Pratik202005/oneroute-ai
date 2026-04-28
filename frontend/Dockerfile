# ---------- Build Stage ----------
FROM node:20 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the Vite app
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create entrypoint script for runtime environment variable injection
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_API_URL__|${VITE_API_URL}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_GOOGLE_MAPS_KEY__|${VITE_GOOGLE_MAPS_KEY}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_GOOGLE_MAPS_API_KEY__|${VITE_GOOGLE_MAPS_API_KEY}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_API_KEY__|${VITE_FIREBASE_API_KEY}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_AUTH_DOMAIN__|${VITE_FIREBASE_AUTH_DOMAIN}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_PROJECT_ID__|${VITE_FIREBASE_PROJECT_ID}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_STORAGE_BUCKET__|${VITE_FIREBASE_STORAGE_BUCKET}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_MESSAGING_SENDER_ID__|${VITE_FIREBASE_MESSAGING_SENDER_ID}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_APP_ID__|${VITE_FIREBASE_APP_ID}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_FIREBASE_MEASUREMENT_ID__|${VITE_FIREBASE_MEASUREMENT_ID}|g" {} +' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]