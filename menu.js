document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const menuPanel = document.querySelector('.menu-panel');
    const body = document.body;
    const menuItems = document.querySelectorAll('.menu-panel ul li');

    // Add delay to menu items for staggered animation
    menuItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    hamburger.addEventListener('click', () => {
        body.classList.toggle('menu-open');
        menuPanel.classList.toggle('active');
        
        // Reset scroll position when menu opens
        if (menuPanel.classList.contains('active')) {
            body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            body.style.overflow = '';
            // Reset transition delays when menu closes
            menuItems.forEach(item => {
                item.style.transitionDelay = '0s';
            });
        }
    });

    // Close menu when clicking menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            body.classList.remove('menu-open');
            menuPanel.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    menuPanel.addEventListener('click', (e) => {
        if (e.target === menuPanel) {
            body.classList.remove('menu-open');
            menuPanel.classList.remove('active');
            body.style.overflow = '';
        }
    });
});
