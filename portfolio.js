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
});
