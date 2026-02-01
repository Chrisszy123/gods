// components/PaymentModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaystackButton } from "react-paystack";
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  category: "vocalist" | "dancer" | "actor" | "performer" | "";
}

export default function PaymentModal({ isOpen, onClose, publicKey }: PaymentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
      });
      setPaymentConfig(null);
      setLoading(false);
      setIsSubmitting(false);
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting || loading) {
      console.log("Already submitting, ignoring...");
      return;
    }
    
    console.log("Form submitted", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    if (!publicKey) {
      setError("Paystack public key is not configured. Please check your .env.local file.");
      console.error("Missing Paystack public key");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError("");

    try {
      console.log("Initializing payment...");
      
      // Initialize payment
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API Response status:", response.status);
      
      const data = await response.json();
      console.log("API Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Set up Paystack config
      const config = {
        reference: data.data.reference,
        email: formData.email,
        amount: 300000, // ₦3000 in kobo
        publicKey: publicKey,
        text: "Pay Now",
        metadata: {
          name: formData.name,
          phone: formData.phone,
          category: formData.category,
        },
        onSuccess: (reference: any) => {
          console.log("Payment successful!", reference);
          setIsSubmitting(false);
          // Redirect to callback page
          window.location.href = `/payment/callback?reference=${reference.reference}`;
        },
        onClose: () => {
          console.log("Payment popup closed");
          setLoading(false);
          setIsSubmitting(false);
        },
      };
      
      console.log("Setting payment config:", config);
      setPaymentConfig(config);

      // Trigger the Paystack button click programmatically after config is set
      setTimeout(() => {
        const paystackBtn = document.querySelector(".paystack-button") as HTMLButtonElement;
        console.log("Paystack button element:", paystackBtn);
        if (paystackBtn) {
          console.log("Clicking Paystack button...");
          paystackBtn.click();
          setLoading(false);
        } else {
          console.error("Paystack button not found!");
          setError("Payment initialization failed. Please try again.");
          setLoading(false);
          setIsSubmitting(false);
        }
      }, 300);
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
      setIsSubmitting(false);
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
                <div className="mt-3 flex items-center gap-2 text-[#febf53]">
                  <span className={`${cogsBolts.className} text-xl font-bold`}>₦3,000</span>
                  <span className="text-sm text-gray-400">Registration Fee</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className={`${nexa.className} block text-sm font-medium text-gray-300 mb-2`}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${nexa.className} w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#febf53] transition`}
                    placeholder="Enter your full name"
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
                    <option value="vocalist">🎤 Musician</option>
                    <option value="dancer">💃 Dancers</option>
                    <option value="actor">🎭 Creative Arts</option>
                    <option value="comedian">😆 Comedy</option>
                    <option value="poet">🗣️ Spoken Word & Poetry</option>
                    <option value="other">🤝 Special Skills /others</option>
                  </select>
                </div>

                {error && (
                  <div className={`${nexa.className} bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className={`${nexa.className} w-full rounded-xl bg-gradient-to-r from-[#febf53] to-[#d5421e] px-6 py-4 font-semibold text-black transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>

                {/* Hidden Paystack Button */}
                {paymentConfig && (
                  <div style={{ display: 'none' }}>
                    <PaystackButton
                      {...paymentConfig}
                      className="paystack-button"
                    />
                  </div>
                )}
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
