// Add clock functionality for both lock screens
function updateClock() {
    const now = new Date();
    const timeElements = document.querySelectorAll('.time');
    const dateElements = document.querySelectorAll('.date');
    
    timeElements.forEach(el => {
        el.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    });

    dateElements.forEach(el => {
        el.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    });
}

updateClock();
setInterval(updateClock, 1000);

// Add lock screen click handler
document.querySelector('.mac-signin').addEventListener('click', function() {
    document.getElementById('lock-screen').style.display = 'none';
});

// For mobile, add swipe up gesture
let touchStart = 0;
document.querySelector('.mobile-lock-screen').addEventListener('touchstart', e => {
    touchStart = e.touches[0].clientY;
});

document.querySelector('.mobile-lock-screen').addEventListener('touchend', e => {
    const touchEnd = e.changedTouches[0].clientY;
    if (touchStart - touchEnd > 100) { // If swipe up
        document.getElementById('lock-screen').style.display = 'none';
    }
});

// Function typewriter to display text typing effect
function initTypewriter() {
    const typingText = document.querySelector('.typing');
    const texts = [
        'Provide iOS certificates quickly',
        'Provide application development consultation',
        'Support technical help 24/7'
    ];
    let textIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < texts[textIndex].length) {
            // Instead of concatenating strings, set text content directly
            typingText.textContent = texts[textIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingText.textContent = texts[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        }
    }

    setTimeout(type, 1000);
}

// IP info functions
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error when getting IP:', error);
        throw error;
    }
}

async function getIPInfo(ip) {
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=efdf61c3ea7f4688b76773837cdd418d&ip=${ip}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error when getting IP information:', error);
        throw error;
    }
}

function displayIPInfo(ipInfo) {
    const container = document.querySelector('.ip-info-container');
    const html = `
        <div class="ip-details">
            <p><strong>IP:</strong> ${ipInfo.ip}</p>
            <p><strong>Country:</strong> ${ipInfo.country_name} ${ipInfo.country_emoji}</p>
            <p><strong>City:</strong> ${ipInfo.city}</p>
            <p><strong>State/Province:</strong> ${ipInfo.state_prov}</p>
            <p><strong>Latitude:</strong> ${ipInfo.latitude}</p>
            <p><strong>Longitude:</strong> ${ipInfo.longitude}</p>
            <p><strong>Time Zone:</strong> ${ipInfo.time_zone.name}</p>
            <p><strong>Current Time:</strong> ${ipInfo.time_zone.current_time}</p>
            <p><strong>ISP:</strong> ${ipInfo.isp}</p>
            <p><strong>Organization:</strong> ${ipInfo.organization}</p>
            <p><strong>Currency:</strong> ${ipInfo.currency.name} (${ipInfo.currency.symbol})</p>
            <p><strong>Language:</strong> ${ipInfo.languages}</p>
        </div>
    `;
    container.innerHTML = html;
}

async function initIPInfo() {
    const container = document.querySelector('.ip-info-container');
    container.innerHTML = '<div class="ip-info-loading">Loading IP information...</div>';
    
    try {
        const ip = await getIP();
        const ipInfo = await getIPInfo(ip);
        displayIPInfo(ipInfo);
    } catch (error) {
        console.error('Error details:', error);
        container.innerHTML = '<h3>An error occurred while getting IP information</h3>';
    }
}

// Device detection and video selection
function detectDevice() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const videoPC = document.getElementById('background-video-pc');
    const videoMobile = document.getElementById('background-video-mobile');
    
    if (isMobile) {
        videoPC.style.display = 'none';
        videoMobile.style.display = 'block';
    } else {
        videoPC.style.display = 'block';
        videoMobile.style.display = 'none';
    }
}

// Update video size based on window dimensions
function updateVideoSize() {
    const videoPC = document.getElementById('background-video-pc');
    const videoMobile = document.getElementById('background-video-mobile');
    
    if (videoPC && videoMobile) {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            videoMobile.style.display = 'block';
            videoPC.style.display = 'none';
        } else {
            videoPC.style.display = 'block';
            videoMobile.style.display = 'none';
        }
    }
}

