document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. Theme Initialization & View Transitions
    // =========================================
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

    // The advanced, buttery-smooth API from your index page
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

    // =========================================
    // 2. Typewriter Effect for Bio
    // =========================================
    const bioText = "Howdie!, My name is Kenneth or Ken, and I use the 'KD' as my nickname across the digital space presenting 'Ken's Designs'. I am a passionate Web Developer & Designer.\n\nAs I love joining IT organizations and collaborative activities to continuously learn, boost my knowledge, and connect with bunch of people. As I am always curious when it comes to new IT stuffs, coding, and still wanting to push my creative boundaries in the IT world.";
    
    const typeContainer = document.getElementById('typewriter-text');
    if (typeContainer) {
        typeContainer.innerHTML = '<span id="text-output"></span><span class="type-cursor"></span>';
        const textOutput = document.getElementById('text-output');
        
        let charIndex = 0;
        function typeWriter() {
            if (charIndex < bioText.length) {
                if (bioText.charAt(charIndex) === '\n') {
                    textOutput.innerHTML += '<br>';
                } else {
                    textOutput.innerHTML += bioText.charAt(charIndex);
                }
                charIndex++;
                setTimeout(typeWriter, 20); // Typing speed
            }
        }
        setTimeout(typeWriter, 500); 
    }

    // =========================================
    // 4. Scroll Animations (Intersection Observer)
    // =========================================
    const scrollElements = document.querySelectorAll('.scroll-anim');

    const elementInView = (entry) => {
        entry.target.classList.add('is-visible');

        // Fill skill bars when they scroll into view
        if (entry.target.classList.contains('slide-left') || entry.target.classList.contains('slide-right')) {
            const bars = entry.target.querySelectorAll('.skill-fill');
            bars.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                elementInView(entry);
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.2 });

    if (scrollElements.length > 0) {
        scrollElements.forEach(el => observer.observe(el));
    }

    // =========================================
    // 5. Custom Cursor Logic (From your Index)
    // =========================================
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursor.style.opacity === '0') {
                cursor.style.opacity = '1'; 
            }
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor); 
        }
        
        animateCursor();

        document.addEventListener('mouseout', () => {
            cursor.style.opacity = '0';
        });
    }

    // =========================================
    // 7. Dynamic Certificate Showcase Logic (PDF Edition)
    // =========================================
    const certCards = document.querySelectorAll('.cert-card');
    const showcase = document.getElementById('cert-showcase');
    const showcaseImg = document.getElementById('showcase-img');
    const showcaseTitle = document.getElementById('showcase-title');
    const showcaseDesc = document.getElementById('showcase-desc');
    const showcaseDownload = document.getElementById('showcase-download');
    const showcaseClose = document.getElementById('showcase-close');

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get data from the clicked card
            const imgSrc = card.getAttribute('data-img');
            const pdfSrc = card.getAttribute('data-pdf'); // Grabs the PDF path
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            // Populate the showcase visual info
            showcaseImg.src = imgSrc;
            showcaseTitle.textContent = title;
            showcaseDesc.textContent = desc;
            
            // Set up the PDF download link
            showcaseDownload.href = pdfSrc;
            
            // Clean the title to make a nice file name (e.g., "Kenneth_Content_Marketing_Cert.pdf")
            const cleanTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            showcaseDownload.setAttribute('download', `Kenneth_${cleanTitle}_Cert.pdf`);
            
            // Open the showcase
            showcase.classList.add('active');

            // Smoothly scroll to the showcase
            setTimeout(() => {
                showcase.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    });

    // Close button logic
    if (showcaseClose) {
        showcaseClose.addEventListener('click', () => {
            showcase.classList.remove('active');
            // Scroll back down slightly to the grid
            setTimeout(() => {
                document.getElementById('certs-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    }

    // --- NEW: THE FORCED DOWNLOAD LOGIC ---
    showcaseDownload.addEventListener('click', function(e) {
        e.preventDefault(); // Stop the browser from just opening the image
        const imagePath = this.getAttribute('href');
        const certName = showcaseTitle.textContent.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Cleans the title for a file name
        
        // Fetch the image data directly and force a local download
        fetch(imagePath)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobUrl;
                tempLink.download = `Kenneth_${certName}_certificate.jpg`; // Creates a clean file name
                document.body.appendChild(tempLink);
                tempLink.click(); // Trigger the download
                
                // Clean up the browser memory
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(tempLink);
            })
            .catch(err => {
                console.error("Download failed, opening in new tab instead.", err);
                window.open(imagePath, '_blank'); // Fallback if fetch fails
            });
    });

    if (showcaseClose) {
        showcaseClose.addEventListener('click', () => {
            showcase.classList.remove('active');
            setTimeout(() => {
                document.getElementById('certs-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    }

});