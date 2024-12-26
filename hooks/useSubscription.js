import { useState, useEffect } from "react";

export default function useSubscription(subscriptionFn) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {}; // Initialize with empty function

    const setupSubscription = async () => {
      try {
        setLoading(true);
        // Await the subscription setup
        unsubscribe = await subscriptionFn();
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  return { loading, error };
}
