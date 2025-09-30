document.addEventListener('DOMContentLoaded', () => {
    // Service tabs functionality
    const tabs = document.querySelectorAll('.tab');
    const descriptions = document.querySelectorAll('.service-description');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and descriptions
            tabs.forEach(t => t.classList.remove('active'));
            descriptions.forEach(d => d.classList.remove('active'));

            // Add active class to clicked tab and corresponding description
            tab.classList.add('active');
            descriptions[index].classList.add('active');
        });
    });

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
