window.DaybreakSmartSchedule = {
  generateSuggestions(existingEvents, requestedItems) {
    // Standard Day Boundary: 09:00 to 18:00
    const today = new Date();
    const workStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0);
    const workEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0);

    // Filter and sort today's busy intervals
    const busySlots = existingEvents
      .map(e => ({ start: new Date(e.start_time), end: new Date(e.end_time) }))
      .sort((a, b) => a.start - b.start);

    // Compute free windows
    const freeWindows = [];
    let pointer = new Date(workStart);

    for (const b of busySlots) {
      if (b.start > pointer) {
        freeWindows.push({ start: new Date(pointer), end: new Date(b.start) });
      }
      if (b.end > pointer) {
        pointer = new Date(b.end);
      }
    }
    if (pointer < workEnd) {
      freeWindows.push({ start: new Date(pointer), end: new Date(workEnd) });
    }

    // Allocate requested items
    const suggestions = [];
    let currentWindowIdx = 0;

    for (const item of requestedItems) {
      const durationMs = item.durationMinutes * 60 * 1000;
      let placed = false;

      while (currentWindowIdx < freeWindows.length && !placed) {
        const win = freeWindows[currentWindowIdx];
        const availableMs = win.end - win.start;

        if (availableMs >= durationMs) {
          const itemEnd = new Date(win.start.getTime() + durationMs);
          suggestions.push({
            title: item.title,
            category: item.category,
            start_time: win.start.toISOString(),
            end_time: itemEnd.toISOString()
          });
          win.start = itemEnd;
          placed = true;
        } else {
          currentWindowIdx++;
        }
      }
    }
    return suggestions;
  }
};