import * as Sentry from "@sentry/react-native";

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://be744c7557353534e5befff5e160716f@o4505675546951680.ingest.us.sentry.io/4506876359278592",
  debug: process.env.NODE_ENV !== 'production', // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  enabled: process.env.NODE_ENV === 'production',
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});
