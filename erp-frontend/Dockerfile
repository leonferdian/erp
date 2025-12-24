# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_GRAFANA_FARO_URL
ARG VITE_GRAFANA_FARO_APP_NAME
ARG VITE_GRAFANA_FARO_ENVIRONMENT

# Set as environment variables for Vite build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GRAFANA_FARO_URL=$VITE_GRAFANA_FARO_URL
ENV VITE_GRAFANA_FARO_APP_NAME=$VITE_GRAFANA_FARO_APP_NAME
ENV VITE_GRAFANA_FARO_ENVIRONMENT=$VITE_GRAFANA_FARO_ENVIRONMENT

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve
FROM node:20-slim

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
