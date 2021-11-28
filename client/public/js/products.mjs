import Cookies from '/static/js/js.cookie.min.mjs';
Notiflix.Notify.init({timeout: 3000, position: 'right-bottom'});

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = $('#log-out-btn');

    logoutBtn.click( () => {
        Cookies.remove('authorization');
        window.location = '/';
    });

})