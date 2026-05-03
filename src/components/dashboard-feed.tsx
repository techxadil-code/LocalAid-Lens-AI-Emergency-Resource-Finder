"use client";

import { useRealtimeRequests } from "@/hooks/use-realtime-requests";
import { ActionCard } from "./action-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wifi, WifiOff, Inbox } from "lucide-react";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export function DashboardFeed() {
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { requests, isLoading, isConnected, updateRequest } = useRealtimeRequests({
    status: statusFilter,
    category: categoryFilter,
  });

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleTakeCharge = useCallback(async (id: string) => {
    const user = session?.user as any;
    if (!user?.id) return;
    setUpdatingId(id);
    try {
      await updateRequest(id, { status: "verifying", assigned_to: user.id });
    } finally {
      setUpdatingId(null);
    }
  }, [session, updateRequest]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateRequest(id, { status: status as any, ...(status === "resolved" ? { resolved_at: new Date().toISOString() } : {}) });
    } finally {
      setUpdatingId(null);
    }
  }, [updateRequest]);

  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === "new").length,
    verifying: requests.filter((r) => r.status === "verifying").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <><Wifi className="size-3.5 text-green-500" /><span className="text-xs text-green-500 font-medium">Live</span></>
          ) : (
            <><WifiOff className="size-3.5 text-red-500" /><span className="text-xs text-red-500 font-medium">Offline</span></>
          )}
        </div>
        <div className="h-4 w-px bg-border" />
        <Badge variant="outline" className="text-xs gap-1">{stats.total} Total</Badge>
        <Badge variant="outline" className="text-xs gap-1 bg-blue-500/10 text-blue-500 border-blue-500/30">{stats.new} New</Badge>
        <Badge variant="outline" className="text-xs gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/30">{stats.verifying} Verifying</Badge>
        <Badge variant="outline" className="text-xs gap-1 bg-green-500/10 text-green-500 border-green-500/30">{stats.resolved} Resolved</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
          <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="verifying">Verifying</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(val) => val && setCategoryFilter(val)}>
          <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="blood">🩸 Blood</SelectItem>
            <SelectItem value="oxygen">💨 Oxygen</SelectItem>
            <SelectItem value="shelter">🏠 Shelter</SelectItem>
            <SelectItem value="medicine">💊 Medicine</SelectItem>
            <SelectItem value="rescue">🚨 Rescue</SelectItem>
            <SelectItem value="other">❓ Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 animate-spin text-violet-500" />
          <p className="text-sm text-muted-foreground">Loading emergency requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-muted/50">
            <Inbox className="size-10 text-muted-foreground/50" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">No requests yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">Emergency requests will appear here in real-time.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {requests.map((request, index) => (
            <div key={request.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <ActionCard
                request={request}
                onTakeCharge={handleTakeCharge}
                onStatusChange={handleStatusChange}
                isUpdating={updatingId === request.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
