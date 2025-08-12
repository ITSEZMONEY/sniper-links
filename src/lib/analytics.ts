// Centralized analytics for GA4, Mixpanel, and PostHog
// Public keys provided by the user. No env vars used.
import mixpanel from "mixpanel-browser";
import posthog from "posthog-js";

const GA_MEASUREMENT_ID = "G-JWWF980CFT";
const MIXPANEL_TOKEN = "920931836d9194cb5b457fcf41baa2d3";
const POSTHOG_KEY = "phc_dXo3Q8uXW793Vb5mU4IdWtABwXZM2MFCEqfgZbTgNFs";

// Minimal script loader
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

// Provide types for gtag
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let initialized = false;

export async function initAnalytics() {
  if (initialized) return;
  initialized = true;

  // GA4
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    } as any;
    window.gtag("js", new Date());
    await loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
    });
  } catch (e) {
    // no-op
  }

  // Mixpanel
  try {
    mixpanel.init(MIXPANEL_TOKEN, { persistence: "localStorage", track_pageview: false });
  } catch (e) {
    // no-op
  }

  // PostHog
  try {
    posthog.init(POSTHOG_KEY, {
      capture_pageview: false, // we'll handle manually to keep parity
      autocapture: true,
    });
  } catch (e) {
    // no-op
  }
}

export function trackPageview(path: string) {
  try {
    window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: path });
  } catch {}
  try {
    mixpanel.track("page_view", { path });
  } catch {}
  try {
    posthog.capture("$pageview", { path });
  } catch {}
}

export function trackEvent(event: string, props?: Record<string, any>) {
  try {
    window.gtag?.("event", event, props ?? {});
  } catch {}
  try {
    mixpanel.track(event, props);
  } catch {}
  try {
    posthog.capture(event, props);
  } catch {}
}
