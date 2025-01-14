import { useState, useEffect } from "react";

export default function useSubscription(subscriptionFn, dependencies = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {}; // Initialize with empty function
    let mounted = true; // Add mounted flag

    const setupSubscription = async () => {
      try {
        if (mounted) {
          setLoading(true);
          // Await the subscription setup
          unsubscribe = await subscriptionFn();
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Subscription error:", err);
          setError(err);
          setLoading(false);
        }
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      mounted = false; // Set mounted to false before cleanup
      try {
        unsubscribe();
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };
  }, dependencies);

  return { loading, error };
}
