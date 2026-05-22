const TaskBar = {
    init() {
        const startBtn = document.getElementById('start-button');
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Keep taskbar clock + widget clock live
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Start Menu generic items
        const startPrograms = [
            'computer', 'projects', 'resume', 'skills', 'terminal', 'calculator', 'notepad', 'paint', 'contact', 'github', 'recycle'
        ];
        
        const programsList = document.getElementById('start-programs-list');
        startPrograms.forEach(appId => {
            const app = APPS[appId];
            if (!app) return;
            const el = document.createElement('div');
            el.className = 'start-program-item';
            el.innerHTML = `
                <img src="${getIconSvg(app.icon)}" alt="${app.title}">
                <span>${app.title}</span>
            `;
            el.addEventListener('click', () => {
                WindowManager.openApp(appId);
                this.toggleStartMenu(false);
            });
            programsList.appendChild(el);
        });

        // Start Menu right links
        document.querySelectorAll('.start-menu-links li[data-app]').forEach(li => {
            li.addEventListener('click', () => {
                WindowManager.openApp(li.dataset.app);
                this.toggleStartMenu(false);
            });
        });

        // Start Menu Search Filter
        const searchInput = document.getElementById('start-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                document.querySelectorAll('.start-program-item').forEach(el => {
                    const text = el.innerText.toLowerCase();
                    el.style.display = text.includes(term) ? 'flex' : 'none';
                });
            });
        }

        // Show Desktop btn
        document.getElementById('show-desktop').addEventListener('click', () => {
            let allMinimized = WindowManager.windows.every(w => w.minimized);
            WindowManager.windows.forEach(w => {
                if (allMinimized) {
                    WindowManager.restoreWindow(w.id);
                } else {
                    WindowManager.minimizeWindow(w.id);
                }
            });
        });

        // Clock Widget Toggle
        const clockBtn = document.getElementById('clock');
        const clockWidget = document.getElementById('clock-widget');
        if (clockBtn && clockWidget) {
            clockBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Hide Start Menu if open
                const startMenu = document.getElementById('start-menu');
                if (startMenu && startMenu.style.display !== 'none') {
                    TaskBar.toggleStartMenu(false);
                }

                if (clockWidget.style.display === 'none') {
                    clockWidget.style.display = 'flex';
                    TaskBar.updateClock();
                    TaskBar.renderCalendar();
                } else {
                    clockWidget.style.display = 'none';
                }
            });

            // Close widget when clicking outside
            document.addEventListener('click', (e) => {
                if (!clockWidget.contains(e.target) && e.target !== clockBtn) {
                    clockWidget.style.display = 'none';
                }
            });
        }

        // Shutdown
        document.getElementById('shutdown-btn').addEventListener('click', () => {
            if (SystemState.isShuttingDown) return;
            SystemState.isShuttingDown = true;

            const shutdownScreen = document.getElementById('shutdown-screen');
            const loginScreen = document.getElementById('login-screen');
            const desktopEnv = document.getElementById('desktop-environment');
            const shutdownAudio = document.getElementById('audio-shutdown');

            // Always close the menu on shutdown click.
            TaskBar.toggleStartMenu(false);

            if (shutdownAudio) {
                shutdownAudio.pause();
                shutdownAudio.currentTime = 0;
                shutdownAudio.volume = 0.5;
                shutdownAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
            }

            if (shutdownScreen && loginScreen && desktopEnv) {
                setTimeout(() => {
                    shutdownScreen.style.display = 'flex';

                    setTimeout(() => {
                        shutdownScreen.style.display = 'none';
                        desktopEnv.style.display = 'none';
                        SystemState.isShuttingDown = false;

                        // Reset login screen visibility and show it
                        if (typeof window.showLoginScreenWithFade === 'function') {
                            window.showLoginScreenWithFade();
                        } else {
                            loginScreen.classList.remove('hidden');
                            loginScreen.style.display = 'flex';
                        }

                        // Close all open apps so the desktop is clean next time
                        WindowManager.windows = [];
                        WindowManager.activeZIndex = 100;
                        document.getElementById('window-container').innerHTML = '';
                        document.getElementById('taskbar-items').innerHTML = '';
                    }, 3500);
                }, 120);
            }
        });

        // Power On
        const powerBtn = document.getElementById('power-on-btn');
        if (powerBtn) {
            powerBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
    },

    toggleStartMenu(forceState) {
        const menu = document.getElementById('start-menu');
        const startBtn = document.getElementById('start-button');
        
        if (forceState !== undefined) {
            SystemState.startMenuOpen = forceState;
        } else {
            SystemState.startMenuOpen = !SystemState.startMenuOpen;
        }

        if (SystemState.startMenuOpen) {
            menu.style.display = 'flex';
            startBtn.style.background = 'rgba(255,255,255,0.3)';
            startBtn.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
            const searchInput = document.getElementById('start-search-input');
            if (searchInput) searchInput.focus();
        } else {
            menu.style.display = 'none';
            startBtn.style.background = 'transparent';
            startBtn.style.boxShadow = 'none';
            // Clear search when closed
            const searchInput = document.getElementById('start-search-input');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        }
    },

    updateTaskbar() {
        const container = document.getElementById('taskbar-items');
        container.innerHTML = '';

        WindowManager.windows.forEach(win => {
            const app = APPS[win.appId];
            const el = document.createElement('div');
            
            let isActive = win.el.classList.contains('focused') && !win.minimized;
            el.className = `taskbar-item ${isActive ? 'active' : ''}`;
            el.title = app.title;
            el.innerHTML = `
                <img src="${getIconSvg(app.icon)}" alt="${app.title}">
                <span>${app.title}</span>
            `;

            el.addEventListener('click', () => {
                if (isActive) {
                    WindowManager.minimizeWindow(win.id);
                } else {
                    WindowManager.restoreWindow(win.id);
                    WindowManager.focusWindow(win.id);
                }
            });

            container.appendChild(el);
        });
    },

    updateClock() {
        const now = new Date();
        const compact = window.matchMedia('(max-width: 820px)').matches;
        const tiny = window.matchMedia('(max-width: 480px)').matches;
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = compact
            ? now.toLocaleDateString([], { day: '2-digit', month: '2-digit' })
            : now.toLocaleDateString();
        const clockEl = document.getElementById('clock');
        
        if (!clockEl) return;

        clockEl.innerHTML = tiny ? timeStr : (timeStr + '<br>' + dateStr);
        clockEl.style.display = 'flex';
        clockEl.style.flexDirection = tiny ? 'row' : 'column';
        clockEl.style.justifyContent = 'center';

        // Update Analog Clock if widget is open
        const hHand = document.getElementById('hour-hand');
        if (hHand) {
            const h = now.getHours();
            const m = now.getMinutes();
            const s = now.getSeconds();
            
            // Degrees
            const hDeg = (h % 12) * 30 + m * 0.5;
            const mDeg = m * 6 + s * 0.1;
            const sDeg = s * 6;
            
            hHand.style.transform = `rotate(${hDeg}deg)`;
            document.getElementById('min-hand').style.transform = `rotate(${mDeg}deg)`;
            document.getElementById('sec-hand').style.transform = `rotate(${sDeg}deg)`;
            
            document.getElementById('digital-clock-display').innerText = now.toLocaleTimeString();
        }
    },

    renderCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const todayDate = now.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNamesFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        document.getElementById('calendar-header').innerText = `${monthNames[month]} ${year}`;
        document.getElementById('current-date-footer').innerText = `${dayNamesFull[now.getDay()]}, ${monthNames[month]} ${todayDate}, ${year}`;

        const grid = document.querySelector('.calendar-grid');
        // keep only the first 7 day-name headers
        while (grid.children.length > 7) {
            grid.removeChild(grid.lastChild);
        }

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Previous month padding
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = document.createElement('div');
            d.className = 'cal-day other-month';
            d.innerText = daysInPrevMonth - i;
            grid.appendChild(d);
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            const d = document.createElement('div');
            d.className = `cal-day ${i === todayDate ? 'today' : ''}`;
            d.innerText = i;
            grid.appendChild(d);
        }

        // Next month padding (to fill 42 cells grid = 6 rows)
        const totalFilled = firstDay + daysInMonth;
        const totalCells = Math.ceil(totalFilled / 7) * 7;
        const paddingEnd = totalCells - totalFilled;
        
        for (let i = 1; i <= paddingEnd; i++) {
            const d = document.createElement('div');
            d.className = 'cal-day other-month';
            d.innerText = i;
            grid.appendChild(d);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    TaskBar.init();
});


// ── Source Code Inspect Block js code ────────

document.addEventListener('contextmenu', event => event.preventDefault());
            document.onkeydown = function(e) {
            if (e.keyCode == 123 || (e.ctrlKey && e.key == 'u') || (e.ctrlKey && e.shiftKey && e.key == 'I')) {
                return false;
              }
            }