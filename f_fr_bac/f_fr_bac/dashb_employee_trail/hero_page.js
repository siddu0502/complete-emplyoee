document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Functionality
    const scrollBtn = document.getElementById('scrollBtn');
    
    if(scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            if(featuresSection) {
                featuresSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }

    // 2. Extra Interaction for Login Cards
    // (Note: CSS :hover handles most visual effects, but JS can add extra logic)
    const cards = document.querySelectorAll('.card-btn');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Determine which card was clicked
            const type = card.classList.contains('card-employee') ? 'Employee' : 'Admin';
            
            // In a real app, this would redirect to a login page
            console.log(`${type} login clicked`);
            
            // Temporary visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px) scale(1)'; // Return to hover state
            }, 150);
        });
    });
});