
export function getCookie(name) {
    const cookies = decodeURIComponent(document.cookie);
    let cookieArr = cookies.replace(' ', '');
    console.log(cookieArr);
    cookieArr = cookieArr.split(';');
    console.log(cookieArr);

    let ret = null;

    cookieArr.forEach(e => {

        if (e.startsWith(name)) {
            ret = e.substring(name.length + 1);
        }

    });

    return ret;
}

export function isCookie(name) {
    return getCookie(name) !== null;
}
