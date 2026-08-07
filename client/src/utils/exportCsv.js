export const downloadCsv = (filename, data, headersMap) => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  const csvRows = [];
  
  // 1. Header row
  const displayHeaders = Object.keys(headersMap);
  const dataKeys = Object.values(headersMap);
  csvRows.push(displayHeaders.map(h => `"${h}"`).join(","));

  // 2. Data rows
  for (const item of data) {
    const values = dataKeys.map(key => {
      const val = typeof key === "function" ? key(item) : item[key];
      
      const escaped = ("" + (val === undefined || val === null ? "" : val))
        .replace(/"/g, '""')
        .replace(/\n/g, " ");
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // 3. Trigger download
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportGoalsCsv = (goals) => {
  const headersMap = {
    "Goal Title": "title",
    "Category": "category",
    "Status": "status",
    "Progress (%)": "progress",
    "Deadline": item => item.deadline ? new Date(item.deadline).toLocaleDateString() : "No Deadline",
    "Created Date": item => new Date(item.createdAt).toLocaleDateString(),
  };
  downloadCsv("prep_goals_export.csv", goals, headersMap);
};

export const exportSessionsCsv = (sessions) => {
  const headersMap = {
    "Goal Title": item => item.goal?.title || "N/A",
    "Category": item => item.goal?.category || "N/A",
    "Duration (Minutes)": "duration",
    "Study Date": item => new Date(item.studiedAt).toLocaleDateString(),
    "Notes": "notes",
  };
  downloadCsv("prep_sessions_export.csv", sessions, headersMap);
};

export const exportRoadmapsCsv = (roadmaps) => {
  const headersMap = {
    "Roadmap Title": "title",
    "Description": "description",
    "Progress (%)": "progress",
    "Total Steps": item => item.steps?.length || 0,
    "Completed Steps": item => item.steps?.filter(s => s.completed).length || 0,
    "Created Date": item => new Date(item.createdAt).toLocaleDateString(),
  };
  downloadCsv("prep_roadmaps_export.csv", roadmaps, headersMap);
};
