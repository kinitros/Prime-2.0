import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: any;
    gtag: any;
    dataLayer: any[];
  }
}

const PixelManager: React.FC = () => {
  const { facebookPixelId, googleAdsId, gtmId } = useAdmin();
  const location = useLocation();

  // Google Tag Manager Injection
  useEffect(() => {
    if (!gtmId) return;

    const scriptId = 'gtm-script';
    if (!document.getElementById(scriptId)) {
      // GTM Script
      (function(w:any,d:any,s:any,l:any,i:any){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;j.id=scriptId;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer',gtmId);
    }
    
    // Virtual Page View for SPA
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname
      });
    }

  }, [gtmId, location.pathname]);

  // Facebook Pixel Injection
  useEffect(() => {
    if (!facebookPixelId) return;

    // Initialize Facebook Pixel
    if (!window.fbq) {
      !function(f:any,b:any,e:any,v:any,n:any,t:any,s:any)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', facebookPixelId);
    }

    // Track PageView on route change
    window.fbq('track', 'PageView');

  }, [facebookPixelId, location.pathname]);

  // Google Ads Injection
  useEffect(() => {
    if (!googleAdsId) return;

    // Initialize Google Ads Tag (gtag.js)
    if (!window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){window.dataLayer.push(arguments);}
      window.gtag('js', new Date());
      window.gtag('config', googleAdsId);
    } else {
      // If already loaded, just update config for new route (virtual pageview)
      // Note: Google Ads auto-tracks page views if configured in dashboard, 
      // but explicit config call ensures consistency in SPAs
      window.gtag('config', googleAdsId, {
        page_path: location.pathname
      });
    }

  }, [googleAdsId, location.pathname]);

  return null; // This component renders nothing visible
};

export default PixelManager;
