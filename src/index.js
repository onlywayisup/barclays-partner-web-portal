let token;
let skWidget;
let idTokenClaims;

window.onload = async () => {
    document
        .getElementById("login-button")
        .addEventListener("click", () => startLogin());
    document
        .getElementById("register-button")
        .addEventListener("click", () => startRegistration());

    document
        .getElementById("delegated-admin-button")
        .addEventListener("click", () => startDelegatedAdmin());

    document
        .getElementById("username")
        .addEventListener("click", () => startProfileUpdate());
    document.getElementById("logout").addEventListener("click", () => logout());

    skWidget = document.getElementsByClassName("skWidget")[0];
};

async function startProfileUpdate() {
    console.log("startProfileUpdate for user " + idTokenClaims.username);
    showSpinner();
    await getToken();
    let parameters = {
        username: idTokenClaims.username,
    };
    showWidget(
        dav_props.preferencesPolicyId,
        inSessionCallback,
        errorCallback,
        onCloseModal,
        parameters
    );
}


async function startRegistration() {
    console.log("startRegistration");
    let parameters = {};
    showSpinner();
    await getToken();
    showWidget(
        dav_props.registrationPolicyId,
        initSessionCallback,
        errorCallback,
        onCloseModal,
        parameters
    );
}

async function startDelegatedAdmin() {
    console.log("startDelegatedAdmin");
    let parameters = {};
    showSpinner();
    await getToken();
    showWidget(
        dav_props.delegatedAdminPolicyId,
        initSessionCallback,
        errorCallback,
        onCloseModal,
        parameters
    );
}

async function startLogin() {
    console.log("startLogin");
    let parameters = {};
    showSpinner();
    await getToken();
    showWidget(
        dav_props.loginPolicyId,
        initSessionCallback,
        errorCallback,
        onCloseModal,
        parameters
    );
}

async function logout() {
    console.log("logout");
    idTokenClaims = null;
    updateUI(false);
}

function inSessionCallback(response) {
    console.log("inSessionCallback");
    davinci.cleanup(skWidget);
    hideSpinner();
}

function initSessionCallback(response) {
    console.log(response);
    davinci.cleanup(skWidget);
    idTokenClaims = response.additionalProperties;
    updateUI(true);
    hideSpinner();
}

function errorCallback(error) {
    console.log("errorCallback");
    console.log(error);
    davinci.cleanup(skWidget);
    hideSpinner();
}

function onCloseModal() {
    console.log("onCloseModal");
    console.log(document.cookie);
    davinci.cleanup(skWidget);
    hideSpinner();
}

function updateUI(isUserAuthenticated) {
    console.log("updateUI. Is user authenticated " + isUserAuthenticated);

    if (isUserAuthenticated) {
        document.getElementById("username").innerText =
            getDisplayName(idTokenClaims);
        hideElement("login-button");
        hideElement("register-button");
        hideElement("landing");
        displayElement("username");
        displayElement("logout");
        displayElement("home");
        displayElement("delegated-admin-button");
    } else {
        displayElement("login-button");
        displayElement("register-button");
        displayElement("landing");
        hideElement("username");
        hideElement("logout");
        hideElement("home");
        hideElement("delegated-admin-button");
    }
}

function displayElement(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hideElement(id) {
    document.getElementById(id).classList.add("hidden");
}

function showSpinner() {
    displayElement("spinner");
}

function hideSpinner() {
    hideElement("spinner");
}

function getDisplayName(claims) {
    console.log(claims);
    if (claims.first_name) {
        return claims.first_name;
    }

    return claims.mail;
}
