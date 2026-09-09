import { configured, projectId } from "@/sanity/env";
import StudioClient from "./StudioClient";

export const dynamic = "force-static";
export function generateStaticParams() {
  return [{ tool: [] }];
}
export const metadata = { title: "Studio — Brand Atelier", robots: { index: false, follow: false } };

export default function StudioPage() {
  if (!configured) {
    return (
      <main style={{ padding: "64px 24px", maxWidth: "62ch", margin: "0 auto", lineHeight: 1.7 }}>
        <h1 style={{ fontSize: "1.5rem", marginTop: 0 }}>Studio isn&rsquo;t connected yet</h1>
        <p>
          Create a project at <a href="https://sanity.io/manage">sanity.io/manage</a>, then add its
          ID to <code>.env.local</code> and restart:
        </p>
        <pre style={{ background: "#131519", padding: "16px", overflowX: "auto" }}>
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production`}
        </pre>
        <p>
          Add <code>http://localhost:3000</code> and your live domain to the project&rsquo;s CORS
          origins, with credentials allowed. The schemas — case study, client logo, testimonial and
          journal post — are already written and will appear here once it connects.
        </p>
        <p style={{ opacity: 0.6 }}>Current project ID: {projectId || "(not set)"}</p>
      </main>
    );
  }
  return <StudioClient />;
}
