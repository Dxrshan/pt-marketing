export default function CookiePolicyContent() {
  return (
    <>
      <div className="legal-callout">
        <p><strong>In short:</strong> DNI Studio uses very few cookies. We set <strong>none</strong> for advertising and we do <strong>not</strong> sell your data. What we do store falls into two groups: things the app needs to work, and analytics that tell us which features are used.</p>
      </div>

      <h2>1. What this covers</h2>
      <p>This policy explains the cookies and similar technologies used on dnianalytics.com and app.dnianalytics.com, operated by <strong>DNI Analytics Ltd</strong>, registered in England and Wales. Read it alongside our <a href="/legal/privacy-policy">Privacy Policy</a>.</p>

      <h2>2. Cookies and browser storage</h2>
      <p>A <strong>cookie</strong> is a small text file a website saves on your device and sends back on later visits. <strong>Local storage</strong> works similarly but stays on your device and is not transmitted automatically with each request.</p>
      <p>Worth knowing: <strong>the DNI Studio app keeps you signed in using local storage, not cookies.</strong> Third-party analytics is the only thing that sets cookies on our domains.</p>

      <h2>3. Strictly necessary</h2>
      <p>These make the Service function. They cannot be switched off, and under PECR they do not require consent because without them the Service you asked for cannot be delivered.</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td>ptm_token</td><td>Local storage</td><td>Your secure login token — keeps you signed in</td><td>Until you log out</td></tr>
          <tr><td>ptm_user</td><td>Local storage</td><td>Your basic account details, so the app can display the right screens without refetching them constantly</td><td>Until you log out</td></tr>
        </tbody>
      </table>

      <h2>4. Preferences</h2>
      <p>These remember how you like the app set up. Nothing here identifies you or leaves your device.</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td>ptm_theme</td><td>Whether you chose light or dark mode</td></tr>
          <tr><td>ptm_portal_accent</td><td>Your chosen accent colour in the client portal</td></tr>
          <tr><td>ptm_dashboard_tiles</td><td>Which dashboard tiles you have shown or hidden</td></tr>
          <tr><td>ptm_chart_labels</td><td>Whether chart labels are displayed</td></tr>
          <tr><td>ptm_hide_amounts</td><td>Whether payment amounts are hidden from view</td></tr>
          <tr><td>ptm_coach_tone</td><td>Your preferred AI Coach tone of voice</td></tr>
        </tbody>
      </table>
      <p>All of these are stored in your browser&apos;s local storage. Clearing your browser data removes them and resets those preferences to default.</p>

      <h2>5. Analytics</h2>
      <p>We use <strong>PostHog</strong> to understand which features get used and where people run into problems. This helps us fix bugs and decide what to build. PostHog sets cookies on our domains.</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td>ph_*</td><td>PostHog</td><td>Distinguishes one visitor from another and records which pages and features are used</td><td>Up to 12 months</td></tr>
        </tbody>
      </table>
      <p>We use this to improve the product, not to profile you for advertising. We do not share analytics data with advertisers or data brokers.</p>

      <h2>6. What we do not use</h2>
      <ul>
        <li><strong>No advertising or retargeting cookies.</strong></li>
        <li><strong>No social media tracking pixels.</strong></li>
        <li><strong>No selling or sharing of personal data</strong> with advertisers or data brokers.</li>
      </ul>

      <h2>7. Third-party services</h2>
      <p>Some features load resources from other providers, which may set their own cookies under their own policies:</p>
      <ul>
        <li><strong>Google Fonts</strong> — loads the typefaces used across the site</li>
        <li><strong>Square</strong> — where a studio has connected its Square account for card payments</li>
      </ul>
      <p>We do not control these providers&apos; cookies. Please refer to their own cookie policies for detail.</p>

      <h2>8. How to control cookies</h2>
      <p>You can block or delete cookies through your browser settings — look for &quot;Cookies and site data&quot; or &quot;Privacy&quot; in Chrome, Safari, Firefox or Edge. Most browsers also offer a private or incognito mode that discards everything when you close the window.</p>
      <div className="legal-callout">
        <p><strong>One warning:</strong> clearing local storage for app.dnianalytics.com will sign you out and reset your preferences. The app will not work properly if you block storage for that domain entirely, because your login token lives there.</p>
      </div>
      <p>To opt out of analytics specifically, enable <strong>&quot;Do Not Track&quot;</strong> in your browser, or email us at <a href="mailto:darshan.mashru@dnianalytics.com">darshan.mashru@dnianalytics.com</a> and we will exclude your account.</p>

      <h2>9. Changes</h2>
      <p>We will update this policy if the technologies we use change. The &quot;last updated&quot; date at the top always shows the current version.</p>

      <h2>10. Contact</h2>
      <p>DNI Analytics Ltd, registered in England and Wales.<br />
      Email: <a href="mailto:darshan.mashru@dnianalytics.com">darshan.mashru@dnianalytics.com</a></p>
    </>
  )
}
