"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Calendar,
  CreditCard,
  Hash,
  PersonStanding,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  User,
} from "lucide-react";
import { IPOApplication } from "@/lib/types";
import { storageUtils } from "@/lib/storage";

interface IPOApplicationsTableProps {
  applications: IPOApplication[];
  onDelete: () => void;
}

type SortField =
  | "timestamp"
  | "ipoName"
  | "pan"
  | "ipoPrice"
  | "applicationNumber";
type SortDirection = "asc" | "desc";

export function IPOApplicationsTable({
  applications,
  onDelete,
}: IPOApplicationsTableProps) {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle different data types
    if (sortField === "timestamp") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (sortField === "ipoPrice") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleDelete = (id: string, ipoName: string) => {
    if (
      confirm(`Are you sure you want to delete the application for ${ipoName}?`)
    ) {
      storageUtils.deleteApplication(id);
      onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field ? (
          sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </span>
    </Button>
  );

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Hash className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No Applications Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find applications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[190px]">Name</TableHead>
              <TableHead className="w-[140px]">
                <SortButton field="applicationNumber">App Number</SortButton>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortButton field="pan">PAN</SortButton>
              </TableHead>
              <TableHead className="w-[200px]">
                <SortButton field="ipoName">IPO Name</SortButton>
              </TableHead>
              <TableHead className="w-[120px] text-right">
                <SortButton field="ipoPrice">IPO Price</SortButton>
              </TableHead>
              <TableHead className="w-[120px] text-right">
                Fixed Price
              </TableHead>
              {/* <TableHead className="w-[100px] text-right">Total</TableHead> */}
              <TableHead className="w-[140px]">
                <SortButton field="timestamp">Applied Date</SortButton>
              </TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplications.map((application) => (
              <TableRow key={application.id} className="group">
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    {application.applicantName}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    {application.applicationNumber}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {application.pan}
                </TableCell>
                <TableCell className="font-medium">
                  {application.ipoName}
                </TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  {formatPrice(application.ipoPrice)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {application.otherPrice
                    ? formatPrice(application.otherPrice)
                    : "—"}
                </TableCell>
                {/* <TableCell className="text-right font-semibold">
                  {formatPrice(
                    application.ipoPrice + (application.otherPrice || 0)
                  )}
                </TableCell> */}
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(application.timestamp)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    Booked
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDelete(application.id, application.ipoName)
                    }
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer */}
      <div className="border-t bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </span>
          {/* <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Total Investment:
            </span>
            <span className="font-semibold text-lg">
              {formatPrice(
                applications.reduce((sum, app) => sum + app.ipoPrice + (app.otherPrice || 0), 0)
              )}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
