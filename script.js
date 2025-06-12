// script.js

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const heroTitleWords = document.querySelectorAll('.hero-title .word');
const animatedElements = document.querySelectorAll('.left-button, .card'); // Includes cards and left buttons
const heroRightBox = document.querySelector('.hero-right-box');
const overlayButton = document.querySelector('.overlay-button');


// === Scroll-Triggered Animations Setup ===
// Dynamically inject CSS for scroll animations and avatar animations
const styleSheet = document.createElement('style');
styleSheet.innerText = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .animate-on-scroll.is-visible {
        opacity: 1;
        transform: translateY(0);
    }
    .hero-title .word {
        display: inline-block;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .hero-title .word.animated {
        opacity: 1;
        transform: translateY(0);
    }
    .avatars-inline img {
        opacity: 0;
        transform: translateX(-50px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .avatars-inline img.animated {
        opacity: 1;
        transform: translateX(0);
    }
`;
document.head.appendChild(styleSheet);

// Options for the Intersection Observer
const observerOptions = {
    root: null, 
    rootMargin: '0px', 
    threshold: 0.1 
};

// Callback function for the Intersection Observer
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Element is visible, add the 'is-visible' class to trigger animation
            entry.target.classList.add('is-visible');
            // Stop observing once the element has animated, but re-observe on theme switch
            observer.unobserve(entry.target);
        }
    });
};


const observer = new IntersectionObserver(observerCallback, observerOptions);

// Initial setup for animated elements (cards and left buttons)
animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll'); 
    observer.observe(el); 
});


// === Animation Functions ===

// Function to animate avatars
function animateAvatars() {
    const avatars = document.querySelectorAll('.avatars-inline img');
    avatars.forEach((avatar, i) => {
        setTimeout(() => {
            avatar.classList.add('animated');
        }, i * 150); // Stagger animation for each avatar
    });
}

// Function to animate hero title words sequentially
function animateHeroTitleWords(index = 0) {
    if (index < heroTitleWords.length) {
        const currentWord = heroTitleWords[index];
        currentWord.classList.add('animated');

        // If the current word is 'IDEAS', trigger avatar animation shortly after
        if (currentWord.classList.contains('ideas-text')) {
            setTimeout(() => {
                animateAvatars();
            }, 100);
        }

        setTimeout(() => {
            animateHeroTitleWords(index + 1);
        }, 300); // Delay between each word appearing
    }
}


// === Theme Toggle Logic ===
function setTheme(themeName) {
    // 1. Reset all animated elements to their initial hidden state
    heroTitleWords.forEach(word => {
        word.classList.remove('animated');
    });
    document.querySelectorAll('.avatars-inline img').forEach(avatar => {
        avatar.classList.remove('animated');
    });
    animatedElements.forEach(el => {
        el.classList.remove('is-visible');
        // Crucial: Re-observe elements that might have been unobserved
        observer.unobserve(el); 
        observer.observe(el); 
    });


    // 2. Apply theme classes to the body
    if (themeName === 'light-mode') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>'; // Change to sun icon
        }
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>'; // Change to moon icon
        }
    }

    // 3. Re-trigger animations after a short delay
    
    setTimeout(() => {
        animateHeroTitleWords(); // Re-triggers word and avatar animation
    }, 100); 
}


// Check for saved theme in localStorage on page load and apply it
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme('dark-mode'); // Default to dark mode if no theme saved
}

// Add event listener for theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            setTheme('dark-mode');
        } else {
            setTheme('light-mode');
        }
    });
}


// === Dynamic Hover Effect for Hero Right Box Button ===
if (heroRightBox && overlayButton) {
    heroRightBox.addEventListener('mouseenter', () => {
        overlayButton.style.transform = 'translateX(-50%) translateY(-5px)'; 
        overlayButton.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)'; 
    });

    heroRightBox.addEventListener('mouseleave', () => {
        overlayButton.style.transform = 'translateX(-50%) translateY(0)'; // Return to original position
        overlayButton.style.boxShadow = 'none';
    });
}

console.log("Page loaded successfully!");
