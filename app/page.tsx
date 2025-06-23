"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, FileText, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import IpoPage from "@/app/ipos/page";

export default function Home() {
  return <IpoPage />;
}
