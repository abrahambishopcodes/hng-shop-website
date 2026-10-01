const authButton = document.querySelector('#open-auth');
const googleButton = document.querySelector('#google-signin');

function setAuthAction(user) {
  if (!user) return;
  authButton.textContent = `Hi, ${user.name.split(' ')[0]}`;
  authButton.title = `Signed in as ${user.email}. Click to sign out.`;
  authButton.onclick = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.assign('/');
  };
}

googleButton.onclick = () => {
  googleButton.disabled = true;
  googleButton.textContent = 'Taking you to Google…';
  window.location.assign('/auth/google');
};

fetch('/api/me')
  .then((response) => response.ok ? response.json() : { user: null })
  .then(({ user }) => setAuthAction(user))
  .catch(() => {});

const outcome = new URLSearchParams(window.location.search).get('auth');
if (outcome) {
  window.history.replaceState({}, '', window.location.pathname);
  const messages = { success: 'You’re signed in with Google.', cancelled: 'Google sign-in was cancelled.', failed: 'We could not sign you in. Please try again.' };
  if (messages[outcome]) showToast(messages[outcome]);
}
