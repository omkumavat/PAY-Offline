import { useEffect } from "react";

export const Pay = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upi = params.get("upi");

    if (upi) {
      const decoded = decodeURIComponent(upi);

      // redirect from browser context (works properly)
      window.location.href = decoded;
    }
  }, []);

  return <h2>Redirecting to UPI app...</h2>;
}