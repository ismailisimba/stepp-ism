export type Status =
  | "Draft"
  | "In Review"
  | "Published"
  | "Active"
  | "Expired"
  | "Closed"
  | "Created"
  | "Unknown";

export function parseStatusFromString(status: string): Status {
  switch (status) {
    case "draft" || "Draft":
      return "Draft";

    case "in_review":
      return "In Review";

    case "published" || "Published":
      return "Published";

    case "active" || "Active":
      return "Active";

    case "expired" || "Expired":
      return "Expired";

    case "closed" || "Closed":
      return "Closed";

    case "created" || "Created":
      return "Created";

    default:
      return "Unknown";
  }
}
