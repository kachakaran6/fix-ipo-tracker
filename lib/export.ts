import { IPOApplication } from "./types";

export const exportToCSV = (applications: IPOApplication[]): void => {
  const headers = [
    "Application Number",
    "PAN",
    "IPO Name",
    "IPO Price",
    "Fixed Price",
    "Applied Date",
  ];

  const csvContent = [
    headers.join(","),
    ...applications.map((app) =>
      [
        app.applicationNumber,
        app.pan,
        app.ipoName,
        app.ipoPrice,
        app.otherPrice || "",
        new Date(app.timestamp).toLocaleString(),
      ]
        .map((field) => `"${field}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ipo-applications-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
