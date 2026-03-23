const CREDENTIALS = {
  email: "joe@joecorwin.com",
  password: "REDACTED",
};

const SESSION_KEY = "wcorwin_auth";

export function checkAuth() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function login(email, password) {
  if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
