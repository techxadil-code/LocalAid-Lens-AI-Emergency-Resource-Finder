import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(
      collection(db, "emergency_requests"), 
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firebase Timestamp to ISO string for compatibility
        created_at: (doc.data().created_at as Timestamp)?.toDate().toISOString(),
        resolved_at: (doc.data().resolved_at as Timestamp)?.toDate().toISOString() || null,
      }));
      setRequests(data);
      setLoading(false);
      
      // Also update TanStack Query cache so other components can benefit
      queryClient.setQueryData(["emergency_requests"], data);
    }, (err) => {
      console.error("Firestore error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [queryClient]);

  const updateRequest = async (id: string, updates: any) => {
    try {
      const docRef = doc(db, "emergency_requests", id);
      await updateDoc(docRef, {
        ...updates,
        // Ensure status-specific timestamps are handled if needed
        updated_at: Timestamp.now()
      });
    } catch (err) {
      console.error("Update error:", err);
      throw err;
    }
  };

  return { requests, loading, error, updateRequest };
}
