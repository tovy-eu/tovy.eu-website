
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
                var lang = navigator.language.split('-')[0];
                var supported = ['en', 'nl'];
                var target = supported.indexOf(lang) !== -1 ? lang : 'en';
                window.location.replace('/' + target + '/');
              } catch (e) {
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
