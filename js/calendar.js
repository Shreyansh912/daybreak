window.DaybreakCalendar = {
  render(events) {
    this.renderMobileTimeline(events);
    this.renderDesktopTimeline(events);
  },

  formatTime(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  },

  renderMobileTimeline(events) {
    const container = document.querySelector('#s-dashboard .timeline');
    const calDayContainer = document.querySelector('#cal-day .timeline');
    if (!container && !calDayContainer) return;

    if (!events || events.length === 0) {
      const emptyHTML = `
        <div class="empty-state" style="padding: 30px 10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
          <p>No plans yet.<br>Add your first event.</p>
        </div>`;
      if (container) container.innerHTML = emptyHTML;
      if (calDayContainer) calDayContainer.innerHTML = emptyHTML;
      return;
    }

    const html = events.map(e => `
      <div class="tl-item" data-id="${e.id}">
        <span class="tl-time">${this.formatTime(e.start_time)}<br>${this.formatTime(e.end_time)}</span>
        <span class="tl-dot"></span>
        <div class="event-card ev-${e.category}" onclick="window.DaybreakApp.openEventDetails('${e.id}')">
          <b>${e.title}</b>
          <div class="ev-meta">
            <span class="tag tag-${e.category}">
              <span class="dot" style="background:var(--${e.category})"></span>${e.category.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    `).join('');

    if (container) container.innerHTML = html;
    if (calDayContainer) calDayContainer.innerHTML = html;
  },

  renderDesktopTimeline(events) {
    const container = document.querySelector('#desk-dashboard .d-eventscol');
    if (!container) return;

    if (!events || events.length === 0) {
      container.innerHTML = `
        <div class="d-hourline"></div><div class="d-hourline"></div><div class="d-hourline"></div>
        <div class="empty-state" style="padding:40px 10px;">
          <p>No plans yet. Add your first event.</p>
        </div>`;
      return;
    }

    const baseStartHour = 9; // Grid starts at 9 AM
    const hourHeight = 64;   // 64px per hour as defined in CSS

    let blocksHTML = `
      <div class="d-hourline"></div><div class="d-hourline"></div>
      <div class="d-hourline"></div><div class="d-hourline"></div>
      <div class="d-hourline"></div>
      <div class="d-now-line" style="top:76px;"></div>
    `;

    events.forEach(e => {
      const s = new Date(e.start_time);
      const end = new Date(e.end_time);
      const startMinutes = (s.getHours() - baseStartHour) * 60 + s.getMinutes();
      const durationMinutes = Math.max(15, (end - s) / (1000 * 60));

      const topPx = (startMinutes / 60) * hourHeight;
      const heightPx = (durationMinutes / 60) * hourHeight;

      if (topPx >= 0) {
        blocksHTML += `
          <div class="d-block" style="top:${topPx}px;height:${heightPx}px;background:var(--${e.category}-soft);border-left-color:var(--${e.category});color:var(--${e.category});" onclick="window.DaybreakApp.openEventDetails('${e.id}')">
            <b>${e.title}</b>
            <span>${this.formatTime(e.start_time)} – ${this.formatTime(e.end_time)} · ${e.category}</span>
          </div>
        `;
      }
    });

    container.innerHTML = blocksHTML;
  }
};