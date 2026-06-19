document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.getElementById('menu-toggle');
    if (!menuToggle) return;

    document.querySelectorAll('.menu-link').forEach(function (link) {
        link.addEventListener('click', function () {
            menuToggle.checked = false;
        });
    });
});
