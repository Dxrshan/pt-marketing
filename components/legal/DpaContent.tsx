export default function DpaContent() {
  return (
    <>
      <div className="legal-callout">
        <p><strong>What this is:</strong> when a studio uses DNI Studio to manage its clients, the studio is the <strong>data controller</strong> and we are its <strong>processor</strong>. Article 28 UK GDPR requires that relationship to be governed by a written contract. This is that contract.</p>
        <p><strong>You may not need to sign anything.</strong> These terms already apply automatically to every customer through section 7 of our <a href="/legal/terms-of-service">Terms of Service</a>. This page exists for studios whose own compliance process wants the processor terms as a separate, signable document.</p>
      </div>

      <h2>1. Parties</h2>
      <ul>
        <li><strong>Processor:</strong> DNI Analytics Ltd, registered in England and Wales (&quot;we&quot;, &quot;us&quot;)</li>
        <li><strong>Controller:</strong> the studio or business subscribing to DNI Studio (&quot;you&quot;)</li>
      </ul>
      <p>This agreement takes effect on the date you begin using the Service and continues for as long as we process personal data on your behalf.</p>

      <h2>2. Subject matter and duration</h2>
      <p>We process personal data solely to provide the DNI Studio platform to you — hosting it, keeping it available, supporting it, and doing what you instruct through it. Processing continues for the life of your subscription and for no more than 90 days after it ends.</p>

      <h2>3. Nature and purpose of processing</h2>
      <ul>
        <li>Storing and retrieving client records so your staff can manage training</li>
        <li>Scheduling sessions and recording attendance</li>
        <li>Recording workouts, body metrics, wellness and nutrition logs</li>
        <li>Storing media you or your clients upload — progress photos, form-check video, voice notes</li>
        <li>Carrying messages between your staff and your clients</li>
        <li>Recording payment status (never full card numbers)</li>
        <li>Generating AI Coach responses, where you enable that feature</li>
        <li>Sending transactional email and push notifications</li>
      </ul>

      <h2>4. Categories of data subject</h2>
      <ul>
        <li>Your training clients</li>
        <li>Your staff — owners, trainers, managers, front-desk</li>
        <li>Your leads and enquiries</li>
      </ul>

      <h2>5. Categories of personal data</h2>
      <p><strong>Ordinary personal data:</strong> name, email, phone, date of birth, gender, profile photo, session and attendance history, payment status, messages, community posts.</p>
      <div className="legal-callout">
        <p><strong>Special category data (health):</strong> body weight, height, measurements and composition, progress photos, form-check video, workout logs, wellness logs (sleep, mood, energy, steps, water), nutrition logs, training goals, and any injury or medical limitation a trainer records in notes.</p>
        <p>You are responsible for establishing an Article 9 condition — normally <strong>explicit consent</strong> — before entering any of this.</p>
      </div>

      <h2>6. Your obligations as controller</h2>
      <p>You warrant that:</p>
      <ul>
        <li>You have a lawful basis for everything you record, and explicit consent (or another Article 9 condition) for health data</li>
        <li>You have given your clients your own privacy notice</li>
        <li>You have obtained parental or guardian consent for any client under 16</li>
        <li>Your instructions to us will not cause us to breach UK GDPR</li>
        <li>You will respond to your own clients&apos; data subject requests</li>
        <li>You have registered with the ICO and paid the data protection fee, where required</li>
      </ul>

      <h2>7. Our obligations as processor</h2>
      <p>We will:</p>
      <ul>
        <li><strong>Process only on your documented instructions</strong>, including for international transfers, unless required otherwise by law — in which case we will tell you first unless the law forbids it</li>
        <li>Ensure everyone authorised to process the data is bound by confidentiality</li>
        <li>Apply the technical and organisational measures in section 9</li>
        <li>Engage sub-processors only as set out in section 8</li>
        <li>Assist you, so far as reasonably possible, in responding to data subject requests</li>
        <li>Assist you with data protection impact assessments and with security, breach notification and consultation obligations</li>
        <li>Delete or return the data at the end of the Service, as set out in section 11</li>
        <li>Make available the information needed to demonstrate compliance, and allow for audits under section 12</li>
        <li><strong>Tell you without undue delay</strong> on becoming aware of a personal data breach</li>
      </ul>
      <p>We will not sell your data, use it to build a profile of your clients for our own purposes, or use it to train AI models.</p>

      <h2>8. Sub-processors</h2>
      <p>You give general written authorisation for us to engage the sub-processors below. We remain fully liable to you for their performance.</p>
      <table>
        <thead>
          <tr><th>Sub-processor</th><th>Purpose</th><th>Location</th></tr>
        </thead>
        <tbody>
          <tr><td>MongoDB Atlas</td><td>Database hosting</td><td>EU / UK</td></tr>
          <tr><td>Render</td><td>Application hosting</td><td>EU / US</td></tr>
          <tr><td>Vercel</td><td>Marketing site hosting</td><td>Global edge</td></tr>
          <tr><td>Anthropic</td><td>AI Coach responses</td><td>US</td></tr>
          <tr><td>PostHog</td><td>Product analytics</td><td>EU</td></tr>
          <tr><td>Resend</td><td>Transactional email</td><td>EU / US</td></tr>
          <tr><td>Square</td><td>Card payments, where you connect your own account</td><td>US / EU</td></tr>
        </tbody>
      </table>
      <p>We will give you <strong>at least 30 days&apos; notice</strong> before adding or replacing a sub-processor. If you reasonably object on data protection grounds, you may terminate your subscription without penalty and receive a pro-rata refund of any prepaid fees.</p>
      <p>The current list always appears in our <a href="/legal/privacy-policy">Privacy Policy</a>.</p>

      <h2>9. Security measures</h2>
      <ul>
        <li>All traffic encrypted in transit using TLS</li>
        <li>Data encrypted at rest by our hosting provider</li>
        <li>Passwords stored only as salted one-way hashes, never recoverable</li>
        <li>Role-based access control — trainers see only what you permit</li>
        <li>Logical separation between studios, so no studio can reach another&apos;s records</li>
        <li>Rate limiting and standard security headers</li>
        <li>Sessions expire after 30 days</li>
        <li>Regular automated database backups</li>
      </ul>
      <p>We review these measures as the Service develops, and will not materially reduce the overall level of security during your subscription.</p>

      <h2>10. International transfers</h2>
      <p>Where a sub-processor is outside the UK, we rely on the UK International Data Transfer Agreement, the UK Addendum to the EU Standard Contractual Clauses, or an applicable adequacy decision. Details of the safeguards in place are available on request.</p>

      <h2>11. Deletion and return</h2>
      <ul>
        <li>You can <strong>export a complete copy</strong> of any client&apos;s data at any time, as structured JSON, from within the app</li>
        <li>Deleting a client <strong>permanently erases</strong> them across every record — profile, sessions, workout and wellness logs, media, payments, messages, community posts and portal login</li>
        <li>We keep a minimal erasure record — the client id, who performed it and when, containing <strong>no personal data</strong> — so that the deletion can be evidenced afterwards</li>
        <li>On termination you have <strong>30 days</strong> to export. We then delete or return all personal data within a further 60 days, unless retention is required by law</li>
      </ul>

      <h2>12. Audit</h2>
      <p>On reasonable written notice, and no more than once a year unless a regulator requires otherwise, we will provide the information reasonably necessary to demonstrate compliance with this agreement. Where a physical audit is genuinely required, it will be at your cost, during business hours, and must not disrupt the Service or compromise the confidentiality of other customers.</p>

      <h2>13. Liability</h2>
      <p>Liability under this agreement is subject to the limitations and exclusions in our <a href="/legal/terms-of-service">Terms of Service</a>. Nothing here limits either party&apos;s liability to a data subject or a regulator under UK GDPR.</p>

      <h2>14. Governing law</h2>
      <p>This agreement is governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.</p>

      <h2>15. Signing this</h2>
      <p>These terms apply automatically through section 7 of our Terms of Service, so no signature is needed for them to bind us. If your compliance process requires a countersigned copy, email <a href="mailto:darshan.mashru@dnianalytics.com">darshan.mashru@dnianalytics.com</a> and we will provide one.</p>
    </>
  )
}
