"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { IPOApplication, IPOName } from "@/lib/types";
import { storageUtils } from "@/lib/storage";
import { exportToCSV } from "@/lib/export";
import { IPOApplicationsTable } from "@/components/ipo-applications-table";
import { SearchAndFilters } from "@/components/search-and-filters";
import { Navigation } from "@/components/navigation";

export default function IPOsPage() {
  const [applications, setApplications] = useState<IPOApplication[]>([]);
  const [ipoNames, setIPONames] = useState<IPOName[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIPO, setSelectedIPO] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApplications(storageUtils.getApplications());
    setIPONames(storageUtils.getIPONames());
    setIsLoaded(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ipoName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIPO =
      !selectedIPO || selectedIPO === "all" || app.ipoName === selectedIPO;

    return matchesSearch && matchesIPO;
  });

  const handleExport = () => {
    exportToCSV(filteredApplications);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium text-muted-foreground">
          Loading Applications...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation ipoNames={ipoNames} onDataChange={loadData} />
      <div className="md:ml-64 px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            IPO Applications
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your IPO applications in one place
          </p>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedIPO={selectedIPO}
          onIPOFilter={setSelectedIPO}
          ipoNames={ipoNames}
          onExport={handleExport}
          applicationsCount={filteredApplications.length}
        />

        {/* Applications Table */}
        <div className="mt-8">
          {applications.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No IPO Applications Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first IPO application to track your
                  investments.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the "Add IPO Application" button in the navigation to get
                  started
                </p>
              </div>
            </Card>
          ) : (
            <IPOApplicationsTable
              applications={filteredApplications}
              onDelete={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
