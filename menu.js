document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const menuPanel = document.querySelector('.menu-panel');

    if (hamburger && menuPanel) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            menuPanel.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !menuPanel.contains(e.target)) {
                hamburger.classList.remove('active');
                menuPanel.classList.remove('active');
            }
        });

        // Prevent menu panel clicks from closing
        menuPanel.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});
