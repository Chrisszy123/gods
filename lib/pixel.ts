// lib/pixel.ts
// Helper functions for firing Meta Pixel events

export const fbq = (...args: any[]) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
};

export const trackLead = () => {
  fbq("track", "Lead");
};

export const trackInitiateCheckout = (amount: number, registrationType: string) => {
  fbq("track", "InitiateCheckout", {
    value: amount / 100,       // convert kobo to naira
    currency: "NGN",
    content_name: `Gods of the Stage - ${registrationType === "group" ? "Group" : "Individual"} Registration`,
  });
};

export const trackPurchase = (amount: number, reference: string, registrationType: string) => {
  fbq("track", "Purchase", {
    value: amount,             // already in naira on callback page
    currency: "NGN",
    content_name: `Gods of the Stage - ${registrationType === "group" ? "Group" : "Individual"} Registration`,
    content_ids: [reference],
  });
};
