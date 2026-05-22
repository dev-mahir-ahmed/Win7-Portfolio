const Desktop = {
    icons: [
        { id: 'computer', appId: 'computer' },
        { id: 'projects', appId: 'projects' },
        { id: 'private-projects', appId: 'private-projects' },
        { id: 'resume', appId: 'resume' },
        { id: 'skills', appId: 'skills' },
        { id: 'terminal', appId: 'terminal' },
        { id: 'calculator', appId: 'calculator' }, // 7th item (end of column 1)
        { id: 'notepad', appId: 'notepad' },       // 8th item (start of column 2)
        { id: 'paint', appId: 'paint' },
        { id: 'github', appId: 'github' },
        { id: 'contact', appId: 'contact' },
        { id: 'recycle', appId: 'recycle' }        // 12th item (5th in column 2)
    ],

    init() {
        this.renderIcons();
        this.setupDrag();
        this.setupContextMenu();
    },

    renderIcons() {
        const grid = document.getElementById('desktop-grid');
        grid.innerHTML = '';
        
        let isIconDragging = false;
        let dragIcon = null;
        let iconStartX, iconStartY;
        let initialIconX, initialIconY;

        this.icons.forEach((iconData, index) => {
            const app = APPS[iconData.appId];
            if (!app) return;
            
            const el = document.createElement('div');
            el.className = 'desktop-icon';
            el.dataset.app = iconData.appId;
            el.innerHTML = `
                <img src="${getIconSvg(app.icon)}" alt="${app.title}">
                <span>${app.title}</span>
            `;
            
            // Initial positioning for generic grid look
            el.style.position = 'absolute';
            el.style.top = (10 + (index % 7) * 100) + 'px';
            el.style.left = (10 + Math.floor(index / 7) * 80) + 'px';

            // Single click to select
            el.addEventListener('mousedown', (e) => {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
                el.classList.add('selected');
                
                isIconDragging = true;
                dragIcon = el;
                iconStartX = e.clientX;
                iconStartY = e.clientY;
                initialIconX = parseInt(el.style.left) || 0;
                initialIconY = parseInt(el.style.top) || 0;
                
                e.preventDefault();
                e.stopPropagation();
            });
            
            // Double click to open
            el.addEventListener('dblclick', (e) => {
                WindowManager.openApp(iconData.appId);
                e.stopPropagation();
            });

            grid.appendChild(el);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isIconDragging || !dragIcon) return;
            const dx = e.clientX - iconStartX;
            const dy = e.clientY - iconStartY;
            dragIcon.style.left = (initialIconX + dx) + 'px';
            dragIcon.style.top = (initialIconY + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isIconDragging) {
                isIconDragging = false;
                dragIcon = null;
            }
        });
    },

    setupDrag() {
        // Dragging implemented inside renderIcons
    },

    setupContextMenu() {
        const desktop = document.getElementById('desktop-environment');
        const contextMenu = document.getElementById('desktop-context-menu');
        
        // Hide context menu when clicking anywhere else
        document.addEventListener('mousedown', (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });

        // Show context menu on right click
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if (e.target.closest('#window-container') || e.target.closest('#taskbar') || e.target.closest('#start-menu') || e.target.closest('#clock-widget')) {
                return;
            }

            const iconEl = e.target.closest('.desktop-icon');
            if (iconEl) {
                const appId = iconEl.dataset.app;
                this.renderIconContextMenu(appId, e.clientX, e.clientY);
            } else {
                this.renderBackgroundContextMenu(e.clientX, e.clientY);
            }
        });
    },

    populateMenu(menuItems, x, y) {
        const contextMenu = document.getElementById('desktop-context-menu');
        let actionMap = {};
        let actionIdCounter = 0;

        function buildMenuHtml(items) {
            return items.map((item) => {
                if (item.type === 'separator') {
                    return '<div class="context-menu-separator"></div>';
                }
                
                const disabledClass = item.disabled ? 'disabled' : '';
                const rightTextHtml = item.rightText ? `<span class="context-menu-right-text">${item.rightText}</span>` : '';
                const boldStyle = item.bold ? 'font-weight: bold;' : '';
                
                let subMenuHtml = '';
                if (item.subMenu && !item.disabled) {
                    subMenuHtml = `<div class="context-sub-menu aero-glass">${buildMenuHtml(item.subMenu)}</div>`;
                }

                let actionIdAttr = '';
                if (item.action && !item.disabled) {
                    const id = 'action_' + (actionIdCounter++);
                    actionMap[id] = item.action;
                    actionIdAttr = `data-action-id="${id}"`;
                }

                return `
                    <div class="context-menu-item ${disabledClass}" ${actionIdAttr} style="${boldStyle}">
                        <span>${item.label}</span>
                        ${rightTextHtml}
                        ${subMenuHtml}
                    </div>
                `;
            }).join('');
        }

        contextMenu.innerHTML = buildMenuHtml(menuItems);

        // Add event listeners to active items
        const itemEls = contextMenu.querySelectorAll('.context-menu-item[data-action-id]');
        itemEls.forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const actionId = el.getAttribute('data-action-id');
                const action = actionMap[actionId];
                if (action) {
                    action();
                    contextMenu.style.display = 'none';
                }
            });
        });

        // Calculate position
        contextMenu.style.display = 'flex';
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let finalX = x;
        let finalY = y;
        if (finalX + menuWidth > windowWidth) finalX = windowWidth - menuWidth;
        if (finalY + menuHeight > windowHeight) finalY = windowHeight - menuHeight;
        
        contextMenu.style.left = finalX + 'px';
        contextMenu.style.top = finalY + 'px';
    },

    renderBackgroundContextMenu(x, y) {
        const pasteDisabled = !this.clipboard;
        const menuItems = [
            { label: 'View', rightText: '▶', subMenu: [
                { label: 'Large icons', action: () => this.changeIconSize('large') },
                { label: 'Medium icons', action: () => this.changeIconSize('medium') },
                { label: 'Small icons', action: () => this.changeIconSize('small') }
            ]},
            { label: 'Sort by', rightText: '▶', subMenu: [
                { label: 'Name', action: () => this.sortIcons('name') },
                { label: 'Type', action: () => this.sortIcons('type') }
            ]},
            { label: 'Refresh', action: () => {
                const grid = document.getElementById('desktop-grid');
                grid.style.opacity = '0';
                setTimeout(() => { grid.style.opacity = '1'; }, 100);
            }},
            { type: 'separator' },
            { label: 'Paste', disabled: pasteDisabled,  action: () => this.pasteIcon() },
            { label: 'Paste shortcut', disabled: pasteDisabled, action: () => this.pasteIcon(true) },
            { type: 'separator' },
            { label: 'New', rightText: '▶', subMenu: [
                { label: 'Folder', action: () => this.createMockIcon('folder') },
                { label: 'Text Document', action: () => this.createMockIcon('document') }
            ]},
            { type: 'separator' },
            { label: 'Screen resolution', disabled: true },
            { label: 'Gadgets', disabled: true },
            { label: 'Personalize', action: () => { WindowManager.openApp('about'); }}
        ];
        this.populateMenu(menuItems, x, y);
    },

    renderIconContextMenu(appId, x, y) {
        const isMock = appId.startsWith('mock_');
        
        const menuItems = [
            { label: 'Open', bold: true, action: () => WindowManager.openApp(appId) },
            { type: 'separator' },
            { label: 'Cut', disabled: !isMock, action: () => { this.clipboard = { action: 'cut', appId: appId }; } },
            { label: 'Copy', disabled: !isMock, action: () => { this.clipboard = { action: 'copy', appId: appId }; } },
            { type: 'separator' },
            { label: 'Create shortcut', disabled: true },
            { label: 'Delete', disabled: !isMock, action: () => {
                this.icons = this.icons.filter(i => i.appId !== appId);
                if(this.clipboard && this.clipboard.appId === appId) this.clipboard = null;
                this.renderIcons();
            }},
            { label: 'Rename', disabled: !isMock, action: () => this.enableRename(appId) },
            { type: 'separator' },
            { label: 'Properties', disabled: true }
        ];
        this.populateMenu(menuItems, x, y);
    },


    changeIconSize(size) {
        const icons = document.querySelectorAll('.desktop-icon');
        const grid = document.getElementById('desktop-grid');
        
        let width, height, imgSize, fontSize;
        if (size === 'large') {
            width = '90px'; height = '110px'; imgSize = '64px'; fontSize = '13px';
        } else if (size === 'small') {
            width = '64px'; height = '74px'; imgSize = '32px'; fontSize = '11px';
        } else {
            // medium (default)
            width = '74px'; height = '90px'; imgSize = '48px'; fontSize = '12px';
        }

        icons.forEach(icon => {
            icon.style.width = width;
            icon.style.height = height;
            const img = icon.querySelector('img');
            if (img) {
                img.style.width = imgSize;
                img.style.height = imgSize;
            }
            const span = icon.querySelector('span');
            if (span) {
                span.style.fontSize = fontSize;
            }
        });
    },

    sortIcons(criteria) {
        const grid = document.getElementById('desktop-grid');
        
        let sortedIcons = [...this.icons];
        if (criteria === 'name') {
            sortedIcons.sort((a, b) => {
                const titleA = APPS[a.appId]?.title || '';
                const titleB = APPS[b.appId]?.title || '';
                return titleA.localeCompare(titleB);
            });
        } else if (criteria === 'type') {
            sortedIcons.sort((a, b) => {
                const typeA = APPS[a.appId]?.type || '';
                const typeB = APPS[b.appId]?.type || '';
                return typeA.localeCompare(typeB);
            });
        }
        
        this.icons = sortedIcons;
        this.renderIcons();
    },

    pasteIcon(isShortcut = false) {
        if (!this.clipboard) return;
        const sourceData = APPS[this.clipboard.appId];
        if (!sourceData) return;

        const newAppId = 'mock_' + Date.now();
        APPS[newAppId] = { ...sourceData, title: sourceData.title + (isShortcut ? ' - Shortcut' : ' - Copy') };
        this.icons.push({ id: newAppId, appId: newAppId });
        
        if (this.clipboard.action === 'cut') {
            this.icons = this.icons.filter(i => i.appId !== this.clipboard.appId);
            this.clipboard = null;
        }
        
        this.renderIcons();
    },

    enableRename(appId) {
        const iconEl = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
        if (!iconEl) return;
        
        const span = iconEl.querySelector('span');
        const currentTitle = APPS[appId].title;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTitle;
        input.className = 'rename-input';
        
        // Match span styling temporarily
        input.style.width = '100%';
        input.style.boxSizing = 'border-box';
        input.style.fontSize = span.style.fontSize || '12px';
        input.style.textAlign = 'center';
        input.style.fontFamily = 'inherit';
        input.style.background = '#fff';
        input.style.color = '#000';
        input.style.border = '1px solid #1a73e8';
        input.style.outline = 'none';
        
        const finishRename = () => {
            const newTitle = input.value.trim();
            if (newTitle && newTitle !== currentTitle) {
                APPS[appId].title = newTitle;
            }
            this.renderIcons(); // Re-render to restore span and layout
        };

        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur(); // Triggers blur which runs finishRename
            } else if (e.key === 'Escape') {
                input.value = currentTitle; // Revert change
                input.blur();
            }
        });

        iconEl.replaceChild(input, span);
        input.focus();
        input.select();
    },

    createMockIcon(type, isShortcut = false) {
        const baseTitle = type === 'folder' ? 'New Folder' : 'New Text Document';
        const rawTitle = isShortcut ? `${baseTitle} - Shortcut` : baseTitle;
        
        // Find existing copies to append (2), (3) etc.
        let copyNumber = 0;
        let title = rawTitle;
        
        while (true) {
            let found = false;
            for (const iconObj of this.icons) {
                const existingTitle = APPS[iconObj.appId]?.title;
                if (existingTitle === title) {
                    found = true;
                    break;
                }
            }
            if (!found) break; // Unique title found
            copyNumber++;
            title = `${rawTitle} (${copyNumber + 1})`;
        }

        const newAppId = 'mock_' + Date.now();
        let htmlContent = '';
        const safeTitle = title.replace(/"/g, '&quot;');

        if (type === 'document') {
            const jokes = [
                "Done messing around?",
                "404 Motivation Not Found.",
                "I'm not a real file, I'm just a div in a trenchcoat.",
                "Why do programmers prefer dark mode? Because light attracts bugs.",
                "To DO:\n1. Wake up\n2. Survive\n3. Go back to sleep.",
                "If it works, don't touch it.",
                "I have a joke about UDP, but you might not get it.",
                "My code is like a joke, nobody gets it.",
                "Passwords are like underwear: don't leave them out where people can see them.",
                "Error: Task successfully failed.",
                "This document is intentionally left blank. Except for this sentence. And this one.",
                "Lorem ipsum dolor sit... eh, who cares anyway.",
                "Hello World! I've been waiting for you.",
                "Ctrl+C, Ctrl+V, praying works... Repeat.",
                "99 little bugs in the code. Take one down, patch it around... 127 little bugs in the code.",
                "It’s not a bug. It’s an undocumented feature.",
                "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?'",
                "There are 10 types of people in the world: those who understand binary, and those who don't.",
                "Did you try turning it off and on again?",
                "I am a text file. Hear me roar. Or, you know, just read me."
            ];
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            
            // Build the exact notepad UI clone
            htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Notepad</title>
    <style>
        body { margin: 0; padding: 0; height: 100vh; overflow: hidden; display: flex; background: #fff; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; color: #111; }
        .notepad-shell { width: 100%; height: 100%; display: flex; flex-direction: column; border: 1px solid #c8ced9; background: #fff; }
        .doc-strip { height: 27px; display: flex; align-items: center; padding: 0 10px; font-size: 12px; color: #2c4a68; background: linear-gradient(to bottom, #f4f7fb 0%, #e9eff8 100%); border-bottom: 1px solid #d0d7e2; }
        .menu-bar { height: 29px; display: flex; align-items: stretch; padding-left: 3px; border-bottom: 1px solid #d7dbe4; background: #f9fbfd; position: relative; z-index: 40; }
        .menu-root { position: relative; }
        .menu-trigger { height: 100%; padding: 0 10px; border: none; background: transparent; font-size: 13px; color: #111; cursor: default; }
        .editor-wrap { flex: 1; min-height: 0; position: relative; }
        #editor { width: 100%; height: 100%; box-sizing: border-box; border: none; outline: none; resize: none; font-family: Consolas, "Lucida Console", monospace; font-size: 15px; line-height: 1.35; padding: 8px; color: #000; background: #fff; white-space: pre-wrap; overflow-x: hidden; tab-size: 4; }
        .status-bar { height: 22px; border-top: 1px solid #d7dbe4; display: flex; align-items: center; justify-content: flex-end; background: linear-gradient(to bottom, #fbfcfe 0%, #eef2f8 100%); font-size: 11px; color: #384f68; }
        .status-segment { border-left: 1px solid #d7dbe4; padding: 0 10px; height: 100%; display: inline-flex; align-items: center; white-space: nowrap; }
    </style>
</head>
<body>
    <div class="notepad-shell">
        <div class="doc-strip" id="doc-title">${safeTitle}</div>
        <div class="menu-bar">
            <div class="menu-root"><button class="menu-trigger">File</button></div>
            <div class="menu-root"><button class="menu-trigger">Edit</button></div>
            <div class="menu-root"><button class="menu-trigger">Format</button></div>
            <div class="menu-root"><button class="menu-trigger">View</button></div>
            <div class="menu-root"><button class="menu-trigger">Help</button></div>
        </div>
        <div class="editor-wrap">
            <textarea id="editor" spellcheck="false">${randomJoke}</textarea>
        </div>
        <div class="status-bar">
            <div class="status-segment">Ln 1, Col 1</div>
            <div class="status-segment">100%</div>
            <div class="status-segment">UTF-8</div>
        </div>
    </div>
</body>
</html>`;
        } else {
            const allFakeFiles = [
                { name: "Top_Secret_AI_Source_Code.txt", type: "doc" },
                { name: "World_Domination_Plan_v2.pdf", type: "pdf" },
                { name: "Passwords_DONT_LOOK.xlsx", type: "xls" },
                { name: "Math_Assignment.docx", type: "doc" },
                { name: "Minecraft_Launcher.exe", type: "exe" },
                { name: "GTA_VI_Leak_Real_No_Virus.zip", type: "zip" },
                { name: "Q3_Earnings_Report.pdf", type: "pdf" },
                { name: "Cat_Memes_Archive_2026.zip", type: "zip" },
                { name: "Meeting_Bingo.xlsx", type: "xls" },
                { name: "kernel32.dll", type: "sys" },
                { name: "user32.dll", type: "sys" },
                { name: "please_help_im_trapped_in_the_os.txt", type: "doc" },
                { name: "Homework_Answers_Final.pdf", type: "pdf" },
                { name: "DO_NOT_RUN_THIS.vbs", type: "code" },
                { name: "cringe_meme_2016.png", type: "img" },
                { name: "virus.exe", type: "exe" },
                { name: "Totally_Legit_File.doc", type: "doc" },
                { name: "Browser_History_Backup.zip", type: "zip" },
                { name: "Secret_Recipe.txt", type: "doc" },
                { name: "Half_Life_3_Alpha.exe", type: "exe" }
            ];

            const folderHeads = [
                "Developer Secrets",
                "Homework",
                "Very Important Business Stuff",
                "Empty Folder",
                "System32_Backup",
                "Game Mods",
                "Tax Returns 2012"
            ];
            const randomHead = folderHeads[Math.floor(Math.random() * folderHeads.length)];
            
            let numFiles = randomHead === "Empty Folder" ? 0 : Math.floor(Math.random() * 5) + 2; // 2 to 6 files
            let selectedFiles = [];
            let pool = [...allFakeFiles];
            for (let i = 0; i < numFiles; i++) {
                const idx = Math.floor(Math.random() * pool.length);
                selectedFiles.push(pool.splice(idx, 1)[0]);
            }

            // Generate exact recycled bin UI clone
            let filesHtml = selectedFiles.length === 0 ? 
                `<div class="empty-message" style="display:flex;">
                    <svg viewBox="0 0 64 64" width="64" height="64" opacity="0.5" xmlns="http://www.w3.org/2000/svg"><path d="M 18 24 L 46 24 L 42 54 L 22 54 Z" fill="#ddd" stroke="#999" stroke-width="2" /><ellipse cx="32" cy="24" rx="16" ry="4" fill="#eee" stroke="#999" stroke-width="2" /><line x1="24" y1="30" x2="26" y2="48" stroke="#aaa" stroke-width="2" /><line x1="32" y1="30" x2="32" y2="48" stroke="#aaa" stroke-width="2" /><line x1="40" y1="30" x2="38" y2="48" stroke="#aaa" stroke-width="2" /></svg>
                    <p style="margin-top: 10px;">This folder is empty.</p>
                </div>` : 
                selectedFiles.map(f => {
                    return `<div class="file-item" data-joke-msg="You do not have permission to open ${f.name}. Actually, nobody does.\\n\\nContact your system administrator, or just pretend you didn\\'t see this.">
                        <svg class="file-icon"><use href="#icon-${f.type}"></use></svg>
                        <span class="file-name">${f.name}</span>
                    </div>`;
                }).join('');

            htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${safeTitle}</title>
    <style>
        body { background-color: #fff; padding: 0; margin: 0; display: flex; flex-direction: column; height: 100vh; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .explorer-toolbar { background: linear-gradient(to bottom, #f2f6fb 0%, #e4ebf6 100%); border-bottom: 1px solid #c4ccda; padding: 8px 15px; display: flex; align-items: center; gap: 15px; }
        .nav-btn { width: 28px; height: 28px; border-radius: 50%; border: 1px solid transparent; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #555; }
        .nav-btn svg { width: 16px; height: 16px; }
        .address-bar { flex: 1; background: #fff; border: 1px solid #bcc6d5; padding: 5px 10px; display: flex; align-items: center; font-size: 13px; }
        .toolbar-menu { background: #f0f4f9; border-bottom: 1px solid #d9e3f1; padding: 5px 15px; display: flex; gap: 20px; font-size: 12px; color: #333; }
        .file-grid { padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 20px; flex: 1; overflow-y: auto; align-content: flex-start; }
        .file-item { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 10px 5px; border: 1px solid transparent; border-radius: 3px; cursor: pointer; }
        .file-item:hover { background: rgba(46, 141, 236, 0.1); border: 1px solid rgba(46, 141, 236, 0.3); }
        .file-item.selected { background: rgba(46, 141, 236, 0.2); border: 1px solid rgba(46, 141, 236, 0.5); }
        .file-icon { width: 52px; height: 52px; margin-bottom: 5px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2)); display: block; }
        .file-name { font-size: 11px; color: #222; word-wrap: break-word; max-width: 100%; text-align: center; line-height: 1.3; }
        .empty-message { display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #888; font-size: 14px; }
        .status-bar { background: #f0f4f9; border-top: 1px solid #d9e3f1; padding: 4px 15px; font-size: 12px; color: #555; display: flex; justify-content: space-between; }
        /* Modal */
        #joke-modal { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); justify-content: center; align-items: center; z-index: 100; }
        .joke-box { background: #fff; border: 1px solid #999; border-radius: 5px; width: 350px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
        .joke-title { background: linear-gradient(to bottom, #f2f6fb 0%, #e4ebf6 100%); padding: 8px 10px; font-weight: bold; font-size: 13px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; }
        .joke-content { padding: 20px; font-size: 13px; text-align: left; display: flex; align-items: center; gap: 15px; white-space: pre-wrap; }
        .btn-ok { align-self: flex-end; margin: 0 10px 10px 0; padding: 5px 20px; border: 1px solid #0055cc; background: linear-gradient(to bottom, #f2f6fb 0%, #e4ebf6 100%); border-radius: 3px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="explorer-toolbar">
        <div class="nav-btn" title="Back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></div>
        <div class="nav-btn" title="Forward"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.3"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
        <div class="address-bar"><span>${safeTitle} ❭ ${randomHead}</span></div>
    </div>
    <div class="toolbar-menu">
        <div style="color:#777;">Organize</div><div style="color:#777;">Share with</div><div style="color:#777;">Burn</div>
    </div>

    <!-- SVGS -->
    <svg style="display:none;" xmlns="http://www.w3.org/2000/svg">
        <symbol id="icon-doc" viewBox="0 0 64 64">
            <path d="M 12 4 L 38 4 L 52 18 L 52 60 C 52 62 50 64 48 64 L 16 64 C 14 64 12 62 12 60 L 12 4 Z" fill="#ffffff" stroke="#999999" stroke-width="2"/>
            <path d="M 38 4 L 38 18 L 52 18 Z" fill="#e6e6e6" stroke="#999999" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="20" y1="28" x2="44" y2="28" stroke="#cccccc" stroke-width="2" />
            <line x1="20" y1="36" x2="44" y2="36" stroke="#cccccc" stroke-width="2" />
            <line x1="20" y1="44" x2="34" y2="44" stroke="#cccccc" stroke-width="2" />
        </symbol>
        <symbol id="icon-pdf" viewBox="0 0 64 64">
            <use href="#icon-doc"></use>
            <text x="14" y="22" font-family="sans-serif" font-size="10" font-weight="bold" fill="#d32f2f">PDF</text>
        </symbol>
        <symbol id="icon-xls" viewBox="0 0 64 64">
            <use href="#icon-doc"></use>
            <text x="14" y="22" font-family="sans-serif" font-size="10" font-weight="bold" fill="#2e7d32">XLS</text>
        </symbol>
        <symbol id="icon-code" viewBox="0 0 64 64">
            <path d="M 12 4 L 38 4 L 52 18 L 52 60 C 52 62 50 64 48 64 L 16 64 C 14 64 12 62 12 60 L 12 4 Z" fill="#2d2d2d" stroke="#111111" stroke-width="2"/>
            <path d="M 38 4 L 38 18 L 52 18 Z" fill="#4a4a4a" stroke="#111111" stroke-width="1.5" stroke-linejoin="round"/>
            <text x="18" y="44" font-family="monospace" font-size="18" font-weight="bold" fill="#a6e22e">&lt;/&gt;</text>
        </symbol>
        <symbol id="icon-img" viewBox="0 0 64 64">
            <rect x="8" y="14" width="48" height="36" rx="2" fill="#ffffff" stroke="#aaaaaa" stroke-width="2" />
            <circle cx="20" cy="24" r="5" fill="#ffca28" />
            <path d="M 8 50 L 26 32 L 34 40 L 44 26 L 56 38 L 56 50 Z" fill="#66bb6a" />
            <rect x="8" y="14" width="48" height="36" rx="2" fill="none" stroke="#ffffff" stroke-width="1" />
        </symbol>
        <symbol id="icon-exe" viewBox="0 0 64 64">
            <rect x="12" y="16" width="40" height="32" rx="4" fill="#ffffff" stroke="#999999" stroke-width="2"/>
            <rect x="12" y="16" width="40" height="10" rx="4" fill="#607d8b"/>
            <circle cx="18" cy="21" r="2" fill="#ffffff"/>
            <rect x="18" y="32" width="28" height="10" fill="#e0e0e0" stroke="#999" stroke-width="1"/>
        </symbol>
        <symbol id="icon-zip" viewBox="0 0 64 64">
            <use href="#icon-doc"></use>
            <path d="M 22 4 L 22 6 L 26 6 L 26 8 L 22 8 L 22 10 L 26 10 L 26 12 L 22 12 L 22 14 L 26 14 L 26 16 L 22 16 L 22 18 L 26 18 L 26 20 L 22 20 L 22 24 L 26 24 L 26 28 L 22 28 C 22 28 22 32 26 32 C 30 32 30 28 30 28" fill="none" stroke="#666" stroke-width="2"/>
        </symbol>
        <symbol id="icon-sys" viewBox="0 0 64 64">
            <use href="#icon-doc"></use>
            <circle cx="32" cy="40" r="10" fill="#f44336" stroke="#b71c1c" stroke-width="2"/>
            <path d="M 32 34 L 32 42 M 32 46 L 32 46" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        </symbol>
    </svg>

    <div class="file-grid" id="file-grid">${filesHtml}</div>

    <div class="status-bar">
        <span>${selectedFiles.length} items</span>
    </div>

    <div id="joke-modal">
        <div class="joke-box">
            <div class="joke-title">
                <span id="joke-title-text">Windows Error</span>
                <span style="cursor:pointer;" onclick="closeJoke()">X</span>
            </div>
            <div class="joke-content">
                <svg id="joke-icon" style="flex-shrink:0;" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" fill="#e04040" stroke="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="#fff" stroke-width="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="#fff" stroke-width="2"/></svg>
                <div id="joke-msg">msg</div>
            </div>
            <button class="btn-ok" onclick="closeJoke()">OK</button>
        </div>
    </div>

    <script>
        function openJoke(msg) {
            document.getElementById('joke-msg').innerText = msg;
            document.getElementById('joke-modal').style.display = 'flex';
        }
        function closeJoke() {
            document.getElementById('joke-modal').style.display = 'none';
        }
        document.querySelectorAll('.file-item').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                document.querySelectorAll('.file-item').forEach(f => f.classList.remove('selected'));
                el.classList.add('selected');
                e.stopPropagation();
            });
            el.addEventListener('dblclick', () => {
                const msg = el.getAttribute('data-joke-msg');
                if(msg) openJoke(msg);
            });
        });
        document.addEventListener('mousedown', () => {
            document.querySelectorAll('.file-item').forEach(f => f.classList.remove('selected'));
        });
    </script>
</body>
</html>`;
        }

        const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

        // Add to APPS registry 
        APPS[newAppId] = {
            title: title,
            icon: type === 'folder' ? 'folder' : 'document',
            type: 'iframe',
            url: dataUrl,
            width: type === 'folder' ? 640 : 540,
            height: type === 'folder' ? 420 : 450
        };
        
        this.icons.push({ id: newAppId, appId: newAppId });
        this.renderIcons();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Desktop.init();
});

// ── Source Code Inspect Block js code ────────

document.addEventListener('contextmenu', event => event.preventDefault());
            document.onkeydown = function(e) {
            if (e.keyCode == 123 || (e.ctrlKey && e.key == 'u') || (e.ctrlKey && e.shiftKey && e.key == 'I')) {
                return false;
              }
            }