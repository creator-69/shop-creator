(() => {
  "use strict";
  const signInTab = document.getElementById("showSignIn");
  const signUpTab = document.getElementById("showSignUp");
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  const showForm = (mode) => {
    const isSignUp = mode === "signup";
    signInForm.hidden = isSignUp;
    signUpForm.hidden = !isSignUp;
    signInTab.classList.toggle("is-active", !isSignUp);
    signUpTab.classList.toggle("is-active", isSignUp);
    signInTab.setAttribute("aria-selected", String(!isSignUp));
    signUpTab.setAttribute("aria-selected", String(isSignUp));
    (isSignUp ? signUpForm : signInForm).querySelector("input")?.focus();
  };

  signInTab?.addEventListener("click", () => showForm("signin"));
  signUpTab?.addEventListener("click", () => showForm("signup"));

  signInForm?.addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.getElementById("signInFeedback");
    if (feedback) feedback.textContent = "This is a visual demo; sign-in is not connected to a server.";
  });

  signUpForm?.addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.getElementById("signUpFeedback");
    if (feedback) feedback.textContent = "This is a visual demo; no account was created and your details were not sent.";
  });
})();