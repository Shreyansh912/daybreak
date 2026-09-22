window.DaybreakAuth = {
  currentUser: null,

  async init() {
    const { data: { session } } = await window.db.auth.getSession();
    this.handleSession(session);

    window.db.auth.onAuthStateChange((_event, session) => {
      this.handleSession(session);
    });
  },

  handleSession(session) {
    this.currentUser = session?.user || null;
    const authOverlay = document.getElementById('authModalOverlay');
    
    if (!this.currentUser) {
      if (authOverlay) authOverlay.style.display = 'flex';
    } else {
      if (authOverlay) authOverlay.style.display = 'none';
      window.DaybreakApp.onUserAuthenticated(this.currentUser);
    }
  },

  async signUp(email, password, fullName) {
    const { data, error } = await window.db.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  },

  async login(email, password) {
    const { data, error } = await window.db.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await window.db.auth.signOut();
    if (error) throw error;
    window.location.reload();
  }
};