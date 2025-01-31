export const checkCookieAndRedirect = () => {
    const excludedPaths = ["/login", "/register"];
    if (excludedPaths.includes(window.location.pathname)) {
        return;
    }

    const getCookie = (name) => {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) {
                return value;
            }
        }
        return null;
    };

    const userName = getCookie("isExp");
    const expirationTimestamp = getCookie("isExpTimestamp");
    if (!userName || (expirationTimestamp && Date.now() > parseInt(expirationTimestamp))) {
        document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "isExp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "isExpTimestamp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("jwtToken");

        window.location.href = "/login";
    }
};