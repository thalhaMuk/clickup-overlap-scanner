(() => {
  const CONFLICT_CLASS = "cu-overlap-conflict";
  const DAY_LABEL_PATTERN = /^[A-Za-z]{3},\s*[A-Za-z]{3}\s+\d{1,2}(?:,\s*\d{4})?$/;

  function parseTime(rawTime) {
    if (!rawTime) {
      return null;
    }

    const normalized = rawTime.replace(/\s+/g, " ").trim().toUpperCase();
    const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?(?:\s*([AP]M))?$/);
    if (!match) {
      return null;
    }

    let hour = Number(match[1]);
    const minute = Number(match[2] ?? "0");
    const meridiem = match[3] ?? null;

    if (Number.isNaN(hour) || Number.isNaN(minute) || minute < 0 || minute > 59) {
      return null;
    }

    if (meridiem) {
      if (hour < 1 || hour > 12) {
        return null;
      }
      if (hour === 12) {
        hour = 0;
      }
      if (meridiem === "PM") {
        hour += 12;
      }
    } else if (hour > 23) {
      return null;
    }

    return hour * 60 + minute;
  }

  function getDayLabel(groupEl) {
    const strongSpans = groupEl.querySelectorAll('span[cu3-strong="true"]');
    for (const span of strongSpans) {
      const text = (span.textContent || "").replace(/\s+/g, " ").trim();
      if (DAY_LABEL_PATTERN.test(text)) {
        return text;
      }
    }
    return null;
  }

  function extractEntries() {
    const grouped = [];
    const groups = document.querySelectorAll('[data-test="time-hub-by-entry"] .group');

    for (const group of groups) {
      const day = getDayLabel(group);
      if (!day) {
        continue;
      }

      const rows = group.querySelectorAll('[data-test="time-hub-entry-table-row"]');
      const entries = [];

      for (const row of rows) {
        const timeInputs = row.querySelectorAll('input[data-test="time-hub-time-field__input"]');
        if (timeInputs.length < 2) {
          continue;
        }

        const startRaw = (timeInputs[0].value || "").trim();
        const endRaw = (timeInputs[1].value || "").trim();
        if (!startRaw || !endRaw) {
          continue;
        }

        const start = parseTime(startRaw);
        const end = parseTime(endRaw);
        if (start === null || end === null || end <= start) {
          continue;
        }

        entries.push({
          start,
          end,
          el: row,
          startRaw,
          endRaw
        });
      }

      grouped.push({ day, entries });
    }

    return grouped;
  }

  function detectOverlaps(groupedEntries) {
    const conflicts = [];

    for (const { day, entries } of groupedEntries) {
      const sorted = [...entries].sort((a, b) => a.start - b.start);
      for (let i = 0; i < sorted.length - 1; i += 1) {
        const current = sorted[i];
        const next = sorted[i + 1];

        if (current.start < next.end && next.start < current.end) {
          conflicts.push({ day, a: current, b: next });
        }
      }
    }

    return conflicts;
  }

  function clearHighlights() {
    document.querySelectorAll(`.${CONFLICT_CLASS}`).forEach((row) => {
      row.classList.remove(CONFLICT_CLASS);
      if (row.getAttribute("title") === "Overlapping time entry") {
        row.removeAttribute("title");
      }
    });
  }

  function highlightConflicts(conflicts) {
    const affectedRows = new Set();
    for (const conflict of conflicts) {
      affectedRows.add(conflict.a.el);
      affectedRows.add(conflict.b.el);
    }

    affectedRows.forEach((row) => {
      row.classList.add(CONFLICT_CLASS);
      row.setAttribute("title", "Overlapping time entry");
    });

    return [...affectedRows];
  }

  function runScan() {
    clearHighlights();

    const groupedEntries = extractEntries();
    const totalParsed = groupedEntries.reduce((sum, group) => sum + group.entries.length, 0);

    if (totalParsed === 0) {
      return {
        ok: false,
        conflictCount: 0,
        parsedCount: 0,
        message: "No valid time rows found. Ensure entries are loaded and start/end times are visible."
      };
    }

    const conflicts = detectOverlaps(groupedEntries);
    if (conflicts.length === 0) {
      return {
        ok: true,
        conflictCount: 0,
        parsedCount: totalParsed,
        message: "No overlapping time entries found"
      };
    }

    const rows = highlightConflicts(conflicts);
    if (rows.length > 0) {
      rows[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return {
      ok: true,
      conflictCount: conflicts.length,
      parsedCount: totalParsed,
      message: `${conflicts.length} overlapping conflicts found`
    };
  }

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request?.type === "SCAN_OVERLAPS") {
      sendResponse(runScan());
      return;
    }

    if (request?.type === "CLEAR_OVERLAP_HIGHLIGHTS") {
      clearHighlights();
      sendResponse({
        ok: true,
        message: "Highlights cleared."
      });
    }
  });
})();
