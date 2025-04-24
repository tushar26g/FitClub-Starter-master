// Format a date as "DD Month YYYY" (e.g., 21 April 2025)
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
  
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  // Get styling for membership status badge
  export const getStatusStyle = (status) => {
    const upperStatus = status?.toUpperCase();
    switch (upperStatus) {
      case "ACTIVE":
        return { background: "rgba(145, 254, 159, 0.47)", color: "green", padding: "2px 8px", borderRadius: "8px" };
      case "SUSPENDED":
        return { background: "#ffadad8f", color: "red", padding: "2px 8px", borderRadius: "8px" };
      default:
        return { background: "#59bfff", color: "white", padding: "2px 8px", borderRadius: "8px" };
    }
  };
  