window.DaybreakEvents = {
  activeEvents: [],

  async fetchUserEvents() {
    const user = window.DaybreakAuth.currentUser;
    if (!user) return [];

    const { data, error } = await window.db
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      window.flashToast("Unable to load events");
      return [];
    }
    this.activeEvents = data || [];
    return this.activeEvents;
  },

  async createEvent(eventPayload) {
    const user = window.DaybreakAuth.currentUser;
    if (!user) throw new Error("Unauthorized");

    // Client Validation
    if (!eventPayload.title || !eventPayload.title.trim()) {
      throw new Error("Title cannot be empty");
    }
    if (new Date(eventPayload.end_time) <= new Date(eventPayload.start_time)) {
      throw new Error("End time must be after start time");
    }

    const { data, error } = await window.db
      .from('events')
      .insert([{
        user_id: user.id,
        title: eventPayload.title.trim(),
        category: eventPayload.category,
        start_time: eventPayload.start_time,
        end_time: eventPayload.end_time,
        reminder: eventPayload.reminder,
        repeat: eventPayload.repeat,
        notes: eventPayload.notes,
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    await this.fetchUserEvents();
    window.DaybreakApp.refreshViews();
    return data[0];
  },

  async updateEvent(id, eventPayload) {
    if (new Date(eventPayload.end_time) <= new Date(eventPayload.start_time)) {
      throw new Error("End time must be after start time");
    }

    const { data, error } = await window.db
      .from('events')
      .update({
        title: eventPayload.title.trim(),
        category: eventPayload.category,
        start_time: eventPayload.start_time,
        end_time: eventPayload.end_time,
        reminder: eventPayload.reminder,
        repeat: eventPayload.repeat,
        notes: eventPayload.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    await this.fetchUserEvents();
    window.DaybreakApp.refreshViews();
    return data[0];
  },

  async deleteEvent(id) {
    const { error } = await window.db
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await this.fetchUserEvents();
    window.DaybreakApp.refreshViews();
  }
};