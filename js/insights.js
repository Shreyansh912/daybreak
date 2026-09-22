window.DaybreakInsights = {
  async calculate() {
    const user = window.DaybreakAuth.currentUser;
    if (!user) return;

    const events = window.DaybreakEvents.activeEvents;

    const totals = { work: 0, personal: 0, family: 0, wellness: 0 };
    events.forEach(e => {
      const dur = (new Date(e.end_time) - new Date(e.start_time)) / (1000 * 60);
      if (totals[e.category] !== undefined) {
        totals[e.category] += Math.max(0, dur);
      }
    });

    const { data: medSessions } = await window.db
      .from('meditation_sessions')
      .select('duration_minutes')
      .eq('session_date', new Date().toISOString().split('T')[0]);

    const totalMedMinutes = (medSessions || []).reduce((acc, s) => acc + s.duration_minutes, 0);
    this.render(totals, totalMedMinutes);
  },

  formatDuration(mins) {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m > 0 ? m + 'm' : ''}`;
  },

  render(totals, totalMedMinutes) {
    const cards = document.querySelectorAll('#s-insights .insight-card b');
    if (cards.length >= 4) {
      cards[0].textContent = this.formatDuration(totals.work);
      cards[1].textContent = this.formatDuration(totals.personal);
      cards[2].textContent = this.formatDuration(totals.family);
      cards[3].textContent = `${totalMedMinutes}m`;
    }

    const dBalances = document.querySelectorAll('.d-right .balance-row .bl-val');
    if (dBalances.length >= 4) {
      dBalances[0].textContent = this.formatDuration(totals.work);
      dBalances[1].textContent = this.formatDuration(totals.personal);
      dBalances[2].textContent = this.formatDuration(totals.family);
      dBalances[3].textContent = `${totalMedMinutes}m`;
    }
  }
};