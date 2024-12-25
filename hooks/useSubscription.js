import { useState, useEffect } from "react";

export default function useSubscription(subscriptionFn, setData) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {}; // Initialize with empty function

    const setupSubscription = async () => {
      try {
        setLoading(true);
        // Await the subscription setup
        unsubscribe = await subscriptionFn(setData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      console.log(`Unsubscribed from ${subscriptionFn}`);
      unsubscribe();
    };
  }, [subscriptionFn]); // Add subscriptionFn to dependencies

  return { loading, error };
}
