export function checkLogin() {
    console.log('checking auth');
    let msg = {authenticated: false, user: null};
    let auth = localStorage.getItem("jwt");
    if (auth !== undefined && auth !== null) {
        auth = JSON.parse(auth);
        let timePassed = new Date().getTime() - auth.time,
            twoMinutes = 1200000;
        if (timePassed > twoMinutes) {
            localStorage.removeItem("jwt");
            msg = {authenticated: false, user: null};
        }
        else msg = {authenticated: true, user: auth.user};;
    }

    return msg;
}