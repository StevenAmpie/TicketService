import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://bb831b0670c254f008b48397ed097311@o4510817020870656.ingest.us.sentry.io/4510817024409600",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // discuss this
  sendDefaultPii: true,
});
