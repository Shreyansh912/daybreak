window.DaybreakApp = {
  selectedEventId: null,

  async init() {
    await window.DaybreakAuth.init();
  },

  async onUserAuthenticated(user) {
    await window.DaybreakSettings.loadPreferences();
    await this.refreshViews();
  },

  async refreshViews() {
    const events = await window.DaybreakEvents.fetchUserEvents();
    window.DaybreakCalendar.render(events);
    await window.DaybreakInsights.calculate();
  },

  openEventDetails(id) {
    this.selectedEventId = id;
    const evt = window.DaybreakEvents.activeEvents.find(e => e.id === id);
    if (!evt) return;

    const heroTitle = document.querySelector('#s-event-detail .detail-hero h2');
    const heroTag = document.querySelector('#s-event-detail .detail-hero .tag');
    const notesBox = document.querySelector('#s-event-detail .notes-box');

    if (heroTitle) heroTitle.textContent = evt.title;
    if (heroTag) {
      heroTag.className = `tag tag-${evt.category}`;
      heroTag.innerHTML = `<span class="dot" style="background:var(--${evt.category})"></span>${evt.category.toUpperCase()}`;
    }
    if (notesBox) notesBox.textContent = evt.notes || "No notes.";

    window.go('s-event-detail');
  },

  async handleEventFormSubmit() {
    const titleInput = document.querySelector('#s-create input[type="text"]');
    const dateInput = document.querySelectorAll('#s-create input[type="text"]')[1];
    const startTimeInput = document.querySelectorAll('#s-create input[type="text"]')[2];
    const endTimeInput = document.querySelectorAll('#s-create input[type="text"]')[3];
    const notesInput = document.querySelector('#s-create textarea');
    const activeCategoryBtn = document.querySelector('.cat-pick button.sel');

    const title = titleInput ? titleInput.value : '';
    const date = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
    const startTime = startTimeInput ? startTimeInput.value : '09:00';
    const endTime = endTimeInput ? endTimeInput.value : '10:00';
    const notes = notesInput ? notesInput.value : '';
    const category = activeCategoryBtn ? activeCategoryBtn.textContent.toLowerCase() : 'work';

    const startISO = new Date(`${date} ${startTime}`).toISOString();
    const endISO = new Date(`${date} ${endTime}`).toISOString();

    try {
      if (this.selectedEventId) {
        await window.DaybreakEvents.updateEvent(this.selectedEventId, {
          title, category, start_time: startISO, end_time: endISO, notes
        });
        window.flashToast("Event updated");
      } else {
        await window.DaybreakEvents.createEvent({
          title, category, start_time: startISO, end_time: endISO, notes
        });
        window.flashToast("Event created");
      }
      this.selectedEventId = null;
      window.go('s-dashboard');
    } catch (err) {
      window.flashToast(err.message || "Failed to save event");
    }
  },

  async handleDeleteSelected() {
    if (!this.selectedEventId) return;
    try {
      await window.DaybreakEvents.deleteEvent(this.selectedEventId);
      this.selectedEventId = null;
      window.flashToast("Event deleted");
      window.go('s-dashboard');
    } catch (err) {
      window.flashToast("Could not delete event");
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.DaybreakApp.init();
});