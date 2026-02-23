document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeBtn = document.getElementById('theme-btn');
    let currentTheme = localStorage.getItem('portfolio-theme');

    if (!currentTheme) {
        currentTheme = 'dark';
        localStorage.setItem('portfolio-theme', 'dark');
    }

    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
        themeBtn.textContent = '☀️';
        themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
        themeBtn.textContent = '🌙';
        themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }

    function toggleTheme() {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
            themeBtn.textContent = '🌙';
            themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
            themeBtn.textContent = '☀️';
            themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    }

    // Advanced Theme Toggle with Droplet Effect (View Transitions)
    themeBtn.addEventListener('click', (event) => {
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 600,
                    easing: 'ease-out',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });
    });

    // --- Video Hover Logic ---
    const aboutQuadrant = document.getElementById('about-quadrant');
    const aboutVideo = document.getElementById('about-video');
    const profileImg = document.querySelector('.profile-img');

    if (aboutQuadrant && aboutVideo) {
        aboutQuadrant.addEventListener('mouseenter', () => {
            aboutVideo.currentTime = 0; 
            aboutVideo.play();
        });
        aboutQuadrant.addEventListener('mouseleave', () => {
            aboutVideo.pause();
        });
    }

    if (profileImg && aboutVideo) {
        profileImg.addEventListener('mouseenter', () => {
            aboutVideo.currentTime = 0; 
            aboutVideo.play();
        });
        profileImg.addEventListener('mouseleave', () => {
            aboutVideo.pause();
        });
    }

    // --- SCROLL REVEAL ANIMATIONS FOR INTRO SECTION ---
    const introImg = document.getElementById('intro-img');
    const introContent = document.querySelector('.intro-content');

    const observerOptions = {
        threshold: 0.2
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    if (introImg) scrollObserver.observe(introImg);
    if (introContent) scrollObserver.observe(introContent);

    // --- BUTTERY SMOOTH TRAILING CURSOR LOGIC ---
    const cursor = document.getElementById('custom-cursor');
    
    // Set starting positions
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    // Track real mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor && cursor.style.opacity === '0') {
            cursor.style.opacity = '1'; // Show cursor once mouse moves
        }
    });

    // Animate the custom cursor using hardware acceleration (requestAnimationFrame)
    function animateCursor() {
        // The "0.2" is the speed factor. Lower = more lag/delay. Higher = tighter/faster follow.
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        if (cursor) {
            // Translate3d forces the GPU to render it, making it extremely smooth
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        }
        
        requestAnimationFrame(animateCursor); // Loops infinitely at monitor's refresh rate
    }
    
    // Start animation loop
    animateCursor();

    // Hide custom cursor when leaving the window
    document.addEventListener('mouseout', () => {
        if (cursor) cursor.style.opacity = '0';
    });

// =========================================
// Water Droplet Page Transition Logic
// =========================================
const navLinks = document.querySelectorAll('.nav-links a:not(.active), .btn-primary, .quadrant');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetUrl = this.getAttribute('href');
        
        if (targetUrl && targetUrl.includes('.html') && !targetUrl.includes('#')) {
            e.preventDefault(); 
            
            const droplet = document.createElement('div');
            droplet.classList.add('page-transition-droplet');
            document.body.appendChild(droplet);
            
            // Start exactly at the mouse click
            droplet.style.left = `${e.clientX}px`;
            droplet.style.top = `${e.clientY}px`;
            
            // Expand the wave
            setTimeout(() => {
                droplet.style.transform = 'translate(-50%, -50%) scale(150)';
            }, 10);
            
            // Navigate after wave covers the screen
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600); 
        }
    });
});
});