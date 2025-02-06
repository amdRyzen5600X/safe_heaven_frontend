export function getTomorowDate(): Date {
    let date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    return date;
}

export function getJwtFromCookies(): string | null {
    var nameEQ = "access_token=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
