// Contact Us Modal
function openContactModal() {
    document.getElementById('contactModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Consultation Modal
function openConsultationModal() {
    document.getElementById('consultationModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeConsultationModal() {
    document.getElementById('consultationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const contactModal = document.getElementById('contactModal');
    const consultationModal = document.getElementById('consultationModal');
    
    if (event.target === contactModal) {
        closeContactModal();
    }
    if (event.target === consultationModal) {
        closeConsultationModal();
    }
}

// Handle consultation form submission
document.addEventListener('DOMContentLoaded', function() {
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(consultationForm);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', Object.fromEntries(formData));
            
            // Show success message
            alert('Thank you! Your consultation request has been submitted.');
            
            // Close modal and reset form
            closeConsultationModal();
            consultationForm.reset();
        });
    }
});
