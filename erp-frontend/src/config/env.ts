export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id',
  WS_URL: import.meta.env.VITE_WS_URL || '', // Disable WebSocket for now
  GRAFANA_FARO_URL: import.meta.env.VITE_GRAFANA_FARO_URL || '',
  GRAFANA_FARO_APP_NAME: import.meta.env.VITE_GRAFANA_FARO_APP_NAME || 'Ocean Market',
  GRAFANA_FARO_ENVIRONMENT: import.meta.env.VITE_GRAFANA_FARO_ENVIRONMENT || 'development'
}

