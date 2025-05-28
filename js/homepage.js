document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.querySelector('.cards-container');
    const cards = Array.from(document.querySelectorAll('.card'));
    const navDots = document.querySelectorAll('.nav-dot');
    
    // State variables
    let startX;
    let isDragging = false;
    let currentCardIndex = 0;
    let activeCard = null; // Ajouter cette variable pour suivre la carte active
    let cardPositions = [
        { z: 3, y: 0, scale: 1 },
        { z: 2, y: 10, scale: 0.95 },
        { z: 1, y: 20, scale: 0.9 }
    ];
    
    // Setup initial positions
    updateCardsPosition();
    
    // Event listeners
    cards.forEach((card, index) => {
        // Touch events
        card.addEventListener('touchstart', (e) => handleDragStart(e, card));
        card.addEventListener('touchmove', (e) => handleDrag(e, card));
        card.addEventListener('touchend', (e) => handleDragEnd(e, card));
        
        // Mouse events
        card.addEventListener('mousedown', (e) => handleDragStart(e, card));
    });
    
    // Global mouse events (utilisent activeCard)
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
    
    // Nav dots event listeners
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIndex = parseInt(dot.getAttribute('data-index'));
            moveToCard(targetIndex);
        });
    });
    
    // Event handlers
    function handleDragStart(e, card) {
        if (card !== cards[0]) return; // Only top card is draggable
        
        isDragging = true;
        activeCard = card; // Stocker la carte active
        
        // Get starting position of pointer/touch
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
            e.preventDefault(); // Empêcher le défilement sur mobile
        } else {
            startX = e.clientX;
        }
        
        // Remove transition during drag
        card.style.transition = 'none';
    }
    
    function handleDrag(e) {
        if (!isDragging || !activeCard) return;
        
        // Calculate drag distance
        let currentX;
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX;
            e.preventDefault(); // Empêcher le défilement sur mobile
        } else {
            currentX = e.clientX;
        }
        
        const dragDistance = currentX - startX;
        
        // Only affect the top card
        if (Math.abs(dragDistance) > 5) { // Réduit le seuil pour une meilleure réactivité
            const opacity = Math.max(0, 1 - Math.min(Math.abs(dragDistance) / 300, 1));
            const rotation = dragDistance * 0.1; // Slight rotation during drag
            
            activeCard.style.transform = `translateX(${dragDistance}px) rotate(${rotation}deg)`;
            activeCard.style.opacity = opacity.toString();
        }
    }
    
    function handleDragEnd(e) {
        if (!isDragging || !activeCard) return;
        
        isDragging = false;
        activeCard.style.transition = 'transform 0.5s ease, opacity 0.5s';
        
        // Calculate final drag distance
        let finalX;
        if (e.type === 'touchend') {
            finalX = e.changedTouches[0].clientX;
        } else {
            finalX = e.clientX || startX; // Utiliser startX si clientX n'est pas disponible
        }
        
        const dragDistance = finalX - startX;
        
        // If dragged far enough, move card to end of stack
        if (Math.abs(dragDistance) > 100) { // Réduit le seuil pour faciliter le swipe
            // Reset position with transition
            activeCard.style.transform = `translateX(${dragDistance > 0 ? 1000 : -1000}px) rotate(${dragDistance > 0 ? 30 : -30}deg)`;
            activeCard.style.opacity = '0';
            
            setTimeout(() => {
                // Move first card to end
                rotateCards();
                updateCardsPosition();
                activeCard.style.transition = 'none';
                activeCard.style.transform = '';
                activeCard.style.opacity = '';
                
                setTimeout(() => {
                    activeCard.style.transition = 'transform 0.5s ease, opacity 0.5s';
                    activeCard = null; // Réinitialisation de la carte active
                }, 50);
            }, 300);
        } else {
            // Reset position
            activeCard.style.transform = '';
            activeCard.style.opacity = '';
            activeCard = null; // Réinitialisation de la carte active
        }
    }

    
    function rotateCards() {
        // Move the first card to the end
        const firstCard = cards.shift();
        cards.push(firstCard);
        
        // Update current card index
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        
        // Update active dot
        updateActiveDot();
    }
    
    function moveToCard(targetIndex) {
        // Calculate how many rotations we need
        const rotations = (targetIndex - currentCardIndex + cards.length) % cards.length;
        
        if (rotations === 0) return;
        
        // Add transition class to all cards
        cards.forEach(card => card.classList.add('transition'));
        
        // Rotate cards the necessary times
        for (let i = 0; i < rotations; i++) {
            rotateCards();
        }
        
        // Update the visual positions
        updateCardsPosition();
        
        // Remove transition class after animation completes
        setTimeout(() => {
            cards.forEach(card => card.classList.remove('transition'));
        }, 500);
    }
    
    function updateCardsPosition() {
        cards.forEach((card, index) => {
            let position;
            if (index === 0) {
                position = { z: 3, y: 0, x: 0, rotate: 0, scale: 1 };
            } else if (index === 1) {
                position = { z: 2, y: -5, x: 25, rotate: 1, scale: 0.96 };
            } else {
                position = { z: 1, y: -10, x: 50, rotate: 2, scale: 0.92 };
            }
            
            card.style.transform = `translateY(${position.y}px) translateX(${position.x}px) rotate(${position.rotate}deg) scale(${position.scale})`;
            card.style.zIndex = position.z;
        });
    }
    
    function updateActiveDot() {
        navDots.forEach((dot, index) => {
            if (index === currentCardIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
});