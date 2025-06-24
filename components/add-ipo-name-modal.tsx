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
import { Plus } from "lucide-react";
import { storageUtils } from "@/lib/storage";

interface AddIPONameModalProps {
  onIPONameAdded: () => void;
}

export function AddIPONameModal({ onIPONameAdded }: AddIPONameModalProps) {
  const [open, setOpen] = useState(false);
  const [ipoName, setIpoName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ipoName.trim()) {
      setError("IPO name is required");
      return;
    }

    const existingNames = storageUtils.getIPONames();
    if (
      existingNames.some(
        (name) => name.name.toLowerCase() === ipoName.trim().toLowerCase()
      )
    ) {
      setError("This IPO name already exists");
      return;
    }

    storageUtils.addIPOName(ipoName.trim());
    setIpoName("");
    setError("");
    setOpen(false);
    onIPONameAdded();
  };

  const handleInputChange = (value: string) => {
    setIpoName(value);
    if (error) {
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add IPO Name
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add New IPO Name
          </DialogTitle>
          <DialogDescription>
            Add a new IPO name to make it available in the application form
            dropdown.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ipoName">IPO Name</Label>
            <Input
              id="ipoName"
              value={ipoName}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter IPO name"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setIpoName("");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add IPO Name
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
