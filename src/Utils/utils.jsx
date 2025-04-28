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
  
  export const formatExcelDateTime = (iso) => {
    if (!iso) return "-";
  
    const date = new Date(iso);
    if (isNaN(date)) return "-"; // handle invalid dates safely
  
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    // If hours and minutes are "00:00", it's just a date (no time provided)
    if (hours === "00" && minutes === "00") {
      return `${day}-${month}-${year}`;
    }
  
    // If time exists, return date + time
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  
  