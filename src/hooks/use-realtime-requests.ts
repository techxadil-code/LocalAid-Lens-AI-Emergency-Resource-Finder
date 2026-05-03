"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { EmergencyRequest } from "@/lib/schemas";

interface UseRealtimeRequestsOptions {
  status?: string;
  category?: string;
  urgency?: string;
}

export function useRealtimeRequests(options: UseRealtimeRequestsOptions = {}) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [isConnected, setIsConnected] = useState(false);

  const queryKey = ["emergency-requests", options];

  const {
    data: requests = [],
    isLoading,
    error,
    refetch,
  } = useQuery<EmergencyRequest[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options.status) params.set("status", options.status);
      if (options.category) params.set("category", options.category);
      if (options.urgency) params.set("urgency", options.urgency);

      const res = await fetch(`/api/requests?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      return data.requests || [];
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel("emergency-requests-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emergency_requests",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            queryClient.setQueryData<EmergencyRequest[]>(queryKey, (old = []) => [
              payload.new as EmergencyRequest,
              ...old,
            ]);
          } else if (payload.eventType === "UPDATE") {
            queryClient.setQueryData<EmergencyRequest[]>(queryKey, (old = []) =>
              old.map((req) =>
                req.id === (payload.new as EmergencyRequest).id
                  ? (payload.new as EmergencyRequest)
                  : req
              )
            );
          } else if (payload.eventType === "DELETE") {
            queryClient.setQueryData<EmergencyRequest[]>(queryKey, (old = []) =>
              old.filter(
                (req) => req.id !== (payload.old as { id: string }).id
              )
            );
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.status, options.category, options.urgency]);

  const updateRequest = useCallback(
    async (id: string, updates: Partial<EmergencyRequest>) => {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update request");
      return res.json();
    },
    []
  );

  return {
    requests,
    isLoading,
    error,
    isConnected,
    refetch,
    updateRequest,
  };
}
