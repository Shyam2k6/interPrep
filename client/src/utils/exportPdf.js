export const exportToPdfReport = (user, goals = [], sessions = [], roadmaps = []) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export your workspace report as a PDF.");
    return;
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const completedGoals = goals.filter((g) => g.status === "completed").length;

  // Build HTML document structure
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>InterPrep Workspace Report - ${user?.name || "Learner"}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #334155;
          line-height: 1.5;
          margin: 0;
          padding: 20px;
          background: #ffffff;
        }
        header {
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .meta-info {
          font-size: 13px;
          color: #64748b;
          margin-top: 5px;
        }
        .summary-grid {
          display: grid;
          grid-template-cols: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 35px;
        }
        .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 15px;
          text-align: center;
        }
        .summary-card .value {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .summary-card .label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-top: 4px;
        }
        h2 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          border-left: 4px solid #4f46e5;
          padding-left: 10px;
          margin-top: 35px;
          margin-bottom: 15px;
          page-break-after: avoid;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }
        th, td {
          text-align: left;
          padding: 10px 12px;
          font-size: 13px;
          border-bottom: 1px solid #e2e8f0;
        }
        th {
          background: #f1f5f9;
          font-weight: 600;
          color: #0f172a;
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 500;
          text-transform: capitalize;
        }
        .badge-completed { background: #d1fae5; color: #065f46; }
        .badge-in-progress { background: #dbeafe; color: #1e40af; }
        .badge-pending { background: #f1f5f9; color: #374151; }
        
        .roadmap-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .roadmap-title {
          font-weight: 700;
          color: #0f172a;
          font-size: 15px;
        }
        .roadmap-meta {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .steps-list {
          margin-top: 10px;
          display: grid;
          grid-template-cols: repeat(2, 1fr);
          gap: 5px;
        }
        .step-item {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .step-completed { color: #059669; font-weight: 500; }
        .step-pending { color: #64748b; }
        
        @media print {
          body {
            padding: 0;
            font-size: 12px;
          }
          .page-break {
            page-break-before: always;
          }
          header {
            margin-bottom: 20px;
          }
          .summary-card {
            border: 1px solid #cbd5e1;
            background: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div className="header-top">
          <div>
            <h1 className="title">InterPrep Workspace Report</h1>
            <div className="meta-info">Prepared for ${user?.name || "Explorer"} on ${today}</div>
          </div>
        </div>
      </header>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="value">${goals.length}</div>
          <div className="label">Total Goals</div>
        </div>
        <div className="summary-card">
          <div className="value">${completedGoals}</div>
          <div className="label">Goals Completed</div>
        </div>
        <div className="summary-card">
          <div className="value">${roadmaps.length}</div>
          <div className="label">Roadmaps</div>
        </div>
        <div className="summary-card">
          <div className="value">${totalStudyMinutes} mins</div>
          <div className="label">Study Duration</div>
        </div>
      </div>

      <h2>1. Learning Goals</h2>
      ${
        goals.length === 0
          ? "<p>No learning goals set yet.</p>"
          : `
          <table>
            <thead>
              <tr>
                <th>Goal Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${goals
                .map(
                  (g) => `
                <tr>
                  <td><strong>${g.title}</strong></td>
                  <td>${g.category}</td>
                  <td>
                    <span class="badge badge-${g.status}">
                      ${g.status}
                    </span>
                  </td>
                  <td>${g.progress}%</td>
                  <td>${g.deadline ? new Date(g.deadline).toLocaleDateString() : "No Deadline"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
      }

      <div class="page-break"></div>

      <h2>2. Study Roadmaps</h2>
      ${
        roadmaps.length === 0
          ? "<p>No study roadmaps created yet.</p>"
          : roadmaps
              .map(
                (r) => `
            <div class="roadmap-item">
              <div class="roadmap-title">${r.title}</div>
              <div class="roadmap-meta">Progress: ${r.progress}% | ${
                  r.steps?.filter((s) => s.completed).length || 0
                }/${r.steps?.length || 0} milestones completed</div>
              <div class="steps-list">
                ${r.steps
                  ?.map(
                    (s) => `
                  <div class="step-item ${s.completed ? "step-completed" : "step-pending"}">
                    ${s.completed ? "✓" : "○"} ${s.title}
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              )
              .join("")
      }

      <h2>3. Recent Study Sessions</h2>
      ${
        sessions.length === 0
          ? "<p>No study sessions logged yet.</p>"
          : `
          <table>
            <thead>
              <tr>
                <th>Goal Title</th>
                <th>Duration</th>
                <th>Notes</th>
                <th>Logged At</th>
              </tr>
            </thead>
            <tbody>
              ${sessions
                .map(
                  (s) => `
                <tr>
                  <td><strong>${s.goal?.title || "N/A"}</strong></td>
                  <td>${s.duration} mins</td>
                  <td>${s.notes || "No notes added."}</td>
                  <td>${new Date(s.studiedAt).toLocaleDateString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
      }
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for rendering then trigger print
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
