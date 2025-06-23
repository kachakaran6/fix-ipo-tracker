"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Users, Calendar } from "lucide-react";
import { IPOApplication, IPOName, GroupedApplications } from "@/lib/types";
import { storageUtils } from "@/lib/storage";
import { exportToCSV } from "@/lib/export";
import { AddIPOApplicationModal } from "@/components/add-ipo-application-modal";
import { AddIPONameModal } from "@/components/add-ipo-name-modal";
import { IPOApplicationsTable } from "@/components/ipo-applications-table";
import { SearchAndFilters } from "@/components/search-and-filters";

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

  // const totalInvestment = applications.reduce((sum, app) => {
  //   return sum + app.ipoPrice + (app.otherPrice || 0);
  // }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const uniqueIPOs = Array.from(
    new Set(applications.map((app) => app.ipoName))
  ).length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium text-muted-foreground">
          Loading IPO Tracker...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Fixed IPO Application Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and track your Fixed applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {applications.length}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Investment</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInvestment)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card> */}

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Unique IPOs
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {uniqueIPOs}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available IPOs
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {ipoNames.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <AddIPOApplicationModal
            ipoNames={ipoNames}
            onApplicationAdded={loadData}
          />
          <AddIPONameModal onIPONameAdded={loadData} />
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
                <div className="space-y-3">
                  <AddIPONameModal onIPONameAdded={loadData} />
                  <p className="text-sm text-muted-foreground">
                    Add some IPO names first, then add your applications
                  </p>
                </div>
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
