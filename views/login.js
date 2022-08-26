let state = {};

const API_PREFIX = "http://localhost:3000/v1";

const port = chrome.extension.connect({
  name: "LANYAP_STATE_GET",
});

window.onload = function () {
  document.body.style.display = "none";
  port.postMessage("Getting state");
  port.onMessage.addListener(function (message) {
    state = message;
    if (!!state.user) {
      window.location.href = "./app.html";
    } else {
      document.body.style.display = "block";
      const signinError = document.querySelector("#signinError");
      document.querySelector("#signinButton").onclick = function () {
        signinError.style.display = "none";
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        fetch(`${API_PREFIX}/auth/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
          .then((response) => {
            if (response.status === 200) {
              response.json().then(({ token }) => {
                fetch(`${API_PREFIX}/user`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }).then((resp) => {
                  if (resp.status === 200) {
                    resp.json().then((user) => {
                      chrome.runtime.sendMessage({
                        type: "LANYAP_QBO_USER_FETCHED",
                        payload: {
                          user,
                        },
                      });
                    });
                  }
                });
                fetch(`${API_PREFIX}/applications`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }).then((resp) => {
                  if (resp.status === 200) {
                    resp.json().then((applications) => {
                      chrome.runtime.sendMessage({
                        type: "LANYAP_QBO_APPLICATIONS_FETCHED",
                        payload: {
                          applications,
                        },
                      });
                      window.location.href = "./app.html";
                    });
                  }
                });
              });
            } else {
              signinError.style.display = "block";
            }
          })
          .catch((e) => (signinError.style.display = "block"));
      };
    }
  });
};
