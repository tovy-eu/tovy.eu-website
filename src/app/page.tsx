
      /**
       * Root redirection page. 
       * Optimized for static export by using an inline script to detect language and redirect 
       * as early as possible. This approach is safest for 'output: export' environments.
       */
      export default function RootPage() {
        return (
          <div className="flex h-screen w-full items-center justify-center bg-[#0a1120]">
           <script
             dangerouslySetInnerHTML={{
               __html: `
                 (function() {
                   try {
                     var target = 'en'; // Default language
                     var supported = ['en', 'nl'];
                     var cookieLang = (document.cookie.match(/^(?:.*;)?NEXT_LOCALE=([^;]+)(?:.*)?$/) || [, ''])[1];
     
                     if (cookieLang && supported.includes(cookieLang)) {
                       target = cookieLang;
                     } else {
                       var browserLang = navigator.language.split('-')[0];
                       if (supported.includes(browserLang)) {
                         target = browserLang;
                       }
                       // Set the cookie if not already set or invalid
                       document.cookie = 'NEXT_LOCALE=' + target + '; Path=/; Max-Age=' + (365 * 24 * 60 * 60) + '; Secure; SameSite=Lax';
                     }
                     window.location.replace('/' + target + '/');
                   } catch (e) {
                     // Fallback to English if any error occurs
                     window.location.replace('/en/');
                   }
                 })();
               `,
             }}
           />
           {/* 
             The page is intentionally left blank of text to prevent a "Loading..." flicker.
             The background color matches the site's theme for a seamless transition.
           */}
         </div>
       );
     }
     
