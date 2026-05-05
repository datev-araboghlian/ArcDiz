// Portfolio Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    const realPhotosToggle = document.getElementById('realPhotosToggle');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    
    // Current filter state
    let filters = {
        type: 'all',
        style: 'all',
        rooms: 'any',
        property: null,
        realPhotos: false
    };
    
    // Filter items based on current filters
    function filterItems() {
        portfolioItems.forEach(item => {
            const itemType = item.dataset.type;
            const itemStyle = item.dataset.style;
            const itemRooms = item.dataset.rooms;
            const itemProperty = item.dataset.property;
            const hasRealPhotos = item.dataset.realPhotos === 'true';
            
            let show = true;
            
            // Type filter
            if (filters.type !== 'all' && itemType !== filters.type) {
                show = false;
            }
            
            // Style filter
            if (filters.style !== 'all' && itemStyle !== filters.style) {
                show = false;
            }
            
            // Rooms filter
            if (filters.rooms !== 'any') {
                if (filters.rooms === '4+') {
                    if (itemRooms !== '4+') {
                        show = false;
                    }
                } else if (itemRooms !== filters.rooms) {
                    show = false;
                }
            }
            
            // Property filter (penthouse/house)
            if (filters.property && itemProperty !== filters.property) {
                show = false;
            }
            
            // Real photos filter
            if (filters.realPhotos && !hasRealPhotos) {
                show = false;
            }
            
            // Apply visibility
            if (show) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }
    
    // Handle filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            
            // Handle different filter groups
            if (filterType === 'type') {
                // Remove active from type buttons
                document.querySelectorAll('.filter-type .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filters.type = filterValue;
            } else if (filterType === 'rooms') {
                // Remove active from rooms buttons
                document.querySelectorAll('.filter-rooms .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filters.rooms = filterValue;
            } else if (filterType === 'property') {
                // Toggle property filter
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    filters.property = null;
                } else {
                    document.querySelectorAll('.filter-property .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    filters.property = filterValue;
                }
            }
            
            filterItems();
        });
    });
    
    // Handle dropdown style filter
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.dataset.value;
            
            // Update active state
            dropdownLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Update dropdown button text
            dropdownBtn.innerHTML = this.textContent + ' <span class="dropdown-arrow">▼</span>';
            
            // Update filter
            filters.style = filterValue;
            filterItems();
        });
    });
    
    // Handle real photos toggle
    if (realPhotosToggle) {
        realPhotosToggle.addEventListener('change', function() {
            filters.realPhotos = this.checked;
            filterItems();
        });
    }
    
    // Category Tabs (Interior Design / Architecture)
    const categoryTabs = document.querySelectorAll('.category-tab');
    const tabUnderline = document.querySelector('.tab-underline');
    const contentPanels = document.querySelectorAll('.content-panel');
    
    // Initialize underline position
    function updateUnderline(tab) {
        if (tabUnderline && tab) {
            tabUnderline.style.left = tab.offsetLeft + 'px';
            tabUnderline.style.width = tab.offsetWidth + 'px';
        }
    }
    
    // Honor URL hash to set initial tab (e.g. interior.html#architecture)
    const hashCategory = window.location.hash.replace('#', '');
    if (hashCategory) {
        const targetTab = document.querySelector(`.category-tab[data-category="${hashCategory}"]`);
        const targetPanel = document.querySelector(`.${hashCategory}-panel`);
        if (targetTab && targetPanel && !targetTab.classList.contains('active')) {
            categoryTabs.forEach(t => t.classList.remove('active'));
            contentPanels.forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });
            targetTab.classList.add('active');
            targetPanel.classList.add('active');
            targetPanel.style.display = '';
        }
    }

    // Set initial underline position
    const activeTab = document.querySelector('.category-tab.active');
    if (activeTab) {
        updateUnderline(activeTab);
    }
    
    // Handle tab clicks
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            const currentActive = document.querySelector('.category-tab.active');
            
            if (this === currentActive) return;
            
            // Determine slide direction
            const tabs = Array.from(categoryTabs);
            const currentIndex = tabs.indexOf(currentActive);
            const newIndex = tabs.indexOf(this);
            const slideLeft = newIndex > currentIndex;
            
            // Update tab active states
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Animate underline
            updateUnderline(this);
            
            // Get panels
            const currentPanel = document.querySelector('.content-panel.active');
            const newPanel = document.querySelector(`.${category}-panel`);
            
            if (currentPanel && newPanel) {
                // Slide out current panel
                currentPanel.classList.remove('active');
                currentPanel.style.display = 'block';
                currentPanel.classList.add(slideLeft ? 'slide-out-left' : 'slide-out-right');
                
                // Slide in new panel
                newPanel.style.display = 'block';
                newPanel.classList.add(slideLeft ? 'slide-in-left' : 'slide-in-right');
                
                // Clean up after animation
                setTimeout(() => {
                    currentPanel.style.display = 'none';
                    currentPanel.classList.remove('slide-out-left', 'slide-out-right');
                    newPanel.classList.remove('slide-in-left', 'slide-in-right');
                    newPanel.classList.add('active');
                }, 400);
            }
        });
    });
    
    // Update underline on window resize
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
            updateUnderline(activeTab);
        }
    });
});
