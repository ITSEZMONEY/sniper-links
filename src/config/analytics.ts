export interface AnalyticsConfig {
  plausible?: {
    enabled: boolean;
    domain: string;
    apiHost?: string;
  };
  googleAnalytics?: {
    enabled: boolean;
    measurementId: string;
  };
  posthog?: {
    enabled: boolean;
    apiKey: string;
    apiHost?: string;
  };
}

// Analytics configuration
// Set enabled: true and provide proper IDs when deploying
export const analyticsConfig: AnalyticsConfig = {
  plausible: {
    enabled: false, // Set to true in production
    domain: 'sniperlinks.com', // Replace with your actual domain
    apiHost: 'https://plausible.io'
  },
  googleAnalytics: {
    enabled: false, // Set to true if using GA4
    measurementId: 'G-XXXXXXXXXX' // Replace with your GA4 measurement ID
  },
  posthog: {
    enabled: false, // Set to true if using PostHog
    apiKey: 'phc_xxxxxxxxxx', // Replace with your PostHog API key
    apiHost: 'https://app.posthog.com'
  }
};

// Initialize analytics based on configuration
export function initializeAnalytics() {
  // Plausible (already loaded via script tag, no initialization needed)
  if (analyticsConfig.plausible?.enabled) {
    console.log('📊 Plausible Analytics enabled');
  }

  // Google Analytics
  if (analyticsConfig.googleAnalytics?.enabled) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.measurementId}`;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', analyticsConfig.googleAnalytics!.measurementId);
      console.log('📊 Google Analytics initialized');
    };
  }

  // PostHog
  if (analyticsConfig.posthog?.enabled) {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);var n=t;if("undefined"!=typeof e)n=t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))};else{function p(){t.push([i].concat(Array.prototype.slice.call(arguments,0)))}n._i=[],n.init=p}n.__SV=1.0},a={capture:"capture",register:"register",register_once:"register_once",unregister:"unregister",identify:"identify",alias:"alias",track:"track",ready:"ready",set:"set",set_once:"set_once",unset:"unset",opt_out_capturing:"opt_out_capturing",opt_in_capturing:"opt_in_capturing",has_opted_out_capturing:"has_opted_out_capturing",has_opted_in_capturing:"has_opted_in_capturing",clear_opt_in_out_capturing:"clear_opt_in_out_capturing",time_event:"time_event",people:"people",toString:"toString",stop_observer:"stop_observer",__SV:"__SV",send_request:"send_request"};for(var t=0;t<a.length;t++)g(e,a[t]);e.init("${analyticsConfig.posthog!.apiKey}","${analyticsConfig.posthog!.apiHost}",{api_host:"${analyticsConfig.posthog!.apiHost}"}),e.init(i,s,a);var u=t.createElement("script");u.type="text/javascript",u.async=!0,u.src=s.api_host+"/static/array.js",(t.getElementsByTagName("head")[0]||t.getElementsByTagName("body")[0]).appendChild(u);var c=e;for(void 0!==a?c=e[a]=[]:a="posthog",c.people=c.people||[],c.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},c.people.toString=function(){return c.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing has_opted_in_capturing clear_opt_in_out_capturing time_event reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(c,o[n]);t.posthog=e}}(document,window.posthog||[]);
    `;
    document.head.appendChild(script);
    console.log('📊 PostHog initialized');
  }
}

// Enhanced tracking function that works with multiple providers
export function trackAnalyticsEvent(
  eventName: string,
  properties: Record<string, any> = {}
) {
  const eventData = {
    ...properties,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    referrer: document.referrer || 'direct'
  };

  // Plausible
  if (analyticsConfig.plausible?.enabled && typeof (window as any).plausible !== 'undefined') {
    (window as any).plausible(eventName, { props: eventData });
  }

  // Google Analytics
  if (analyticsConfig.googleAnalytics?.enabled && typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', eventName, {
      event_category: 'SniperLink',
      event_label: properties.esp || properties.emailDomain || 'unknown',
      custom_parameters: eventData
    });
  }

  // PostHog
  if (analyticsConfig.posthog?.enabled && typeof (window as any).posthog !== 'undefined') {
    (window as any).posthog.capture(eventName, eventData);
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, eventData);
  }
}