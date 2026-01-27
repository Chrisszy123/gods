// app/payment/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import localFont from "next/font/local";

const cogsBolts = localFont({
  src: "../../fonts/cogs_and_bolts/cogs_and_bolts.ttf",
  variable: "--font-cogs",
  display: "swap",
});

const nexa = localFont({
  src: [
    { path: "../../fonts/nexa/Nexa-ExtraLight.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/nexa/Nexa-Heavy.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-nexa",
  display: "swap",
});

type PaymentStatus = "verifying" | "success" | "failed";

interface PaymentData {
  name: string;
  email: string;
  category: string;
  amount: number;
  reference: string;
}

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const reference = searchParams.get("reference");
    
    if (!reference) {
      setStatus("failed");
      setError("No payment reference found");
      return;
    }

    // Verify payment
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify?reference=${reference}`);
        const data = await response.json();

        if (data.verified && data.status) {
          setStatus("success");
          setPaymentData(data.data);
        } else {
          setStatus("failed");
          setError(data.error || "Payment verification failed");
        }
      } catch (err) {
        setStatus("failed");
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <main
      className={`${cogsBolts.variable} ${nexa.variable} min-h-screen bg-black text-white flex items-center justify-center p-6 font-[var(--font-nexa)]`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 md:p-12">
          {status === "verifying" && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#febf53] border-t-transparent mb-6" />
              <h1 className={`${cogsBolts.className} text-3xl font-bold mb-4`}>
                Verifying Payment
              </h1>
              <p className={`${nexa.className} text-gray-400`}>Please wait while we confirm your payment...</p>
            </div>
          )}

          {status === "success" && paymentData && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6"
              >
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <h1 className={`${cogsBolts.className} text-4xl font-bold mb-4 text-[#febf53]`}>
                Registration Complete! 🎭
              </h1>
              
              <p className={`${nexa.className} text-xl mb-8 text-gray-300`}>
                Welcome to <strong>Gods of the Stage</strong>, {paymentData.name}!
              </p>

              <div className="bg-black/50 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                <h2 className={`${cogsBolts.className} text-lg font-semibold mb-4 text-[#febf53]`}>
                  Registration Details
                </h2>
                <div className={`${nexa.className} space-y-3 text-sm`}>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-semibold">{paymentData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold">{paymentData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-semibold capitalize">{paymentData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Paid:</span>
                    <span className="font-semibold">₦{paymentData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span className="font-semibold text-xs">{paymentData.reference}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#febf53]/10 border border-[#febf53]/30 rounded-2xl p-6 mb-8">
                <p className={`${nexa.className} text-sm text-gray-300`}>
                  📧 A confirmation email has been sent to <strong>{paymentData.email}</strong>
                  <br />
                  <span className="text-xs text-gray-400 mt-2 block">
                    Check your inbox (and spam folder) for audition details and next steps.
                  </span>
                </p>
              </div>

              <button
                onClick={() => router.push("/")}
                className={`${nexa.className} rounded-2xl bg-gradient-to-r from-[#febf53] to-[#d5421e] px-8 py-4 font-semibold text-black transition hover:scale-105 active:scale-95`}
              >
                Back to Home
              </button>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6"
              >
                <svg
                  className="w-12 h-12 text-red-500"
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
              </motion.div>

              <h1 className={`${cogsBolts.className} text-3xl font-bold mb-4 text-red-500`}>
                Payment Failed
              </h1>
              
              <p className={`${nexa.className} text-gray-400 mb-8`}>
                {error || "We couldn't verify your payment. Please try again."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className={`${nexa.className} rounded-2xl border border-white/30 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white hover:text-black`}
                >
                  Back to Home
                </button>
                <button
                  onClick={() => router.push("/#apply")}
                  className={`${nexa.className} rounded-2xl bg-gradient-to-r from-[#febf53] to-[#d5421e] px-8 py-4 font-semibold text-black transition hover:scale-105 active:scale-95`}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
