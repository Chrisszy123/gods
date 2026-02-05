// components/PaymentModal.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import localFont from "next/font/local";

// Brand fonts
const cogsBolts = localFont({
  src: "../app/fonts/cogs_and_bolts/cogs_and_bolts.ttf",
  variable: "--font-cogs",
  display: "swap",
});

const nexa = localFont({
  src: [
    { path: "../app/fonts/nexa/Nexa-ExtraLight.ttf", weight: "400", style: "normal" },
    { path: "../app/fonts/nexa/Nexa-Heavy.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-nexa",
  display: "swap",
});

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicKey: string;
}

type RegistrationType = "individual" | "group";

interface FormData {
  registrationType: RegistrationType;
  name: string;
  email: string;
  phone: string;
  category: "musician" | "dancers" | "creative_arts" | "comedian" | "spoken_word_and_poetry" | "special_skills" | "";
  groupName?: string;
}

export default function PaymentModal({ isOpen, onClose, publicKey }: PaymentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    registrationType: "individual",
    name: "",
    email: "",
    phone: "",
    category: "",
    groupName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Ensure we're on the client side and load Paystack script
  useEffect(() => {
    setIsClient(true);
    
    // Load Paystack inline script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Countdown timer - Fixed end date for special offer
  useEffect(() => {
    // Set fixed end date: January 30, 2026 at 23:59:59 (UTC+1 WAT)
    // Change this date when you want to extend or end the offer
    const endDate = new Date('2026-02-08T23:59:59+01:00');
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        registrationType: "individual",
        name: "",
        email: "",
        phone: "",
        category: "",
        groupName: "",
      });
      setPaymentReference(null);
      setLoading(false);
      setError("");
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      setError("Please enter your full name");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    if (!formData.category) {
      setError("Please select a performance category");
      return false;
    }
    if (formData.registrationType === "group" && (!formData.groupName || formData.groupName.length < 2)) {
      setError("Please enter your group name");
      return false;
    }
    return true;
  };

  // Get amount based on registration type (Special offer prices during countdown)
  const getAmount = () => {
    return formData.registrationType === "individual" ? 300000 : 500000; // ₦3,000 or ₦5,000 in kobo
  };

  // Open Paystack popup directly using the inline script
  const openPaystackPopup = useCallback((reference: string) => {
    // Access the Paystack global from the inline script
    const PaystackPop = (window as any).PaystackPop;
    
    if (!PaystackPop) {
      setError("Payment service not available. Please refresh and try again.");
      setLoading(false);
      return;
    }

    const handler = PaystackPop.setup({
      key: publicKey,
      email: formData.email,
      amount: getAmount(),
      ref: reference,
      onClose: () => {
        console.log("Payment popup closed");
        setLoading(false);
        setPaymentReference(null);
      },
      callback: (response: any) => {
        console.log("Payment successful!", response);
        window.location.href = `/payment/callback?reference=${response.reference}`;
      },
    });
    
    handler.openIframe();
    setLoading(false);
  }, [publicKey, formData.email, getAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) {
      console.log("Already processing, ignoring...");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    if (!publicKey) {
      setError("Paystack public key is not configured. Please check your .env.local file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Initialize payment on backend
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Open Paystack popup directly
      setPaymentReference(data.data.reference);
      openPaystackPopup(data.data.reference);
      
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Don't render until we're on the client
  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Custom Styles for Autofill */}
          <style jsx global>{`
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.5) inset !important;
              -webkit-text-fill-color: #ffffff !important;
              caret-color: #ffffff !important;
              transition: background-color 5000s ease-in-out 0s;
            }
            
            /* Autofill styles for select */
            select:-webkit-autofill,
            select:-webkit-autofill:hover,
            select:-webkit-autofill:focus,
            select:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.5) inset !important;
              -webkit-text-fill-color: #ffffff !important;
              transition: background-color 5000s ease-in-out 0s;
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className={`${cogsBolts.variable} ${nexa.variable} bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 max-w-md w-full relative font-[var(--font-nexa)]`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className={`${cogsBolts.className} text-2xl font-bold text-white mb-2`}>
                  Register for Audition
                </h2>
                <p className={`${nexa.className} text-gray-400 text-sm`}>
                  Fill in your details to complete registration
                </p>
                
                {/* Registration Type Tabs */}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, registrationType: "individual" })}
                    className={`${nexa.className} flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      formData.registrationType === "individual"
                        ? "bg-[#febf53] text-black"
                        : "bg-black/50 text-gray-400 hover:text-white"
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, registrationType: "group" })}
                    className={`${nexa.className} flex-1 px-4 py-2 rounded-lg font-medium transition ${
                      formData.registrationType === "group"
                        ? "bg-[#febf53] text-black"
                        : "bg-black/50 text-gray-400 hover:text-white"
                    }`}
                  >
                    Group
                  </button>
                </div>

                {/* Pricing */}
                {formData.registrationType === "individual" ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <span className={`${nexa.className} text-3xl font-bold text-[#febf53]`}>
                        ₦3,000
                      </span>
                      <span className={`${nexa.className} text-lg text-gray-500 line-through`}>
                        ₦5,000
                      </span>
                      <span className={`${nexa.className} text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full`}>
                        40% OFF
                      </span>
                    </div>
                    
                    {/* Countdown Timer */}
                    <div className="mt-3 bg-[#febf53]/10 border border-[#febf53]/30 rounded-xl p-3">
                      <p className={`${nexa.className} text-xs text-[#febf53] mb-2`}>
                        ⏰ Special Offer Ends In:
                      </p>
                      <div className="flex gap-2 justify-center">
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.days).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Days</div>
                        </div>
                        <div className={`${cogsBolts.className} text-xl text-white`}>:</div>
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.hours).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Hours</div>
                        </div>
                        <div className={`${cogsBolts.className} text-xl text-white`}>:</div>
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.minutes).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Mins</div>
                        </div>
                        <div className={`${cogsBolts.className} text-xl text-white`}>:</div>
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.seconds).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Secs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <span className={`${nexa.className} text-3xl font-bold text-[#febf53]`}>
                        ₦5,000
                      </span>
                      <span className={`${nexa.className} text-lg text-gray-500 line-through`}>
                        ₦10,000
                      </span>
                      <span className={`${nexa.className} text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full`}>
                        50% OFF
                      </span>
                    </div>
                    
                    {/* Countdown Timer for Group */}
                    <div className="mt-3 bg-[#febf53]/10 border border-[#febf53]/30 rounded-xl p-3">
                      <p className={`${nexa.className} text-xs text-[#febf53] mb-2`}>
                        ⏰ Special Offer Ends In:
                      </p>
                      <div className="flex gap-2 justify-center">
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.days).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Days</div>
                        </div>
                        <div className={`${cogsBolts.className} text-xl text-white`}>:</div>
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.hours).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Hours</div>
                        </div>
                        <div className={`${cogsBolts.className} text-xl text-white`}>:</div>
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.minutes).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Mins</div>
                        </div>
                        <div className={`${cogsBolts.className} text-xl text-white`}>:</div>
                        <div className="text-center">
                          <div className={`${cogsBolts.className} text-xl text-white`}>
                            {String(timeLeft.seconds).padStart(2, '0')}
                          </div>
                          <div className={`${nexa.className} text-xs text-gray-400`}>Secs</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Group Name Field (only for group registration) */}
                {formData.registrationType === "group" && (
                  <div>
                    <label
                      htmlFor="groupName"
                      className={`${nexa.className} block text-sm font-medium text-gray-300 mb-2`}
                    >
                      Group Name *
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      name="groupName"
                      value={formData.groupName}
                      onChange={handleInputChange}
                      className={`${nexa.className} w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#febf53] transition`}
                      placeholder="Enter your group name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="name"
                    className={`${nexa.className} block text-sm font-medium text-gray-300 mb-2`}
                  >
                    {formData.registrationType === "group" ? "Contact Person Name *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${nexa.className} w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#febf53] transition`}
                    placeholder={formData.registrationType === "group" ? "Contact person's full name" : "Enter your full name"}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`${nexa.className} block text-sm font-medium text-gray-300 mb-2`}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${nexa.className} w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#febf53] transition`}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className={`${nexa.className} block text-sm font-medium text-gray-300 mb-2`}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${nexa.className} w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#febf53] transition`}
                    placeholder="08012345678"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className={`${nexa.className} block text-sm font-medium text-gray-300 mb-2`}
                  >
                    Performance Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`${nexa.className} w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#febf53] transition`}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="musician">🎤 Musician</option>
                    <option value="dancers">💃 Dancers</option>
                    <option value="creative_arts">🎭 Creative Arts</option>
                    <option value="comedian">😆 Comedy</option>
                    <option value="spoken_word_and_poetry">🗣️ Spoken Word & Poetry</option>
                    <option value="special_skills">🤝 Special Skills /others</option>
                  </select>
                </div>

                {error && (
                  <div className={`${nexa.className} bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`${nexa.className} w-full rounded-xl bg-gradient-to-r from-[#febf53] to-[#d5421e] px-6 py-4 font-semibold text-black transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </form>

              <p className={`${nexa.className} mt-4 text-xs text-gray-500 text-center`}>
                Secure payment powered by Paystack
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
