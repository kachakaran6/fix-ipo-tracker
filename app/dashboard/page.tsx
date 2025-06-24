"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  ArrowRight,
  DollarSign,
  FileText,
} from "lucide-react";
import { IPOApplication, IPOName } from "@/lib/types";
import { storageUtils } from "@/lib/storage";
import { Navigation } from "@/components/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [applications, setApplications] = useState<IPOApplication[]>([]);
  const [ipoNames, setIPONames] = useState<IPOName[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApplications(storageUtils.getApplications());
    setIPONames(storageUtils.getIPONames());
    setIsLoaded(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvestment = applications.reduce((sum, app) => {
    return sum + app.ipoPrice + (app.otherPrice || 0);
  }, 0);

  const uniqueIPOs = Array.from(
    new Set(applications.map((app) => app.ipoName))
  ).length;

  // Group applications by IPO name
  const ipoStats = ipoNames.map((ipo) => {
    const ipoApplications = applications.filter(
      (app) => app.ipoName === ipo.name
    );
    const totalAmount = ipoApplications.reduce(
      (sum, app) => sum + app.ipoPrice + (app.otherPrice || 0),
      0
    );

    return {
      name: ipo.name,
      applicationCount: ipoApplications.length,
      totalAmount,
      createdAt: ipo.createdAt,
    };
  });

  // Recent applications (last 5)
  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium text-muted-foreground">
          Loading Dashboard...
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
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Track your IPO investments and portfolio performance
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Investment
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalInvestment)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card> */}

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active IPOs
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {uniqueIPOs}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* IPO Names Cards */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Available IPOs</h2>
              <Link href="/ipos">
                <Button variant="outline" size="sm">
                  View All Applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {ipoNames.length === 0 ? (
              <Card className="p-8 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No IPOs Available
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding some IPO names to track your applications.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipoStats.map((ipo) => (
                  <Card
                    key={ipo.name}
                    className="hover:shadow-md transition-all duration-200 group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                              {ipo.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Added{" "}
                              {new Date(ipo.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Applications
                            </p>
                            <p className="font-semibold text-blue-600">
                              {ipo.applicationCount}
                            </p>
                          </div>
                          {/* <div>
                            <p className="text-xs text-muted-foreground">
                              Investment
                            </p>
                            <p className="font-semibold text-green-600">
                              {ipo.totalAmount > 0
                                ? formatCurrency(ipo.totalAmount)
                                : "—"}
                            </p>
                          </div> */}
                        </div>

                        <Badge
                          variant={
                            ipo.applicationCount > 0 ? "default" : "secondary"
                          }
                        >
                          {ipo.applicationCount > 0 ? "Active" : "Available"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Applications</h2>
              {/* <Link href="/analytics">
                <Button variant="outline" size="sm">
                  View Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link> */}
            </div>

            {recentApplications.length === 0 ? (
              <Card className="p-6 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-muted-foreground mb-2">
                  No Applications Yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your recent applications will appear here.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Card
                    key={app.id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{app.ipoName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {app.pan}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(app.timestamp).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(app.otherPrice || 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
