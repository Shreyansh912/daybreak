window.DaybreakMeditation = {
  async recordSession(durationMinutes) {
    const user = window.DaybreakAuth.currentUser;
    if (!user) return;

    const { error } = await window.db
      .from('meditation_sessions')
      .insert([{
        user_id: user.id,
        duration_minutes: durationMinutes,
        completed: true,
        session_date: new Date().toISOString().split('T')[0]
      }]);

    if (error) {
      console.error("Failed to save meditation session:", error);
    } else {
      window.flashToast("Meditation saved to your day");
      await window.DaybreakInsights.calculate();
    }
  }
};