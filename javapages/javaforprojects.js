document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. Theme Initialization & View Transitions
    // =========================================
    const themeBtn = document.getElementById('theme-btn');
    let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    function toggleTheme() {
        let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    themeBtn.addEventListener('click', (event) => {
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }
        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        const transition = document.startViewTransition(() => toggleTheme());

        transition.ready.then(() => {
            document.documentElement.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
                { duration: 600, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
            );
        });
    });

    // =========================================
    // 2. Custom Cursor Logic
    // =========================================
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = mouseX, cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            if (cursor.style.opacity === '0') cursor.style.opacity = '1'; 
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor); 
        }
        animateCursor();
        document.addEventListener('mouseout', () => cursor.style.opacity = '0');
    }

    // =========================================
    // 3. Scroll Animations (Initial Load)
    // =========================================
    const scrollElements = document.querySelectorAll('.scroll-anim');
    setTimeout(() => {
        scrollElements.forEach(el => el.classList.add('is-visible'));
    }, 100);

    // =========================================
    // 4. Sliding Container & Image Crossfade Logic
    // =========================================
    const projectsList = document.getElementById('projects-list');
    const projectRows = document.querySelectorAll('.project-row');
    const previewContainer = document.getElementById('preview-container');
    const img1 = document.getElementById('preview-image-1');
    const img2 = document.getElementById('preview-image-2');

    let activeImg = img1;
    let inactiveImg = img2;
    let currentImgSrc = ""; // Tracks what is currently showing

    // 1. Container Slide Logic: Controlled by the entire list area
    projectsList.addEventListener('mouseenter', () => {
        previewContainer.classList.add('active');
    });

    projectsList.addEventListener('mouseleave', () => {
        previewContainer.classList.remove('active');
    });

    // 2. Image Crossfade Logic: Controlled by individual rows
    projectRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const imgSrc = row.getAttribute('data-img');
            
            // If hovering the same project, do nothing
            if (currentImgSrc === imgSrc) return;
            
            currentImgSrc = imgSrc;

            // Load the new image into the invisible tag
            inactiveImg.src = imgSrc;
            
            // Fade it in
            inactiveImg.classList.add('active');
            
            // Fade the old one out
            activeImg.classList.remove('active');
            
            // Swap their roles for the next hover
            const temp = activeImg;
            activeImg = inactiveImg;
            inactiveImg = temp;
        });
    });

    
});