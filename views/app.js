let state = {};

const port = chrome.extension.connect({
  name: "LANYAP_STATE_GET",
});

window.onload = function () {
  port.postMessage("Getting state");
  port.onMessage.addListener(function (message) {
    state = message;
    const user = document.querySelector("#user");
    const app = document.querySelector("#app");
    user.innerHTML = `Welcome, ${state.user.firstName} ${state.user.lastName}. <br/><a href="./login.html">Signout</a>`;
    app.innerHTML = getAppStatus();
  });
};

const getAppStatus = () => {
  if (!state.selectedCompany)
    return `Please navigate to QBO to use the extension`;
  const isCompanyIntegrated = !!state.applications.find(
    ({ application }) => application.name === state.selectedCompany
  );
  return isCompanyIntegrated
    ? `<b>${state.selectedCompany}</b> is integrated with Lanyap`
    : `You are not a member of <b>${state.selectedCompany}</b> on Lanyap yet`;
};
