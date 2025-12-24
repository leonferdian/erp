# Ocean Market - Frontend

Vue 3 + TypeScript + Vite frontend application for Ocean Market ERP system.

## Features

- Vue 3 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Vue Router for navigation
- Grafana Faro for frontend performance monitoring

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id

# WebSocket Configuration
VITE_WS_URL=

# Grafana Faro Monitoring (Optional)
VITE_GRAFANA_FARO_URL=https://your-grafana-instance.com/collect
VITE_GRAFANA_FARO_APP_NAME=Ocean Market
VITE_GRAFANA_FARO_ENVIRONMENT=development
```

## Grafana Faro Setup

This application includes Grafana Faro for frontend performance monitoring. To enable monitoring:

1. Set up a Grafana instance with Faro collector endpoint
2. Add `VITE_GRAFANA_FARO_URL` to your `.env` file
3. Optionally configure `VITE_GRAFANA_FARO_APP_NAME` and `VITE_GRAFANA_FARO_ENVIRONMENT`

The monitoring will automatically track:
- Performance metrics (navigation timing, resource timing)
- Long tasks detection
- Fetch/XHR requests
- Document load performance
- Errors and exceptions
- User sessions

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Setup

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
