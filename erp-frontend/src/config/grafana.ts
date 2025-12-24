import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

/**
 * Initialize Grafana Faro for frontend performance monitoring
 * 
 * Configuration:
 * - VITE_GRAFANA_FARO_URL: The Grafana Faro collector endpoint URL
 * - VITE_GRAFANA_FARO_APP_NAME: Application name for monitoring
 * - VITE_GRAFANA_FARO_ENVIRONMENT: Environment (development, production, etc.)
 */
export function initializeGrafana() {
  const grafanaUrl = import.meta.env.VITE_GRAFANA_FARO_URL;
  const appName = import.meta.env.VITE_GRAFANA_FARO_APP_NAME || 'Ocean Market';
  const environment = import.meta.env.VITE_GRAFANA_FARO_ENVIRONMENT || 'production';

  // Only initialize if URL is provided
  if (!grafanaUrl) {
    console.warn('Grafana Faro URL not configured. Monitoring disabled.');
    return null;
  }

  try {
    const faro = initializeFaro({
      url: grafanaUrl,
      app: {
        name: appName,
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        environment: environment,
      },
      instrumentations: [
        // Mandatory, omits default instrumentations otherwise.
        ...getWebInstrumentations(),
        // Tracing package to get end-to-end visibility for HTTP requests.
        new TracingInstrumentation(),
      ],
    });

    console.log('Grafana Faro initialized successfully');
    return faro;
  } catch (error) {
    console.error('Failed to initialize Grafana Faro:', error);
    return null;
  }
}

// Export the faro instance getter for manual event tracking
export function getFaro() {
  // This will be set after initialization
  return (window as any).__faro;
}

