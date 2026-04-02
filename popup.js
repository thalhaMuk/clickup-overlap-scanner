const statusEl = document.getElementById("status");
const scanButton = document.getElementById("scanButton");
const clearButton = document.getElementById("clearButton");

function setStatus(text, kind = "info") {
  statusEl.className = `status status--${kind}`;
  statusEl.textContent = text;
}

async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (!activeTab?.id) {
    return null;
  }

  return activeTab.id;
}

async function sendMessageToActiveTab(type) {
  const tabId = await getActiveTabId();
  if (!tabId) {
    throw new Error("No active tab found. Open ClickUp Timesheet and try again.");
  }

  try {
    return await chrome.tabs.sendMessage(tabId, { type });
  } catch (_error) {
    throw new Error("Open ClickUp Timesheet tab (https://app.clickup.com/*), then try again.");
  }
}

async function withBusyState(action) {
  scanButton.disabled = true;
  clearButton.disabled = true;
  try {
    await action();
  } finally {
    scanButton.disabled = false;
    clearButton.disabled = false;
  }
}

scanButton.addEventListener("click", () =>
  withBusyState(async () => {
    setStatus("Scanning visible entries...", "info");
    try {
      const result = await sendMessageToActiveTab("SCAN_OVERLAPS");
      if (!result?.ok) {
        setStatus(result?.message || "No valid rows were found.", "warning");
        return;
      }

      if (result.conflictCount > 0) {
        setStatus(`${result.conflictCount} conflict(s) found and highlighted.`, "warning");
        return;
      }

      setStatus(result.message || "No overlapping time entries found", "success");
    } catch (error) {
      setStatus(error.message || "Unable to run scan on this tab.", "warning");
    }
  })
);

clearButton.addEventListener("click", () =>
  withBusyState(async () => {
    try {
      await sendMessageToActiveTab("CLEAR_OVERLAP_HIGHLIGHTS");
      setStatus("Highlights cleared.", "info");
    } catch (error) {
      setStatus(error.message || "Unable to clear highlights on this tab.", "warning");
    }
  })
);
