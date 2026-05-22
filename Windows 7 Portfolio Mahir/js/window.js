const WindowManager = {
    windows: [], // Array of open windows { id, appId, el, zIndex, minimized, maximized }
    activeZIndex: 100,
    isCompactViewport() {
        return window.matchMedia('(max-width: 820px)').matches;
    },

    openApp(appId) {
        const app = APPS[appId];
        if (!app) return;

        if (app.type === 'link') {
            window.open(app.url, '_blank');
            return;
        }

        if (app.type === 'system' && app.title !== 'Recycle Bin') {
            // Placeholder for system apps like my computer
            alert(`${app.title} is purely visual in this mock.`);
            return;
        }

        // Check if already open
        const existing = this.windows.find(w => w.appId === appId);
        if (existing) {
            this.restoreWindow(existing.id);
            this.focusWindow(existing.id);
            return;
        }

        const winId = 'win-' + Date.now();
        const win = {
            id: winId,
            appId: appId,
            minimized: false,
            maximized: false,
            zIndex: ++this.activeZIndex
        };

        const defaultWidth = app.width || 800;
        const defaultHeight = app.height || 500;
        const tbHeight = document.getElementById('taskbar')?.offsetHeight || 40;
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const deskHeight = Math.max(220, viewportH - tbHeight);
        const compact = this.isCompactViewport();

        const desktopMaxW = Math.max(280, viewportW - 30);
        const desktopMaxH = Math.max(180, deskHeight - 20);
        const width = compact ? viewportW : Math.min(defaultWidth, desktopMaxW);
        const height = compact ? deskHeight : Math.min(defaultHeight, desktopMaxH);
        
        // On compact screens, stack windows in-place; on desktop keep cascade offset.
        const offset = compact ? 0 : this.windows.length * 30;
        const top = compact ? 0 : Math.max(30, (deskHeight - height) / 2 + offset);
        const left = compact ? 0 : Math.max(30, (viewportW - width) / 2 + offset);

        const el = document.createElement('div');
        el.className = 'window aero-glass focused';
        el.id = winId;
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        el.style.top = top + 'px';
        el.style.left = left + 'px';
        el.style.zIndex = win.zIndex;

        // Iframe or system HTML
        let contentHtml = '';
        if (app.type === 'iframe') {
            // Pass the app id to the iframe implicitly via url parameter if needed, or rely on internal logic
            contentHtml = `
                <div class="window-loading">
                    <div class="window-loading-spinner"></div>
                    <span class="window-loading-label">Loading...</span>
                </div>
                <iframe class="app-frame is-loading" src="${app.url}" title="${app.title}" loading="eager"></iframe>
                <div class="window-drag-overlay"></div>
            `;
        } else {
            contentHtml = `<div style="padding: 20px;"><h2>${app.title}</h2><p>System folder placeholder</p></div>`;
        }

        el.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">
                    <img src="${getIconSvg(app.icon)}" alt="icon">
                    <span>${app.title}</span>
                </div>
                <div class="window-controls">
                    <div class="win-btn minimize"><svg viewBox="0 0 10 10"><rect x="1" y="8" width="8" height="1"></rect></svg></div>
                    <div class="win-btn maximize"><svg viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor"></rect></svg></div>
                    <div class="win-btn close"><svg viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor"></line><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor"></line></svg></div>
                </div>
            </div>
            <div class="window-content">
                ${contentHtml}
            </div>
            <div class="resizer n"></div>
            <div class="resizer e"></div>
            <div class="resizer s"></div>
            <div class="resizer w"></div>
            <div class="resizer ne"></div>
            <div class="resizer nw"></div>
            <div class="resizer se"></div>
            <div class="resizer sw"></div>
        `;

        document.getElementById('window-container').appendChild(el);

        const iframeEl = el.querySelector('iframe');
        const loadingEl = el.querySelector('.window-loading');
        if (iframeEl && loadingEl) {
            const markLoaded = () => {
                iframeEl.classList.remove('is-loading');
                iframeEl.classList.add('is-ready');
                loadingEl.classList.add('hidden');
                setTimeout(() => {
                    if (loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);
                }, 200);
            };

            iframeEl.addEventListener('load', markLoaded, { once: true });

            iframeEl.addEventListener('error', () => {
                iframeEl.classList.remove('is-loading');
                loadingEl.classList.add('error');
                loadingEl.innerHTML = `<span>Failed to load ${app.title}. Try reopening this window.</span>`;
            }, { once: true });
        }

        win.el = el;
        this.windows.push(win);

        this.setupWindowEvents(win);
        this.setupResizeEvents(win);
        this.focusWindow(winId);
        this.normalizeWindowLayout();
        TaskBar.updateTaskbar();
    },

    normalizeWindowLayout() {
        const tbHeight = document.getElementById('taskbar')?.offsetHeight || 40;
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const deskHeight = Math.max(220, viewportH - tbHeight);
        const compact = this.isCompactViewport();

        this.windows.forEach((win, index) => {
            if (!win.el || win.minimized) return;

            if (compact) {
                win.el.classList.remove('maximized');
                win.maximized = false;
                win.isSnapped = false;
                win.el.style.left = '0px';
                win.el.style.top = '0px';
                win.el.style.width = viewportW + 'px';
                win.el.style.height = deskHeight + 'px';
                return;
            }

            if (win.maximized) return;

            const width = Math.min(win.el.offsetWidth || 700, Math.max(280, viewportW - 20));
            const height = Math.min(win.el.offsetHeight || 480, Math.max(180, deskHeight - 10));
            let left = parseFloat(win.el.style.left);
            let top = parseFloat(win.el.style.top);

            if (Number.isNaN(left)) left = 30 + index * 14;
            if (Number.isNaN(top)) top = 30 + index * 14;

            left = Math.min(Math.max(0, left), Math.max(0, viewportW - width));
            top = Math.min(Math.max(0, top), Math.max(0, deskHeight - height));

            win.el.style.width = width + 'px';
            win.el.style.height = height + 'px';
            win.el.style.left = left + 'px';
            win.el.style.top = top + 'px';
        });
    },

    setupWindowEvents(win) {
        const el = win.el;
        const titlebar = el.querySelector('.window-titlebar');
        
        // Focus on click
        el.addEventListener('mousedown', () => this.focusWindow(win.id));

        // Controls
        el.querySelector('.close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(win.id);
        });
        el.querySelector('.minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(win.id);
        });
        el.querySelector('.maximize').addEventListener('click', (e) => {
            e.stopPropagation();
            this.maximizeWindow(win.id);
        });

        // Double click titlebar to maximize
        titlebar.addEventListener('dblclick', () => {
            if (this.isCompactViewport()) return;
            this.maximizeWindow(win.id);
        });

        // Create snap preview element globally if it doesn't exist
        if (!document.getElementById('snap-preview')) {
            const preview = document.createElement('div');
            preview.id = 'snap-preview';
            preview.className = 'snap-preview';
            document.getElementById('desktop-environment').appendChild(preview);
        }

        // Dragging logic
        let isDragging = false;
        let startX, startY;
        let initialX, initialY;

        titlebar.addEventListener('mousedown', (e) => {
            if (this.isCompactViewport()) return;
            if (e.target.closest('.window-controls')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            if (win.maximized || win.isSnapped) {
                const rect = el.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                
                if (win.maximized) {
                    this.maximizeWindow(win.id); // Triggers restore
                } else if (win.isSnapped) {
                    win.isSnapped = false;
                    if (win.prevRect) {
                        el.style.width = win.prevRect.width;
                        el.style.height = win.prevRect.height;
                    }
                }
                
                const newRect = el.getBoundingClientRect();
                initialX = e.clientX - (newRect.width * ratio);
                initialY = e.clientY - 15; // Rough titlebar offset
                
                el.style.left = initialX + 'px';
                el.style.top = initialY + 'px';
            } else {
                initialX = parseInt(el.style.left) || 0;
                initialY = parseInt(el.style.top) || 0;
            }

            el.classList.add('dragging');
            this.focusWindow(win.id);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // Prevent dragging completely above screen
            if (newY < 0) newY = 0;

            el.style.left = newX + 'px';
            el.style.top = newY + 'px';
            
            const snapPreview = document.getElementById('snap-preview');
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const tbHeight = document.getElementById('taskbar')?.offsetHeight || 40;
            const deskHeight = screenH - tbHeight;

            // Aero snap detection
            if (e.clientY <= 0) {
                snapPreview.style.left = '0px';
                snapPreview.style.top = '0px';
                snapPreview.style.width = '100%';
                snapPreview.style.height = deskHeight + 'px';
                snapPreview.classList.add('active');
                win.snapIntent = 'maximize';
            } else if (e.clientX <= 0) {
                snapPreview.style.left = '0px';
                snapPreview.style.top = '0px';
                snapPreview.style.width = '50%';
                snapPreview.style.height = deskHeight + 'px';
                snapPreview.classList.add('active');
                win.snapIntent = 'left';
            } else if (e.clientX >= screenW - 1) {
                snapPreview.style.left = '50%';
                snapPreview.style.top = '0px';
                snapPreview.style.width = '50%';
                snapPreview.style.height = deskHeight + 'px';
                snapPreview.classList.add('active');
                win.snapIntent = 'right';
            } else {
                snapPreview.classList.remove('active');
                win.snapIntent = null;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                el.classList.remove('dragging');
                
                const snapPreview = document.getElementById('snap-preview');
                if (snapPreview) snapPreview.classList.remove('active');
                
                if (win.snapIntent) {
                    el.classList.add('snapping');
                    
                    if (!win.isSnapped && !win.maximized) {
                        win.prevRect = {
                            left: el.style.left,
                            top: el.style.top,
                            width: el.style.width,
                            height: el.style.height
                        };
                    }
                    
                    const screenH = window.innerHeight;
                    const tbHeight = document.getElementById('taskbar')?.offsetHeight || 40;
                    const deskHeight = screenH - tbHeight;
                    
                    if (win.snapIntent === 'maximize') {
                        if(!win.maximized) this.maximizeWindow(win.id);
                        win.isSnapped = false;
                    } else if (win.snapIntent === 'left' || win.snapIntent === 'right') {
                        if(win.maximized) {
                            win.maximized = false;
                            el.classList.remove('maximized');
                        }
                        el.style.left = win.snapIntent === 'left' ? '0px' : '50%';
                        el.style.top = '0px';
                        el.style.width = '50%';
                        el.style.height = deskHeight + 'px';
                        win.isSnapped = true;
                    }
                    win.snapIntent = null;
                    setTimeout(() => el.classList.remove('snapping'), 200);
                }
            }
        });
    },

    setupResizeEvents(win) {
        const el = win.el;
        const resizers = el.querySelectorAll('.resizer');
        let isResizing = false;
        let currentResizer;
        let startX, startY, startW, startH, startLeft, startTop;

        resizers.forEach(resizer => {
            resizer.addEventListener('mousedown', (e) => {
                if (this.isCompactViewport()) return;
                if (win.maximized || win.minimized) return; 
                isResizing = true;
                currentResizer = resizer;
                startX = e.clientX;
                startY = e.clientY;
                startW = el.offsetWidth;
                startH = el.offsetHeight;
                startLeft = el.offsetLeft;
                startTop = el.offsetTop;
                el.classList.add('resizing');
                this.focusWindow(win.id);
                e.preventDefault();
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newW = startW;
            let newH = startH;
            let newLeft = startLeft;
            let newTop = startTop;
            
            const minW = 300;
            const minH = 200;

            if (currentResizer.classList.contains('e') || currentResizer.classList.contains('ne') || currentResizer.classList.contains('se')) {
                newW = Math.max(minW, startW + dx);
            }
            if (currentResizer.classList.contains('w') || currentResizer.classList.contains('nw') || currentResizer.classList.contains('sw')) {
                newW = Math.max(minW, startW - dx);
                if (newW > minW) newLeft = startLeft + dx;
            }
            if (currentResizer.classList.contains('s') || currentResizer.classList.contains('se') || currentResizer.classList.contains('sw')) {
                newH = Math.max(minH, startH + dy);
            }
            if (currentResizer.classList.contains('n') || currentResizer.classList.contains('ne') || currentResizer.classList.contains('nw')) {
                newH = Math.max(minH, startH - dy);
                if (newH > minH) newTop = startTop + dy;
            }

            el.style.width = newW + 'px';
            el.style.height = newH + 'px';
            el.style.left = newLeft + 'px';
            if (newTop >= 0) el.style.top = newTop + 'px';
            
            // Re-eval resize vs snap states if they move around
            win.isSnapped = false; 
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                el.classList.remove('resizing');
                if (win.isSnapped === false) {
                     win.prevRect = null; // user manually resized, forget the old snap history sizes
                }
            }
        });
    },

    focusWindow(id) {
        this.windows.forEach(w => {
            if (w.el) w.el.classList.remove('focused');
        });
        
        const win = this.windows.find(w => w.id === id);
        if (win) {
            win.zIndex = ++this.activeZIndex;
            win.el.style.zIndex = win.zIndex;
            win.el.classList.add('focused');
            win.minimized = false;
            win.el.classList.remove('minimized');
        }
        TaskBar.updateTaskbar();
    },

    minimizeWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (win) {
            win.minimized = true;
            win.el.classList.add('minimized');
            win.el.classList.remove('focused');
        }
        TaskBar.updateTaskbar();
    },

    restoreWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (win) {
            win.minimized = false;
            win.el.classList.remove('minimized');
            this.focusWindow(id);
        }
    },

    maximizeWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (win) {
            if (this.isCompactViewport()) return;
            win.maximized = !win.maximized;
            win.el.classList.add('snapping');
            if (win.maximized) {
                if (!win.isSnapped) {
                    win.prevRect = {
                        left: win.el.style.left,
                        top: win.el.style.top,
                        width: win.el.style.width,
                        height: win.el.style.height
                    };
                }
                win.isSnapped = false;
                win.el.classList.add('maximized');
            } else {
                win.el.classList.remove('maximized');
                if (win.prevRect) {
                    win.el.style.width = win.prevRect.width;
                    win.el.style.height = win.prevRect.height;
                    win.el.style.top = win.prevRect.top;
                    win.el.style.left = win.prevRect.left;
                }
            }
            setTimeout(() => win.el.classList.remove('snapping'), 200);
        }
    },

    closeWindow(id) {
        const index = this.windows.findIndex(w => w.id === id);
        if (index !== -1) {
            const win = this.windows[index];
            win.el.remove();
            this.windows.splice(index, 1);
            TaskBar.updateTaskbar();
            
            // Focus topmost window if any
            if (this.windows.length > 0) {
                // sort by zIndex
                const topWin = [...this.windows].sort((a,b) => b.zIndex - a.zIndex)[0];
                if (!topWin.minimized) this.focusWindow(topWin.id);
            }
        }
    }
};

// Expose to global window object so child iframes (like terminal) can access it
window.WindowManager = WindowManager;

// Listen for messages from iframes (e.g., Terminal commands)
window.addEventListener('message', (event) => {
    if (event.data) {
        if (event.data.type === 'openApp' && event.data.appId) {
            WindowManager.openApp(event.data.appId);
        } else if (event.data.type === 'getWindows') {
            const windowsList = WindowManager.windows.map(w => {
                const app = APPS[w.appId];
                return {
                    id: w.id,
                    appId: w.appId,
                    title: app ? app.title : w.appId,
                    iconSvg: app ? getIconSvg(app.icon) : getIconSvg('computer')
                };
            });
            event.source.postMessage({ type: 'windowsList', windows: windowsList }, '*');
        } else if (event.data.type === 'closeWindow' && event.data.winId) {
            WindowManager.closeWindow(event.data.winId);
        } else if (event.data.type === 'closeApp' && event.data.appId) {
            // Closes all windows with this appId
            const toClose = WindowManager.windows.filter(w => w.appId === event.data.appId);
            toClose.forEach(w => WindowManager.closeWindow(w.id));
        }
    }
});

window.addEventListener('resize', () => {
    WindowManager.normalizeWindowLayout();
});

// ── Source Code Inspect Block js code ────────

document.addEventListener('contextmenu', event => event.preventDefault());
            document.onkeydown = function(e) {
            if (e.keyCode == 123 || (e.ctrlKey && e.key == 'u') || (e.ctrlKey && e.shiftKey && e.key == 'I')) {
                return false;
              }
            }