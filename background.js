let applications = undefined;
let selectedCompany = undefined;
let user = undefined;

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === "LANYAP_QBO_COMPANY_CHANGED") {
    selectedCompany = message.payload.companyName;
  }
  if (message.type === "LANYAP_QBO_USER_FETCHED") {
    user = message.payload.user;
  }
  if (message.type === "LANYAP_QBO_APPLICATIONS_FETCHED") {
    applications = message.payload.applications;
  }
});

chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function () {
    port.postMessage({
      applications,
      selectedCompany,
      user,
    });
  });
});
