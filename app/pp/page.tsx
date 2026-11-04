"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --enterprise-primary: #0f172a;
          --enterprise-secondary: #475569;
          --enterprise-accent: #2563eb;
          --bg-light: #f8fafc;
          --card-bg: #ffffff;
          --border-color: #e2e8f0;
        }

        body, html {
          background-color: var(--bg-light);
          color: var(--enterprise-primary);
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .enterprise-bg {
          background-color: var(--bg-light);
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .policy-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          padding: 3rem;
        }

        .policy-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .policy-section:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .section-title {
          color: var(--enterprise-primary);
          font-weight: 600;
          letter-spacing: -0.025em;
          margin-bottom: 1.25rem;
          font-size: 1.25rem;
        }

        .section-text {
          color: var(--enterprise-secondary);
          line-height: 1.75;
          font-size: 1rem;
        }
        
        .section-list {
          margin-top: 1rem;
          padding-left: 1.5rem;
        }

        .section-list li {
          margin-bottom: 0.75rem;
        }

        .enterprise-link {
          color: var(--enterprise-accent);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .enterprise-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
          
        .last-updated {
          font-size: 0.875rem;
          color: var(--enterprise-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
      `,
        }}
      />

      <div className="min-vh-100 d-flex flex-column enterprise-bg font-sans">
        {/* ENTERPRISE NAV BAR */}
        <header
          className="w-100 bg-white py-3 px-4 px-md-5 d-flex justify-content-between align-items-center sticky-top"
          style={{
            zIndex: 1000,
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="d-flex align-items-center">
            <Link href="/">
              <img
                src="https://zen-tech.vercel.app/Assets/zt-portrait-logo.png"
                alt="Zen-Tech Logo"
                style={{
                  height: "48px",
                  width: "auto",
                  objectFit: "contain",
                  filter: "invert(1) contrast(100)",
                }}
              />
            </Link>
          </div>
          <nav className="d-flex align-items-center">
            <Link
              href="/"
              className="btn btn-light border px-4 py-2 fw-medium text-dark"
              style={{
                fontSize: "0.875rem",
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              Back to Scanner
            </Link>
          </nav>
        </header>

        {/* POLICY CONTENT */}
        <main
          className="container py-5 flex-grow-1"
          style={{ maxWidth: "840px" }}
        >
          <div className="text-center mb-5 mt-4">
            <h1
              className="display-5 fw-bold mb-3"
              style={{
                color: "var(--enterprise-primary)",
                letterSpacing: "-0.025em",
              }}
            >
              Privacy Policy
            </h1>
            <p
              className="fs-5 mb-4"
              style={{ color: "var(--enterprise-secondary)" }}
            >
              Your privacy is our highest mandate. We operate with absolute
              cryptographic and operational transparency.
            </p>
            <p className="last-updated">Last Updated: November 2026</p>
          </div>

          <div className="policy-card mb-5">
            <div className="policy-section">
              <h4 className="section-title">
                1. Introduction & Corporate Identity
              </h4>
              <p className="section-text">
                This Privacy Policy applies to the AI Image Detector platform
                and associated digital services operated by{" "}
                <strong>Zen-Tech</strong>, functioning under the parent
                organization <strong>T-Service Group (Global)</strong>. We are a
                registered Micro, Small & Medium Enterprise (MSME) recognized by
                the Government of India (UDYAM-MH-27-0214642). This document
                legally outlines our strict adherence to data protection laws
                and our operational architecture designed to maximize user
                privacy.
              </p>
            </div>

            <div className="policy-section">
              <h4 className="section-title">
                2. Zero-Data Retention Protocol (Image Processing)
              </h4>
              <p className="section-text">
                Our AI Image Detector is engineered around a foundational{" "}
                <strong>Zero-Data Retention Policy</strong>. We recognize the
                highly sensitive nature of image verification, particularly
                regarding deepfake detection and digital forensics. Therefore,
                our processing pipeline is governed by the following
                constraints:
              </p>
              <ul className="section-text section-list">
                <li>
                  <strong>Volatile Memory Processing:</strong> When an image is
                  uploaded for scanning, it is processed exclusively within our
                  server's active RAM (Volatile Memory).
                </li>
                <li>
                  <strong>Instantaneous Deletion:</strong> The microsecond the
                  inference is complete and the scan result is returned to your
                  client interface, the image binary is permanently wiped from
                  our environment.
                </li>
                <li>
                  <strong>No Persistent Storage:</strong> We do not log, cache,
                  backup, or commit any user-uploaded media to any solid-state
                  drives, databases, or cloud storage buckets.
                </li>
                <li>
                  <strong>No Model Training:</strong> Under no circumstances do
                  we utilize user-submitted imagery to fine-tune, train, or
                  optimize our proprietary AI models. Your private data remains
                  yours.
                </li>
              </ul>
            </div>

            <div className="policy-section">
              <h4 className="section-title">
                3. Data We Collect & How We Use It
              </h4>
              <p className="section-text">
                To maintain the functionality and security of our platform, we
                collect the absolute minimum amount of operational data
                required:
              </p>
              <ul className="section-text section-list">
                <li>
                  <strong>Local Storage (Browser-Side):</strong> We utilize
                  standard Local Storage mechanisms within your web browser to
                  track your daily free scan quota. This counter exists purely
                  on your device and is not synchronized with our backend
                  servers.
                </li>
                <li>
                  <strong>Technical Telemetry:</strong> For security monitoring
                  against DDoS attacks and abuse, we temporarily process
                  standard network logs, including anonymized IP addresses,
                  browser User-Agent strings, and timestamp data. This data is
                  purged automatically on a rolling basis.
                </li>
                <li>
                  <strong>Account & Payment Data:</strong> For users upgrading
                  to our Professional or Enterprise tiers, basic profile and
                  billing information is collected. Payment processing is
                  handled securely off-site via our authorized gateway (Razorpay
                  under the Zen-Tech International brand); we do not store raw
                  credit card or banking credentials on our servers.
                </li>
              </ul>
            </div>

            <div className="policy-section">
              <h4 className="section-title">
                4. Enterprise Security Infrastructure
              </h4>
              <p className="section-text">
                Zen-Tech secures all active connections using enterprise-grade
                TLS 1.3 (Transport Layer Security) encryption. Any payload
                transferred between your local machine and our inference nodes
                is encrypted in transit. Our deployment environments are
                consistently audited for vulnerabilities, ensuring that our
                zero-retention pledge is cryptographically enforced and
                impenetrable to unauthorized extraction.
              </p>
            </div>

            <div className="policy-section">
              <h4 className="section-title">
                5. Third-Party Sharing & Compliance
              </h4>
              <p className="section-text">
                We categorically do not sell, rent, or trade your personal data
                or usage metrics to advertising agencies, data brokers, or
                external third parties. Information is only shared under the
                following strict conditions:
              </p>
              <ul className="section-text section-list">
                <li>
                  With authorized infrastructure providers (e.g., Vercel,
                  Render) strictly for the purpose of hosting the application
                  securely.
                </li>
                <li>
                  If explicitly compelled by a legally binding court order or
                  warrant from recognized law enforcement agencies. However,
                  because we practice zero-data retention on media, we cannot
                  and will not produce images that have already been purged from
                  our RAM.
                </li>
              </ul>
            </div>

            <div className="policy-section">
              <h4 className="section-title">
                6. Cyber Crime Mitigation & User Responsibility
              </h4>
              <p className="section-text">
                This platform is an open-access utility built to democratize
                digital safety and empower individuals against synthetic media
                manipulation, deepfakes, and extortion. While we provide the
                technological means for verification, we are not an
                investigatory body.
                <br />
                <br />
                If you are utilizing our tool to investigate a potential cyber
                offense against yourself or a loved one, we strongly urge you to
                formally report the incident to the authorities. In India,
                cybercrimes can be reported via the{" "}
                <a
                  href="https://sancharsaathi.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="enterprise-link"
                >
                  Sanchar Saathi
                </a>{" "}
                portal or the National Cyber Crime Reporting Portal. Any misuse
                of our API for malicious reconnaissance is strictly prohibited
                and will result in a permanent IP block.
              </p>
            </div>

            <div className="policy-section">
              <h4 className="section-title">
                7. Contact & Data Subject Rights
              </h4>
              <p className="section-text">
                Depending on your jurisdiction, you maintain the right to
                request access to, correction of, or deletion of any persistent
                personal data we may hold (such as email addresses for support
                tickets). For privacy-related inquiries, legal compliance
                matters, or to exercise your data rights, please contact our
                administrative team directly:
                <br />
                <br />
                <br />
                <strong>Support Portal:</strong>{" "}
                <a
                  href="https://zen-tech.vercel.app/Contact"
                  className="enterprise-link"
                >
                  Zen-Tech Support
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* ENTERPRISE FOOTER */}
        <footer
          className="w-100 py-4 bg-white"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
              <span
                className="fw-bold fs-5"
                style={{ color: "var(--enterprise-primary)" }}
              >
                Zen-Tech
              </span>
              <p
                className="mb-0 fs-6 ms-3 ps-3"
                style={{
                  color: "var(--enterprise-secondary)",
                  borderLeft: "1px solid var(--border-color)",
                }}
              >
                © {currentYear || "2026"} T-Service Group. All rights reserved.
              </p>
            </div>
            <div className="d-flex gap-4">
              <Link href="/Contact" className="enterprise-link text-muted">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
