Local verification for web build

After making changes to the app, run the following to regenerate the static web export and verify the built bundle includes the Run Automation change:

- Generate static build:

  ```bash
  npm run export:web
  ```

- Verify the build:

  ```bash
  npm run verify-docs
  ```

- Serve the `docs/` folder locally and test in a browser (no caching):

  ```bash
  npx http-server docs -p 8080
  ```

Open http://localhost:8080, hard-refresh (Ctrl+F5), then open DevTools → Console and click "Run Automation"; you should see the spinner and `Run Automation triggered` in the console.

Note: A GitHub Action now runs on push to `main` to export and verify `docs/` automatically. If the live site serves an old bundle (404 / cached file), try an incognito window or unregister service workers in DevTools → Application → Service Workers.