// Lock screen functionality
function initLockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.querySelector('.main-content');
    const body = document.body;
    
    // Add lock-screen-active class to body
    body.classList.add('lock-screen-active');
    
    // Prevent wheel scroll
    function preventDefault(e) {
        e.preventDefault();
    }
    
    // Add wheel event listener
    window.addEventListener('wheel', preventDefault, { passive: false });
    
    // Handle unlock for both click and touch
    function unlockScreen() {
        lockScreen.classList.add('unlocked');
        
        // Show main content after animation completes
        setTimeout(() => {
            mainContent.classList.add('visible');
            lockScreen.style.display = 'none';
            body.classList.remove('lock-screen-active');
            window.removeEventListener('wheel', preventDefault);
        }, 1000);
    }

    // Add click listener for PC
    lockScreen.addEventListener('click', unlockScreen);
    
    // Add touch listeners for mobile
    let startY;
    
    lockScreen.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    
    lockScreen.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const deltaY = startY - endY;
        
        // If swipe up is more than 50px, unlock
        if (deltaY > 50) {
            unlockScreen();
        }
    });
}

// Add functionality to update large clock
function updateLargeClock() {
    const now = new Date();
    const timeElement = document.getElementById('large-clock-time');
    const dateElement = document.getElementById('large-clock-date');
    
    if (timeElement && dateElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        
        dateElement.textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Add functionality to update background clock
function updateBackgroundClock() {
    const now = new Date();
    const backgroundTime = document.getElementById('background-time');
    const backgroundDate = document.getElementById('background-date');
    
    // Update time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    backgroundTime.textContent = `${hours}:${minutes}`;
    
    // Update date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    backgroundDate.textContent = now.toLocaleDateString('en-US', options);
}

// Update background clock every second
setInterval(updateBackgroundClock, 1000);
updateBackgroundClock(); // Initial call

// Initialize when page is loaded - only use one event listener
document.addEventListener('DOMContentLoaded', () => {
    detectDevice();
    initLockScreen();
    initTypewriter();
    initIPInfo();
    initHamburgerMenu();
    updateVideoSize();
    updateClock();
    updateLargeClock();
    setInterval(updateLargeClock, 1000);
    
    // Dark mode toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const container = document.getElementById('container');

    // Check saved theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        container.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Theme toggle event listener
    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        container.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    
    // Add event listener for tap to slide up the video
    document.addEventListener('click', () => {
        const lockScreen = document.querySelector('.lock-screen');
        const container = document.getElementById('container');

        // Slide up video container instead of individual videos
        lockScreen.classList.add('unlocked');

        // Show the main content after the animation
        setTimeout(() => {
            container.style.display = 'block';
        }, 2500);
    });

});

// Hamburger menu functionality for displaying Vietcombank information
function initHamburgerMenu() {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const vcbPopup = document.querySelector('.vcb-popup');
    
    if (!hamburgerIcon || !vcbPopup) return;
    
    // Toggle popup when clicking on the icon
    hamburgerIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        vcbPopup.classList.toggle('active');
        
        // Add rotation effect to icon when active
        if (vcbPopup.classList.contains('active')) {
            hamburgerIcon.querySelectorAll('.bar').forEach((bar, index) => {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            });
        } else {
            hamburgerIcon.querySelectorAll('.bar').forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (vcbPopup.classList.contains('active') && 
            !vcbPopup.contains(e.target) && 
            !hamburgerIcon.contains(e.target)) {
            
            vcbPopup.classList.remove('active');
            
            // Reset hamburger icon
            hamburgerIcon.querySelectorAll('.bar').forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });
}

// Event listener for resize events
window.addEventListener('resize', updateVideoSize);
window.addEventListener('load', updateVideoSize);
