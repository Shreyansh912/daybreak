window.DaybreakSettings = {
  async loadPreferences() {
    const user = window.DaybreakAuth.currentUser;
    if (!user) return;

    const { data: profile } = await window.db
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    if (profile) {
      document.querySelectorAll('.profile-row b, .d-profile b').forEach(el => el.textContent = profile.full_name || 'My Profile');
      document.querySelectorAll('.profile-row span').forEach(el => el.textContent = profile.email);
    }

    const { data: prefs } = await window.db
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (prefs && prefs.theme) {
      document.documentElement.setAttribute('data-theme', prefs.theme);
      window.setThemeIcon();
    }
  },

  async updateTheme(newTheme) {
    const user = window.DaybreakAuth.currentUser;
    if (!user) return;
    await window.db
      .from('user_preferences')
      .update({ theme: newTheme, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  }
};