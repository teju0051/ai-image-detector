"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentYear, setCurrentYear] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  // States for Features
  const [usageCount, setUsageCount] = useState(0);
  const [showModal, setShowModal] = useState(false); // MSME Modal
  const [showCyberModal, setShowCyberModal] = useState(false); // Cyber Crime Modal
  const MAX_LIMIT = 10;

  const fileInputRef = useRef(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());

    // Load daily usage from local storage
    const today = new Date().toISOString().split("T")[0];
    const storedData = localStorage.getItem("zentech_usage");

    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.date === today) {
        setUsageCount(parsed.count);
      } else {
        localStorage.setItem(
          "zentech_usage",
          JSON.stringify({ date: today, count: 0 }),
        );
        setUsageCount(0);
      }
    } else {
      localStorage.setItem(
        "zentech_usage",
        JSON.stringify({ date: today, count: 0 }),
      );
    }

    // Simplified Intersection Observer (only for lower sections to prevent hiding main UI)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".reveal-element").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const validateAndSetFile = (file) => {
    if (usageCount >= MAX_LIMIT) return;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 5MB.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleImageChange = (e) => validateAndSetFile(e.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    if (usageCount < MAX_LIMIT) setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (usageCount >= MAX_LIMIT) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    if (usageCount >= MAX_LIMIT) {
      alert(
        "Your 10 daily limit reached. Please wait for another 24 hours or upgrade your plan.",
      );
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResult(data);

      // Increment and save usage count
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(
        "zentech_usage",
        JSON.stringify({ date: today, count: newCount }),
      );
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
  };

  const getProbabilities = () => {
    if (!result) return { ai: 0, real: 0 };
    const aiScore = parseFloat(result.confidence);
    const realScore = 100 - aiScore;
    return { ai: aiScore.toFixed(1), real: realScore.toFixed(1) };
  };

  const probs = getProbabilities();

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Cybersecurity Analyst",
      text: "Incredible accuracy. It instantly flagged fake AI images that our manual checks completely missed.",
    },
    {
      name: "Ingrid Olsen",
      role: "Media Verifier",
      text: "This tool is a game changer for our newsroom's daily fact-checking process. It's so easy to use.",
    },
    {
      name: "Amit Desai",
      role: "IT Director",
      text: "A very clean design and lightning-fast results. We integrated this into our daily workflow immediately.",
    },
    {
      name: "Lars Johansen",
      role: "Digital Investigator",
      text: "The percentage breakdown is highly detailed. Easily the most reliable AI detector on the market right now.",
    },
    {
      name: "Priya Patel",
      role: "Content Moderator",
      text: "We process thousands of pictures daily. This tool ensures we never accidentally publish AI-generated content.",
    },
    {
      name: "Henrik Bakken",
      role: "Security Consultant",
      text: "The fact that they delete the images instantly gives our enterprise clients total peace of mind.",
    },
  ];

  const faqs = [
    {
      q: "What happens to the images I upload?",
      a: "Your privacy is our priority. Your images are scanned in real-time and then instantly deleted forever. We never save, store, or share your pictures.",
    },
    {
      q: "Which AI image creators can this detect?",
      a: "Our system is trained to spot hidden signs from all major AI tools, including Midjourney, DALL-E 3, Stable Diffusion, and Adobe Firefly.",
    },
    {
      q: "How accurate is the 99.98% number?",
      a: "We tested our tool on over 1.2 million images (a mix of real photos and AI images) to ensure it gets the right answer 99.98% of the time.",
    },
    {
      q: "Can I use this for my business website?",
      a: "Yes! Our Pro and Enterprise plans allow you to connect our tool directly to your website or app so you can check images automatically.",
    },
  ];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --neon-blue: #00f2fe;
          --neon-purple: #4facfe;
          --bg-dark: #050505;
          --glass-bg: rgba(20, 20, 25, 0.4);
          --glass-border: rgba(255, 255, 255, 0.08);
        }

        @keyframes aurora {
          0% { background-position: 50% 50%, 50% 50%; }
          100% { background-position: 350% 50%, 350% 50%; }
        }
        @keyframes float3D {
          0% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(-5px) rotateX(1deg) rotateY(1deg); }
          100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
        }
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0; box-shadow: 0 0 0px var(--neon-blue); }
          10% { opacity: 1; box-shadow: 0 0 20px var(--neon-blue); }
          90% { opacity: 1; box-shadow: 0 0 20px var(--neon-blue); }
          100% { top: 100%; opacity: 0; box-shadow: 0 0 0px var(--neon-blue); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        body, html {
          background-color: var(--bg-dark);
          color: #fff;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        .awwwards-bg {
          background-color: var(--bg-dark);
          background-image: 
            radial-gradient(ellipse at 100% 0%, rgba(79, 172, 254, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(0, 242, 254, 0.12) 0%, transparent 50%);
          background-size: 200% 200%;
          animation: aurora 20s linear infinite alternate;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .bento-item {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 1.5rem;
          padding: 2rem;
          transition: all 0.4s ease;
        }
        .bento-item:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 242, 254, 0.3);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 254, 0.1);
        }

        .reveal-element { opacity: 0; }
        .reveal-visible { animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        
        .text-gradient {
          background: linear-gradient(to right, #ffffff, #a0aec0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-neon {
          background: linear-gradient(135deg, var(--neon-blue) 0%, var(--neon-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-premium {
          background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple), var(--neon-blue));
          background-size: 200% auto;
          color: #000 !important;
          border: none;
          transition: 0.5s;
        }
        .btn-premium:hover {
          background-position: right center;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
          transform: scale(1.02);
        }

        .scanner-card {
          background: rgba(10, 10, 12, 0.9);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 2rem;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
          animation: float3D 8s ease-in-out infinite;
        }
        
        .laser {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: var(--neon-blue);
          animation: scanLaser 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 10;
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
      `,
        }}
      />

      {/* ACCREDITATION POPUP MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="bento-item position-relative p-5 text-center"
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            ></button>

            <img
              src="https://iipcindia.com/public/img/accreditations/accreditation2.png"
              alt="Accreditation"
              style={{ height: "70px", marginBottom: "1.5rem" }}
            />
            <h4 className="fw-bolder text-white mb-3">Official Recognition</h4>
            <p className="text-neon fw-bold mb-4 fs-5">
              Government of India Recognized MSME.
            </p>

            <p className="mb-4" style={{ color: "#cbd5e1", lineHeight: "1.6" }}>
              This Website is Owned by Zen-Tech India and is Operated and
              Maintained by T-Service Group (International). For authenticity,
              this is developed in India and the company that made this is
              Zen-Tech India.
            </p>

            <div
              className="p-4 rounded-3 mb-4"
              style={{
                background: "rgba(0, 242, 254, 0.05)",
                border: "1px solid rgba(0, 242, 254, 0.2)",
              }}
            >
              <p className="small mb-3 text-white">
                Zen-Tech India is a verified and registered enterprise under the
                Ministry of Micro, Small & Medium Enterprises. We are committed
                to delivering digital excellence that aligns with India's
                national standards.
              </p>
              <h5 className="fw-bold mb-0 text-neon pt-3 border-top border-secondary border-opacity-25 mt-2">
                Udyam Registration No. UDYAM-MH-27-0214642
              </h5>
            </div>

            <button
              className="btn btn-premium rounded-pill px-5 py-2 fw-bold"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CYBER CRIME AWARENESS MODAL */}
      {showCyberModal && (
        <div className="modal-overlay" onClick={() => setShowCyberModal(false)}>
          <div
            className="bento-item position-relative p-5 text-center"
            style={{
              maxWidth: "600px",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              background: "rgba(30, 10, 10, 0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
              onClick={() => setShowCyberModal(false)}
              aria-label="Close"
            ></button>

            <div className="mb-4 text-danger d-flex justify-content-center w-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
            </div>
            <h3 className="fw-bolder text-white mb-3">Important Notice</h3>

            <p className="fs-5 mb-4 text-white" style={{ lineHeight: "1.6" }}>
              Please don't misuse the portal you are about to visit.
            </p>
            <div
              className="p-4 rounded-3 mb-4"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <p className="mb-0 text-white fw-medium">
                Make sure to give as many details as possible for the
                investigation to help authorities take strict action.
              </p>
              <p className="mt-3 mb-0 text-danger fw-bold">
                — Regards, Zen-Tech Cyber Team
              </p>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold"
                onClick={() => setShowCyberModal(false)}
              >
                Cancel
              </button>
              <a
                href="https://sancharsaathi.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-danger rounded-pill px-4 py-2 fw-bold"
                onClick={() => setShowCyberModal(false)}
              >
                Proceed to Portal
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="min-vh-100 d-flex flex-column awwwards-bg">
        {/* PURE WHITE NAV BAR */}
        <header
          className="w-100 bg-white shadow-sm py-3 px-4 px-md-5 d-flex justify-content-between align-items-center sticky-top"
          style={{ zIndex: 1000 }}
        >
          {/* Left: Logo */}
          <div className="d-flex align-items-center" style={{ flex: "1" }}>
            <img
              src="https://zen-tech.vercel.app/Assets/zt-portrait-logo.png"
              alt="Zen-Tech Logo"
              style={{ height: "65px", width: "auto", objectFit: "contain" }}
            />
          </div>

          {/* Center: Navigation Links with text-nowrap to prevent stacking */}
          <nav
            className="d-none d-md-flex align-items-center justify-content-center gap-4 gap-lg-5"
            style={{ flex: "auto" }}
          >
            <a
              href="#how-it-works"
              className="text-decoration-none fw-bold fs-5 text-uppercase text-nowrap tracking-tight"
              style={{ color: "#334155", letterSpacing: "1px" }}
            >
              How it Works
            </a>
            <a
              href="#who-is-this-for"
              className="text-decoration-none fw-bold fs-5 text-uppercase text-nowrap tracking-tight"
              style={{ color: "#334155", letterSpacing: "1px" }}
            >
              Use Cases
            </a>
            <a
              href="#pricing"
              className="text-decoration-none fw-bold fs-5 text-uppercase text-nowrap tracking-tight"
              style={{ color: "#334155", letterSpacing: "1px" }}
            >
              Pricing
            </a>
          </nav>

          {/* Right: Accreditation Icon */}
          <div
            className="d-flex align-items-center justify-content-end"
            style={{ flex: "1" }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setShowModal(true)}
              title="View Recognition"
            >
              <img
                src="https://iipcindia.com/public/img/accreditations/accreditation2.png"
                alt="Accredited"
                style={{ height: "55px", width: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </header>

        {/* 1. HERO & SCANNER */}
        <main
          className="container-fluid d-flex flex-column align-items-center justify-content-center py-5"
          style={{ minHeight: "85vh" }}
        >
          <div
            className="text-center mb-5 w-100 mt-4"
            style={{ maxWidth: "900px" }}
          >
            <h1
              className="display-3 fw-bolder mb-4 text-gradient"
              style={{ letterSpacing: "-2px", lineHeight: "1.1" }}
            >
              Check if an image is
              <br />
              Real or AI-Generated.
            </h1>
            <p
              className="lead fw-normal mx-auto"
              style={{ color: "#94a3b8", maxWidth: "600px" }}
            >
              Upload any picture to see if it was made by a human or an AI.
              Trusted by over 100,000 users with 99.98% accuracy.
            </p>
          </div>

          {/* THE 3D SCANNER CARD */}
          <div
            className="scanner-card w-100 mb-5"
            style={{ maxWidth: "1100px" }}
          >
            <div className="row g-0">
              {/* Centered Interactive Dropzone */}
              <div
                className="col-md-6 p-4 p-md-5 position-relative d-flex flex-column align-items-center justify-content-center"
                style={{ borderRight: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <div
                  className="d-flex flex-column align-items-center justify-content-center rounded-4 position-relative transition-all h-100 w-100 overflow-hidden"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!loading && usageCount < MAX_LIMIT)
                      fileInputRef.current?.click();
                  }}
                  style={{
                    minHeight: "450px",
                    cursor:
                      usageCount >= MAX_LIMIT
                        ? "not-allowed"
                        : loading
                          ? "wait"
                          : "pointer",
                    border:
                      usageCount >= MAX_LIMIT
                        ? "2px dashed rgba(239,68,68,0.3)"
                        : isDragging
                          ? "2px solid #00f2fe"
                          : "2px dashed rgba(255, 255, 255, 0.1)",
                    background:
                      usageCount >= MAX_LIMIT
                        ? "rgba(239,68,68,0.05)"
                        : isDragging
                          ? "rgba(0, 242, 254, 0.05)"
                          : "transparent",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <input
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    disabled={loading || usageCount >= MAX_LIMIT}
                  />

                  {usageCount >= MAX_LIMIT ? (
                    <div className="text-center p-4 d-flex flex-column align-items-center justify-content-center w-100 h-100">
                      <div className="mb-4 text-danger opacity-75 d-flex justify-content-center w-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="96"
                          height="96"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                        </svg>
                      </div>
                      <h3 className="fw-bolder mb-2 text-white">
                        Daily Limit Reached
                      </h3>
                      <p className="mb-0 fs-5 text-danger px-3">
                        Your 10 daily limit is reached. Please wait for another
                        24 hours or upgrade your plan.
                      </p>
                    </div>
                  ) : imagePreview ? (
                    <div className="p-4 w-100 h-100 d-flex flex-column align-items-center justify-content-center position-relative">
                      {loading && <div className="laser"></div>}
                      <div className="position-relative w-100 d-flex justify-content-center">
                        <img
                          src={imagePreview}
                          alt="Target Image"
                          className="img-fluid rounded-3 shadow-lg"
                          style={{
                            maxHeight: "350px",
                            objectFit: "contain",
                            filter: loading
                              ? "contrast(120%) brightness(80%) sepia(20%) hue-rotate(180deg)"
                              : "none",
                            transition: "filter 0.5s ease",
                          }}
                        />
                        {loading && (
                          <div
                            className="position-absolute top-50 start-50 translate-middle text-neon fw-bolder fs-3"
                            style={{
                              textShadow: "0 0 20px #00f2fe",
                              mixBlendMode: "difference",
                            }}
                          >
                            SCANNING
                          </div>
                        )}
                      </div>
                      <span
                        className="badge rounded-pill mt-4 px-3 py-2 fw-normal"
                        style={{
                          background: "rgba(0,0,0,0.6)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#94a3b8",
                        }}
                      >
                        {image.name}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center p-4 d-flex flex-column align-items-center justify-content-center w-100 h-100">
                      <div className="mb-4 text-white opacity-50 d-flex justify-content-center w-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="96"
                          height="96"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                        </svg>
                      </div>
                      <h3
                        className="fw-bolder mb-2 text-white"
                        style={{ letterSpacing: "1px" }}
                      >
                        Upload Your Image
                      </h3>
                      <p className="mb-0 fs-5" style={{ color: "#64748b" }}>
                        Drag & drop a picture here, or click to choose a file.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Results OR "How It Works" */}
              <div
                className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center"
                id="how-it-works"
              >
                {loading ? (
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center">
                    <div
                      className="spinner-border mb-4"
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        color: "#00f2fe",
                      }}
                      role="status"
                    ></div>
                    <h5
                      className="fw-bolder text-neon"
                      style={{ letterSpacing: "3px" }}
                    >
                      ANALYZING IMAGE...
                    </h5>
                    <p className="fs-5" style={{ color: "#64748b" }}>
                      Looking for hidden signs of AI generation...
                    </p>
                  </div>
                ) : result ? (
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <h5
                      className="text-uppercase fw-bold mb-4 pb-3 text-white"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        letterSpacing: "2px",
                      }}
                    >
                      Detection Results
                    </h5>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span
                          className="fw-bold fs-5"
                          style={{ color: "#10b981", letterSpacing: "1px" }}
                        >
                          Real Photograph
                        </span>
                        <span
                          className="fw-bold fs-5"
                          style={{ color: "#10b981" }}
                        >
                          {probs.real}%
                        </span>
                      </div>
                      <div
                        className="progress rounded-pill"
                        style={{
                          height: "8px",
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{
                            width: `${probs.real}%`,
                            background: "#10b981",
                            boxShadow: "0 0 15px rgba(16,185,129,0.5)",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="d-flex justify-content-between mb-2">
                        <span
                          className="fw-bold fs-5"
                          style={{ color: "#ef4444", letterSpacing: "1px" }}
                        >
                          AI Generated
                        </span>
                        <span
                          className="fw-bold fs-5"
                          style={{ color: "#ef4444" }}
                        >
                          {probs.ai}%
                        </span>
                      </div>
                      <div
                        className="progress rounded-pill"
                        style={{
                          height: "8px",
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{
                            width: `${probs.ai}%`,
                            background: "#ef4444",
                            boxShadow: "0 0 15px rgba(239,68,68,0.5)",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div
                      className="text-center mb-5 p-4 rounded-4"
                      style={{
                        background: result.isAi
                          ? "rgba(239, 68, 68, 0.05)"
                          : "rgba(16, 185, 129, 0.05)",
                        border: `1px solid ${result.isAi ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
                      }}
                    >
                      <h2
                        className={`fw-bolder m-0 ${result.isAi ? "text-danger" : "text-success"}`}
                        style={{
                          textShadow: `0 0 20px ${result.isAi ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`,
                        }}
                      >
                        {result.isAi
                          ? "THIS IMAGE IS AI GENERATED"
                          : "THIS IMAGE IS REAL"}
                      </h2>
                    </div>

                    <button
                      className="btn btn-outline-light py-3 fw-bold w-100 rounded-pill transition-all text-uppercase fs-5 mb-4"
                      onClick={resetScanner}
                      style={{ letterSpacing: "1px" }}
                    >
                      Scan Another Image
                    </button>

                    <div className="mt-2 px-2">
                      <div
                        className="d-flex justify-content-between mb-2"
                        style={{ fontSize: "0.9rem", color: "#94a3b8" }}
                      >
                        <span>Daily Free Scans Used</span>
                        <span className="fw-bold text-white">
                          {usageCount} / 10
                        </span>
                      </div>
                      <div
                        className="progress rounded-pill"
                        style={{
                          height: "6px",
                          background: "rgba(255,255,255,0.1)",
                        }}
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${(usageCount / 10) * 100}%`,
                            background: "var(--neon-purple)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <h5
                      className="text-uppercase fw-bold mb-5 text-white"
                      style={{ letterSpacing: "2px" }}
                    >
                      HOW IT WORKS
                    </h5>

                    <div className="d-flex flex-column gap-5">
                      <div className="d-flex align-items-start gap-4">
                        <div className="text-white flex-shrink-0 opacity-75">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="mb-2 fw-bold text-white">
                            Deep Image Scanning
                          </h5>
                          <p
                            className="fs-6 mb-0"
                            style={{ color: "#94a3b8", lineHeight: "1.6" }}
                          >
                            We look at the hidden data inside the picture to
                            find out exactly where it came from.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-start gap-4">
                        <div className="text-white flex-shrink-0 opacity-75">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="mb-2 fw-bold text-white">
                            Pixel Checker
                          </h5>
                          <p
                            className="fs-6 mb-0"
                            style={{ color: "#94a3b8", lineHeight: "1.6" }}
                          >
                            AI tools leave tiny mistakes that humans can't see,
                            but our scanner easily spots them.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-5 pt-4"
                      style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <button
                        className={`btn w-100 py-3 rounded-pill fw-bolder text-uppercase fs-5 ${usageCount >= MAX_LIMIT ? "btn-outline-danger" : "btn-premium"}`}
                        onClick={() => {
                          if (usageCount >= MAX_LIMIT) {
                            alert(
                              "Your 10 daily limit reached. Please wait for another 24 hours or upgrade your plan.",
                            );
                          } else {
                            analyzeImage();
                          }
                        }}
                        disabled={!image || loading}
                        style={{
                          opacity: image ? 1 : 0.5,
                          letterSpacing: "1px",
                        }}
                      >
                        {usageCount >= MAX_LIMIT
                          ? "Limit Reached"
                          : "Check Image"}
                      </button>

                      <div className="mt-4 px-2">
                        <div
                          className="d-flex justify-content-between mb-2"
                          style={{ fontSize: "0.9rem", color: "#94a3b8" }}
                        >
                          <span>Daily Free Scans Used</span>
                          <span className="fw-bold text-white">
                            {usageCount} / 10
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{
                            height: "6px",
                            background: "rgba(255,255,255,0.1)",
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(usageCount / 10) * 100}%`,
                              background: "var(--neon-purple)",
                              transition: "width 0.5s ease",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* 2. WHO IS THIS FOR? (NEW SECTION WITH IMAGES) */}
        <section
          id="who-is-this-for"
          className="w-100 py-5 position-relative bg-black bg-opacity-25"
        >
          <div className="container py-5">
            <div className="text-center mb-5 reveal-element">
              <h2
                className="display-5 fw-bolder text-white mb-3"
                style={{ letterSpacing: "-1px" }}
              >
                Who Can Use This?
              </h2>
              <p className="fs-5" style={{ color: "#94a3b8" }}>
                Our tool is designed for anyone who needs to know the truth.
              </p>
            </div>

            <div className="row g-4 reveal-element delay-1">
              {/* Card 1 */}
              <div className="col-12 col-md-4">
                <div className="bento-item p-0 overflow-hidden h-100 d-flex flex-column">
                  <img
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80"
                    alt="Journalists"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      opacity: 0.8,
                    }}
                  />
                  <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold text-white mb-2">
                      Journalists & Media
                    </h4>
                    <p className="mb-0" style={{ color: "#94a3b8" }}>
                      Ensure the news you report is accurate by checking if
                      breaking news photos are real or fake AI edits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-12 col-md-4">
                <div className="bento-item p-0 overflow-hidden h-100 d-flex flex-column">
                  <img
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80"
                    alt="Content Creators"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      opacity: 0.8,
                    }}
                  />
                  <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold text-white mb-2">
                      Content Creators
                    </h4>
                    <p className="mb-0" style={{ color: "#94a3b8" }}>
                      Check images before sharing them on social media so you
                      never accidentally spread fake content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-12 col-md-4">
                <div className="bento-item p-0 overflow-hidden h-100 d-flex flex-column">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
                    alt="Enterprises"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      opacity: 0.8,
                    }}
                  />
                  <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold text-white mb-2">
                      Businesses & Security
                    </h4>
                    <p className="mb-0" style={{ color: "#94a3b8" }}>
                      Verify ID cards, insurance claims, and important documents
                      to protect your business from fraud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CYBER CRIME AWARENESS POSTER */}
        <section className="w-100 py-5">
          <div className="container py-4">
            <div
              className="bento-item text-center p-5 reveal-element"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(153, 27, 27, 0.1) 100%)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                boxShadow: "0 20px 40px rgba(239, 68, 68, 0.15)",
              }}
            >
              <div className="mb-4 text-danger d-flex justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
              <h2 className="display-6 fw-bolder text-white mb-3">
                Cyber Crime Awareness
              </h2>
              <p
                className="fs-4 mb-5 text-white opacity-75"
                style={{ maxWidth: "800px", margin: "0 auto" }}
              >
                Scammed by deep fake images or getting blackmailed? Report it
                immediately to the authorities.
              </p>
              <button
                onClick={() => setShowCyberModal(true)}
                className="btn btn-danger btn-lg rounded-pill px-5 py-3 fw-bold text-uppercase fs-5"
                style={{
                  letterSpacing: "1px",
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
                }}
              >
                Report to Sanchar Saathi
              </button>
            </div>
          </div>
        </section>

        {/* 4. PRICING PLANS */}
        <section id="pricing" className="w-100 py-5">
          <div className="container py-5">
            <div className="text-center mb-5 reveal-element">
              <h2
                className="display-5 fw-bolder text-white mb-3"
                style={{ letterSpacing: "-1px" }}
              >
                Simple Pricing Plans
              </h2>
              <p className="fs-5" style={{ color: "#94a3b8" }}>
                Choose the plan that fits you best.
              </p>
            </div>

            <div className="row g-4 justify-content-center align-items-stretch reveal-element delay-2">
              {/* Free Plan */}
              <div className="col-12 col-lg-4">
                <div className="bento-item h-100 d-flex flex-column p-5">
                  <div className="mb-4">
                    <h3 className="fw-bold text-white mb-2">Starter</h3>
                    <h1 className="display-4 fw-bolder text-white mb-3">
                      Free
                    </h1>
                    <p className="fs-6" style={{ color: "#94a3b8" }}>
                      Great for personal, everyday use.
                    </p>
                  </div>

                  <a
                    href="https://zen-tech.vercel.app/Contact"
                    className="btn btn-outline-light w-100 py-3 mb-5 fw-bold rounded-pill text-uppercase fs-6"
                    style={{ letterSpacing: "1px" }}
                  >
                    Get Started
                  </a>

                  <ul className="list-unstyled mb-0 d-flex flex-column gap-4 mt-auto">
                    {[
                      "Check if an image is real or AI",
                      "Access to our best scanner",
                      "We don't save your images",
                      "Works with JPG, PNG, and WEBP",
                      "Standard checking speed",
                      "Check up to 10 images per day",
                      "Community Help & Support",
                    ].map((item, i) => (
                      <li key={i} className="d-flex align-items-start gap-3">
                        <span className="text-neon fs-5">✔</span>
                        <span className="fw-medium text-white opacity-75 fs-6">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="col-12 col-lg-4">
                <div
                  className="bento-item h-100 d-flex flex-column p-5 position-relative"
                  style={{
                    border: "2px solid var(--neon-blue)",
                    boxShadow: "0 0 40px rgba(0, 242, 254, 0.15)",
                  }}
                >
                  <div
                    className="position-absolute top-0 start-50 translate-middle badge rounded-pill px-4 py-2 text-dark fw-bold fs-6"
                    style={{
                      background: "var(--neon-blue)",
                      letterSpacing: "2px",
                    }}
                  >
                    RECOMMENDED
                  </div>
                  <div className="mb-4 mt-2">
                    <h3 className="fw-bold text-white mb-2">Professional</h3>
                    <div className="d-flex align-items-baseline mb-3">
                      <h1 className="display-4 fw-bolder text-neon mb-0">
                        ₹99
                      </h1>
                      <span className="ms-2 fs-5" style={{ color: "#94a3b8" }}>
                        /mo
                      </span>
                    </div>
                    <p className="fs-6" style={{ color: "#94a3b8" }}>
                      For people who check a lot of images.
                    </p>
                  </div>

                  <a
                    href="https://zen-tech.vercel.app/Contact"
                    className="btn btn-premium w-100 py-3 mb-5 fw-bolder rounded-pill text-uppercase fs-6"
                    style={{ letterSpacing: "1px" }}
                  >
                    Purchase License
                  </a>

                  <ul className="list-unstyled mb-0 d-flex flex-column gap-4 mt-auto">
                    {[
                      "Everything in the Starter plan",
                      "See exactly which AI made the image",
                      "Read hidden image data (EXIF)",
                      "Check very large images",
                      "Super fast checking speed",
                      "Check as many images as you want",
                      "Priority email support",
                    ].map((item, i) => (
                      <li key={i} className="d-flex align-items-start gap-3">
                        <span className="text-neon fs-5">✔</span>
                        <span className="fw-medium text-white fs-6">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="col-12 col-lg-4">
                <div className="bento-item h-100 d-flex flex-column p-5">
                  <div className="mb-4">
                    <h3 className="fw-bold text-white mb-2">Enterprise</h3>
                    <div className="d-flex align-items-baseline mb-3">
                      <h1 className="display-4 fw-bolder text-white mb-0">
                        ₹999
                      </h1>
                      <span className="ms-2 fs-5" style={{ color: "#94a3b8" }}>
                        /mo
                      </span>
                    </div>
                    <p className="fs-6" style={{ color: "#94a3b8" }}>
                      For big companies and developers.
                    </p>
                  </div>

                  <a
                    href="https://zen-tech.vercel.app/Contact"
                    className="btn btn-outline-light w-100 py-3 mb-5 fw-bold rounded-pill text-uppercase fs-6"
                    style={{ letterSpacing: "1px" }}
                  >
                    Purchase License
                  </a>

                  <ul className="list-unstyled mb-0 d-flex flex-column gap-4 mt-auto">
                    {[
                      "Everything in the Pro plan",
                      "Find where this image is used online",
                      "Check social media for this image",
                      "Check multiple images at once",
                      "Your own dedicated helper",
                      "Connect this tool to your website",
                      "Create custom reports (PDF/CSV)",
                    ].map((item, i) => (
                      <li key={i} className="d-flex align-items-start gap-3">
                        <span className="text-neon fs-5">✔</span>
                        <span className="fw-medium text-white opacity-75 fs-6">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIALS */}
        <section className="w-100 py-5">
          <div className="container py-4">
            <div className="text-center mb-5 reveal-element">
              <h2 className="display-5 fw-bolder text-white">
                Trusted by Thousands
              </h2>
              <p className="fs-5" style={{ color: "#94a3b8" }}>
                See what people are saying about our tool.
              </p>
            </div>
            <div className="row g-4 reveal-element delay-1">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div className="bento-item h-100 p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-dark fw-bolder me-3 fs-5"
                        style={{
                          width: "50px",
                          height: "50px",
                          background:
                            "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold text-white">
                          {testimonial.name}
                        </h5>
                        <span className="text-neon fw-bold">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>
                    <p
                      className="card-text mb-0 fs-6"
                      style={{ fontStyle: "italic", color: "#cbd5e1" }}
                    >
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section className="w-100 py-5">
          <div
            className="container py-5 reveal-element"
            style={{ maxWidth: "800px" }}
          >
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bolder text-white">
                Frequently Asked Questions
              </h2>
              <p className="fs-5" style={{ color: "#94a3b8" }}>
                Everything you need to know about our tool.
              </p>
            </div>
            <div className="accordion border-0">
              {faqs.map((faq, index) => (
                <div
                  className="bento-item p-0 mb-3"
                  key={index}
                  style={{ padding: "0 !important" }}
                >
                  <div
                    className="p-4 d-flex justify-content-between align-items-center"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="mb-0 fw-bold text-white">{faq.q}</h5>
                    <span className="fs-4 text-neon">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </div>
                  {openFaq === index && (
                    <div
                      className="fs-6 px-4 pb-4"
                      style={{ color: "#94a3b8" }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CTA */}
        <section className="w-100 py-5 my-5 reveal-element">
          <div className="container py-5 text-center">
            <h1
              className="display-4 fw-bolder mb-4 text-white"
              style={{ letterSpacing: "-1px" }}
            >
              Ready to find out the truth?
            </h1>
            <p
              className="lead mb-5 mx-auto fs-4"
              style={{ color: "#94a3b8", maxWidth: "600px" }}
            >
              Join thousands of people who use our tool every day to spot fake
              images easily.
            </p>
            <button
              className="btn btn-premium btn-lg rounded-pill px-5 py-4 fw-bolder text-uppercase fs-5"
              style={{ letterSpacing: "2px" }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Start Scanning Now
            </button>
          </div>
        </section>

        {/* 8. MINIMAL FOOTER */}
        <footer
          className="w-100 py-4 border-top"
          style={{
            borderColor: "rgba(255,255,255,0.05) !important",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2 mb-3 mb-md-0">
              <span className="fw-bolder fs-4 text-white tracking-tight">
                Zen-Tech
              </span>
              <p
                className="mb-0 fw-medium fs-6 ms-3 ps-3 border-start border-secondary border-opacity-25"
                style={{ color: "#64748b" }}
              >
                © {currentYear || "2026"} All rights reserved.
              </p>
            </div>
            <div className="d-flex gap-4">
              <Link
                href="/pp"
                className="text-decoration-none fs-6 fw-semibold text-neon hover-white transition-all"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
