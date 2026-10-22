import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Injects Google AdSense site verification meta tag and generates ads.txt at build time
 * ONLY when a valid VITE_ADSENSE_CLIENT environment variable has been configured.
 * This guarantees no dummy or invented publisher IDs are leaked to production.
 */
function googleAdSensePlugin(client: string): Plugin {
  const trimmed = (client || '').trim();
  const isValid = /^ca-pub-\d{10,20}$/.test(trimmed);
  const publisherNumericId = isValid ? trimmed.replace(/^ca-/, '') : '';

  return {
    name: 'mybertutur-adsense-injector',
    transformIndexHtml(html) {
      if (!isValid) {
        return html;
      }
      const metaTag = `\n    <!-- Google AdSense Account Verification -->\n    <meta name="google-adsense-account" content="${trimmed}" />`;
      return html.replace('</head>', `${metaTag}\n  </head>`);
    },
    generateBundle() {
      if (isValid && publisherNumericId) {
        this.emitFile({
          type: 'asset',
          fileName: 'ads.txt',
          source: `# Google AdSense ads.txt for MyBertutur (Auto-generated at build)\ngoogle.com, ${publisherNumericId}, DIRECT, f08c47fec0942fa0\n`,
        });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const adsenseClient = env.VITE_ADSENSE_CLIENT || '';

  return {
    plugins: [react(), googleAdSensePlugin(adsenseClient)],
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});

