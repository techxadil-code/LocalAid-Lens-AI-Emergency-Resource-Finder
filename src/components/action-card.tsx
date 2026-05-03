"use client";

import { CATEGORIES, URGENCY_LEVELS, type EmergencyRequest } from "@/lib/schemas";
import { UrgencyBadge } from "./urgency-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Wind,
  Home,
  Pill,
  Siren,
  CircleHelp,
  Phone,
  MapPin,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  blood: Droplets,
  oxygen: Wind,
  shelter: Home,
  medicine: Pill,
  rescue: Siren,
  other: CircleHelp,
};

const STATUS_CONFIG = {
  new: { label: "New", className: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
  verifying: { label: "Verifying", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" },
  in_progress: { label: "In Progress", className: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
  resolved: { label: "Resolved", className: "bg-green-500/10 text-green-500 border-green-500/30" },
  duplicate: { label: "Duplicate", className: "bg-gray-500/10 text-gray-500 border-gray-500/30" },
  expired: { label: "Expired", className: "bg-red-500/10 text-red-500 border-red-500/30" },
};

interface ActionCardProps {
  request: EmergencyRequest;
  onTakeCharge?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  isUpdating?: boolean;
  className?: string;
}

export function ActionCard({
  request,
  onTakeCharge,
  onStatusChange,
  isUpdating,
  className,
}: ActionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const CategoryIcon = CATEGORY_ICONS[request.category] || CircleHelp;
  const categoryMeta = CATEGORIES[request.category] || CATEGORIES.other;
  const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.new;
  const urgencyLevel = URGENCY_LEVELS[request.urgency_score as keyof typeof URGENCY_LEVELS] || URGENCY_LEVELS[1];

  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5",
        "border-l-4 backdrop-blur-sm",
        request.urgency_score >= 4 && "ring-1 ring-red-500/20",
        className
      )}
      style={{ borderLeftColor: urgencyLevel.color }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${categoryMeta.color} 0%, transparent 60%)`,
        }}
      />

      <CardHeader className="pb-2 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center size-10 rounded-xl shrink-0"
              style={{
                backgroundColor: `${categoryMeta.color}15`,
                color: categoryMeta.color,
              }}
            >
              <CategoryIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {request.structured_data?.summary || "Emergency Request"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-medium", statusConfig.className)}
                >
                  {statusConfig.label}
                </Badge>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  {timeAgo(request.created_at)}
                </span>
              </div>
            </div>
          </div>
          <UrgencyBadge score={request.urgency_score} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="relative space-y-3 pt-0">
        {/* Contact & Location Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {request.contact_info?.phone && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="size-3.5 text-green-500" />
              <span className="truncate">{request.contact_info.phone}</span>
            </div>
          )}
          {request.contact_info?.name && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="size-3.5 text-blue-500" />
              <span className="truncate">{request.contact_info.name}</span>
            </div>
          )}
          {(request.location_data?.city || request.location_data?.address) && (
            <div className="flex items-center gap-1.5 text-muted-foreground col-span-full">
              <MapPin className="size-3.5 text-red-500 shrink-0" />
              <span className="truncate">
                {[request.location_data?.address, request.location_data?.city]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Verification Flags */}
        {request.verification_flags && request.verification_flags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {request.verification_flags.map((flag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20"
              >
                <AlertTriangle className="size-2.5" />
                {flag}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Details */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
            {request.raw_content && (
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Raw Content
                </p>
                <p className="text-xs text-foreground/80 bg-muted/50 rounded-lg p-2.5 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                  {request.raw_content}
                </p>
              </div>
            )}
            {request.structured_data?.blood_group && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-muted-foreground">
                  Blood Group:
                </span>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">
                  {request.structured_data.blood_group}
                </Badge>
              </div>
            )}
            {request.structured_data?.hospital_name && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-muted-foreground">
                  Hospital:
                </span>
                <span>{request.structured_data.hospital_name}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-2 pt-1">
          {request.status === "new" && onTakeCharge && (
            <Button
              size="sm"
              onClick={() => onTakeCharge(request.id)}
              disabled={isUpdating}
              className="h-8 px-3 text-xs font-semibold gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              {isUpdating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              Take Charge
            </Button>
          )}
          {request.status === "verifying" && onStatusChange && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(request.id, "resolved")}
              disabled={isUpdating}
              className="h-8 px-3 text-xs font-semibold gap-1.5 border-green-500/30 text-green-600 hover:bg-green-500/10"
            >
              {isUpdating ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )}
              Mark Resolved
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2 text-xs text-muted-foreground ml-auto"
          >
            {isExpanded ? (
              <>
                Less <ChevronUp className="size-3.5" />
              </>
            ) : (
              <>
                More <ChevronDown className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
