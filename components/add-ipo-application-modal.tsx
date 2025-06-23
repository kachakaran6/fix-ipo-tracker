"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { IPOName } from "@/lib/types";
import { storageUtils } from "@/lib/storage";

interface AddIPOApplicationModalProps {
  ipoNames: IPOName[];
  onApplicationAdded: () => void;
}

export function AddIPOApplicationModal({
  ipoNames,
  onApplicationAdded,
}: AddIPOApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: "",
    applicationNumber: "",
    pan: "",
    ipoName: "",
    ipoPrice: "",
    otherPrice: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.applicantName.trim()) {
      newErrors.applicantName = "Applicant name is required";
    }
    if (!formData.applicationNumber.trim()) {
      newErrors.applicationNumber = "Application number is required";
    }

    if (!formData.pan.trim()) {
      newErrors.pan = "PAN is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      newErrors.pan = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (!formData.ipoName) {
      newErrors.ipoName = "IPO name is required";
    }

    if (!formData.ipoPrice.trim()) {
      newErrors.ipoPrice = "IPO price is required";
    } else if (
      isNaN(Number(formData.ipoPrice)) ||
      Number(formData.ipoPrice) <= 0
    ) {
      newErrors.ipoPrice = "Invalid IPO price";
    }

    if (
      formData.otherPrice &&
      (isNaN(Number(formData.otherPrice)) || Number(formData.otherPrice) < 0)
    ) {
      newErrors.otherPrice = "Invalid other price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    storageUtils.addApplication({
      applicantName: formData.applicantName.trim(),
      applicationNumber: formData.applicationNumber.trim(),
      pan: formData.pan.toUpperCase().trim(),
      ipoName: formData.ipoName,
      ipoPrice: Number(formData.ipoPrice),
      otherPrice: formData.otherPrice ? Number(formData.otherPrice) : undefined,
    });

    setFormData({
      applicantName: "",
      applicationNumber: "",
      pan: "",
      ipoName: "",
      ipoPrice: "",
      otherPrice: "",
    });
    setErrors({});
    setOpen(false);
    onApplicationAdded();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add IPO Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New IPO Application
          </DialogTitle>
          <DialogDescription>
            Enter the details of your IPO application. All fields marked with *
            are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicantName">Applicant Name *</Label>
            <Input
              id="applicantName"
              value={formData.applicantName}
              onChange={(e) =>
                handleInputChange("applicantName", e.target.value)
              }
              placeholder="Enter applicant name"
              className={errors.applicantName ? "border-red-500" : ""}
            />
            {errors.applicantName && (
              <p className="text-sm text-red-500">{errors.applicantName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationNumber">Application Number *</Label>
            <Input
              id="applicationNumber"
              value={formData.applicationNumber}
              onChange={(e) =>
                handleInputChange("applicationNumber", e.target.value)
              }
              placeholder="Enter application number"
              className={errors.applicationNumber ? "border-red-500" : ""}
            />
            {errors.applicationNumber && (
              <p className="text-sm text-red-500">{errors.applicationNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan">PAN *</Label>
            <Input
              id="pan"
              value={formData.pan}
              onChange={(e) => handleInputChange("pan", e.target.value)}
              placeholder="ABCDE1234F"
              className={errors.pan ? "border-red-500" : ""}
              maxLength={10}
            />
            {errors.pan && <p className="text-sm text-red-500">{errors.pan}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipoName">IPO Name *</Label>
            <Select
              value={formData.ipoName}
              onValueChange={(value) => handleInputChange("ipoName", value)}
            >
              <SelectTrigger className={errors.ipoName ? "border-red-500" : ""}>
                <SelectValue placeholder="Select IPO name" />
              </SelectTrigger>
              <SelectContent>
                {ipoNames.map((ipo) => (
                  <SelectItem key={ipo.id} value={ipo.name}>
                    {ipo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ipoName && (
              <p className="text-sm text-red-500">{errors.ipoName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ipoPrice">IPO Price *</Label>
              <Input
                id="ipoPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.ipoPrice}
                onChange={(e) => handleInputChange("ipoPrice", e.target.value)}
                placeholder="0.00"
                className={errors.ipoPrice ? "border-red-500" : ""}
              />
              {errors.ipoPrice && (
                <p className="text-sm text-red-500">{errors.ipoPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherPrice">Fixed Price</Label>
              <Input
                id="otherPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.otherPrice}
                onChange={(e) =>
                  handleInputChange("otherPrice", e.target.value)
                }
                placeholder="0.00"
                className={errors.otherPrice ? "border-red-500" : ""}
              />
              {errors.otherPrice && (
                <p className="text-sm text-red-500">{errors.otherPrice}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFormData({
                  applicantName: "",
                  applicationNumber: "",
                  pan: "",
                  ipoName: "",
                  ipoPrice: "",
                  otherPrice: "",
                });
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
