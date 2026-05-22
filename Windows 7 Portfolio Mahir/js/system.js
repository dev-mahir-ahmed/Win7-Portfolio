// Create an SVG string based icon placeholder generator since we don't have binary assets
function getIconSvg(type) {
    const xmlns = 'xmlns="http://www.w3.org/2000/svg"';
    
    // Complex, multi-layered SVGs to mimic Windows 7 3D/Aero look
    const icons = {
        'computer': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="monitor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e6e8eb" />
                    <stop offset="100%" stop-color="#aeb5bc" />
                </linearGradient>
                <linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2d7dd2" />
                    <stop offset="100%" stop-color="#0a192f" />
                </linearGradient>
                <linearGradient id="stand" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#c1c7ce" />
                    <stop offset="100%" stop-color="#707982" />
                </linearGradient>
            </defs>
            <rect x="8" y="12" width="48" height="34" rx="4" fill="url(#monitor)" stroke="#555" stroke-width="1.5" />
            <rect x="12" y="16" width="40" height="26" fill="url(#screen)" />
            <path d="M 28 46 L 36 46 L 38 56 L 26 56 Z" fill="url(#stand)" />
            <ellipse cx="32" cy="56" rx="16" ry="3" fill="url(#stand)" stroke="#555" stroke-width="1" />
            <!-- Glare effect -->
            <polygon points="12,16 30,16 16,42 12,42" fill="rgba(255,255,255,0.15)" />
        </svg>`,
        
        'folder': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="back-folder" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e6b141" />
                    <stop offset="100%" stop-color="#c99120" />
                </linearGradient>
                <linearGradient id="front-folder" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#fadd78" />
                    <stop offset="100%" stop-color="#eaaa2d" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>
            <!-- Back flap -->
            <path d="M 8 16 L 24 16 L 28 22 L 56 22 C 58 22 60 24 60 26 L 60 48 C 60 50 58 52 56 52 L 8 52 C 6 52 4 50 4 48 L 4 20 C 4 18 6 16 8 16 Z" fill="url(#back-folder)" stroke="#a67b21" stroke-width="1" />
            <!-- Paper inside -->
            <rect x="12" y="24" width="40" height="20" fill="#fff" opacity="0.8" />
            <!-- Front flap -->
            <path d="M 4 52 L 12 28 C 12.5 26.5 14 25.5 15.5 25.5 L 61 25.5 C 63 25.5 63.5 27.5 62.5 29 L 56 52 Z" fill="url(#front-folder)" filter="url(#shadow)" stroke="#c48f21" stroke-width="1" />
        </svg>`,

        'private_folder': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="back-pfolder" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#e6b141" />
                    <stop offset="100%" stop-color="#c99120" />
                </linearGradient>
                <linearGradient id="front-pfolder" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#fadd78" />
                    <stop offset="100%" stop-color="#eaaa2d" />
                </linearGradient>
                <filter id="shadow-p">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>
            <!-- Back flap -->
            <path d="M 8 16 L 24 16 L 28 22 L 56 22 C 58 22 60 24 60 26 L 60 48 C 60 50 58 52 56 52 L 8 52 C 6 52 4 50 4 48 L 4 20 C 4 18 6 16 8 16 Z" fill="url(#back-pfolder)" stroke="#a67b21" stroke-width="1" />
            <!-- Paper inside -->
            <rect x="12" y="24" width="40" height="20" fill="#fff" opacity="0.8" />
            <!-- Front flap -->
            <path d="M 4 52 L 12 28 C 12.5 26.5 14 25.5 15.5 25.5 L 61 25.5 C 63 25.5 63.5 27.5 62.5 29 L 56 52 Z" fill="url(#front-pfolder)" filter="url(#shadow-p)" stroke="#c48f21" stroke-width="1" />
            <!-- Deny overlay badge -->
            <circle cx="48" cy="44" r="10" fill="none" stroke="#e74c3c" stroke-width="4" filter="url(#shadow-p)" />
            <line x1="41" y1="37" x2="55" y2="51" stroke="#e74c3c" stroke-width="4" stroke-linecap="round" />
        </svg>`,
        
        'terminal': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="term-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#1e1e1e" />
                    <stop offset="100%" stop-color="#000000" />
                </linearGradient>
                <linearGradient id="term-bar" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f0f0f0" />
                    <stop offset="100%" stop-color="#b0b0b0" />
                </linearGradient>
                <filter id="term-shadow">
                    <feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
                </filter>
            </defs>
            <rect x="6" y="10" width="52" height="44" rx="3" fill="url(#term-bg)" filter="url(#term-shadow)" stroke="#333" stroke-width="2" />
            <!-- Title bar -->
            <path d="M 6 13 C 6 11.5 7.5 10 9 10 L 55 10 C 56.5 10 58 11.5 58 13 L 58 20 L 6 20 Z" fill="url(#term-bar)" />
            <!-- Command prompt symbol -->
            <polyline points="14,28 22,34 14,40" fill="none" stroke="#0f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="26" y1="40" x2="36" y2="40" stroke="#0f0" stroke-width="3" />
            <!-- Red close button -->
            <circle cx="52" cy="15" r="3" fill="#e04040" />
        </svg>`,
        
        'document': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="doc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#e6e6e6" />
                </linearGradient>
                <linearGradient id="doc-fold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f0f0f0" />
                    <stop offset="100%" stop-color="#d4d4d4" />
                </linearGradient>
                <filter id="doc-shadow">
                    <feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
                </filter>
            </defs>
            <path d="M 16 8 L 38 8 L 48 18 L 48 56 C 48 57.5 46.5 59 45 59 L 16 59 C 14.5 59 13 57.5 13 56 L 13 11 C 13 9.5 14.5 8 16 8 Z" fill="url(#doc-bg)" filter="url(#doc-shadow)" stroke="#ccc" stroke-width="1.5" />
            <!-- Fold -->
            <path d="M 38 8 L 38 18 L 48 18 Z" fill="url(#doc-fold)" stroke="#ccc" stroke-width="1" stroke-linejoin="round" />
            <!-- Lines -->
            <line x1="22" y1="28" x2="38" y2="28" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" />
            <line x1="22" y1="36" x2="40" y2="36" stroke="#a0a0a0" stroke-width="2" stroke-linecap="round" />
            <line x1="22" y1="44" x2="40" y2="44" stroke="#a0a0a0" stroke-width="2" stroke-linecap="round" />
            <line x1="22" y1="52" x2="34" y2="52" stroke="#a0a0a0" stroke-width="2" stroke-linecap="round" />
        </svg>`,
        
        'contact': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="phone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#4ade80" />
                    <stop offset="100%" stop-color="#16a34a" />
                </linearGradient>
                <filter id="phone-shadow"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/></filter>
                <filter id="icon-shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.2)"/></filter>
            </defs>
            <g transform="translate(4.8, 4.8) scale(0.85)">
                <circle cx="32" cy="32" r="26" fill="url(#phone-grad)" filter="url(#phone-shadow)" stroke="#15803d" stroke-width="1.5" />
                
                <!-- Clean telephone receiver -->
                <path d="M 44.4 36.2 C 42.7 34.5 40.8 34.5 39.1 36.2 L 36.7 38.6 C 30.9 36.1 26.2 31.4 23.6 25.5 L 26.0 23.1 C 27.7 21.4 27.7 19.5 26.0 17.8 L 22.3 14.1 C 20.6 12.4 18.7 12.4 17.0 14.1 L 14.5 16.6 C 13.5 17.8 13.0 19.4 13.2 21.0 C 14.4 28.5 18.6 35.7 24.3 41.4 C 30.0 47.1 37.1 51.3 44.7 52.4 C 46.3 52.7 47.8 52.1 48.9 51.1 L 51.4 48.6 C 53.1 46.9 53.1 45.0 51.4 43.3 L 44.4 36.2 Z" fill="#ffffff" filter="url(#icon-shadow)" />
            </g>
        </svg>`,
        
        'github': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="git-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#4a4a4a" />
                    <stop offset="100%" stop-color="#141414" />
                </linearGradient>
                <filter id="git-shadow"><feDropShadow dx="1" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/></filter>
            </defs>
            <circle cx="32" cy="32" r="26" fill="url(#git-bg)" filter="url(#git-shadow)" stroke="#555" stroke-width="1" />
            <path d="M32 12C20.95 12 12 20.95 12 32c0 8.84 5.73 16.34 13.68 18.99.99.19 1.37-.44 1.37-.97v-3.41c-5.56 1.21-6.74-2.68-6.74-2.68-.91-2.31-2.23-2.92-2.23-2.92-1.82-1.25.13-1.23.13-1.23 2.02.15 3.09 2.08 3.09 2.08 1.79 3.08 4.7 2.19 5.85 1.67.18-1.3.7-2.19 1.28-2.69-4.44-.5-9.11-2.22-9.11-9.87 0-2.18.78-3.96 2.06-5.36-.21-.5-.89-2.54.19-5.28 0 0 1.68-.54 5.5 2.05A19.1 19.1 0 0132 23.05c1.7.01 3.42.23 5.01.68 3.81-2.59 5.49-2.05 5.49-2.05 1.09 2.74.41 4.78.2 5.28 1.28 1.4 2.06 3.18 2.06 5.36 0 7.67-4.68 9.36-9.14 9.85.72.62 1.36 1.84 1.36 3.71v5.51c0 .54.36 1.17 1.38.97C46.28 48.33 52 40.83 52 32 52 20.95 43.05 12 32 12z" fill="#fff" />
        </svg>`,
        
        'recycle': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="bin-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#b6cbe0" />
                    <stop offset="50%" stop-color="#e6f0fa" />
                    <stop offset="100%" stop-color="#a4b9cf" />
                </linearGradient>
                <linearGradient id="lid" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f5f8fa" />
                    <stop offset="100%" stop-color="#93a8c0" />
                </linearGradient>
                <filter id="bin-shadow"><feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/></filter>
            </defs>
            <!-- Body -->
            <path d="M 18 24 L 46 24 L 42 54 L 22 54 Z" fill="url(#bin-gradient)" filter="url(#bin-shadow)" stroke="#748b9f" stroke-width="1.5" />
            <!-- Lid -->
            <ellipse cx="32" cy="24" rx="16" ry="4" fill="url(#lid)" stroke="#748b9f" stroke-width="1.5" />
            <!-- Vertical Lines -->
            <line x1="24" y1="30" x2="26" y2="50" stroke="#8ca3ba" stroke-width="1.5" stroke-linecap="round" />
            <line x1="32" y1="30" x2="32" y2="50" stroke="#8ca3ba" stroke-width="1.5" stroke-linecap="round" />
            <line x1="40" y1="30" x2="38" y2="50" stroke="#8ca3ba" stroke-width="1.5" stroke-linecap="round" />
            <!-- Recycling symbol outline (simplified) -->
            <path d="M 26 38 L 30 32 L 34 38 Z" fill="none" stroke="#68ae5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`,
        
        'skills': `<svg ${xmlns} viewBox="0 0 64 64">
            <!-- Background base -->
            <rect x="8" y="10" width="48" height="44" rx="4" fill="#ffffff" stroke="#c0c0c0" stroke-width="2" />
            <!-- Colorful left accent bar -->
            <rect x="8" y="10" width="10" height="44" rx="4" fill="#ff7f50" />
            <!-- Graph bars -->
            <rect x="24" y="38" width="6" height="10" fill="#4caf50" rx="1" />
            <rect x="34" y="28" width="6" height="20" fill="#2196f3" rx="1" />
            <rect x="44" y="20" width="6" height="28" fill="#9c27b0" rx="1" />
            <!-- Base line -->
            <line x1="22" y1="48" x2="52" y2="48" stroke="#888" stroke-width="2" stroke-linecap="round" />
            <!-- Sparkle/Star -->
            <path d="M48 8 L50 12 L54 14 L50 16 L48 20 L46 16 L42 14 L46 12 Z" fill="#ffca28"/>
        </svg>`,

        'calculator': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="calc-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f5f8fc" />
                    <stop offset="100%" stop-color="#c3cfdd" />
                </linearGradient>
                <linearGradient id="calc-screen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#d8f0cc" />
                    <stop offset="100%" stop-color="#a6c79a" />
                </linearGradient>
                <linearGradient id="calc-accent" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#4b93da" />
                    <stop offset="100%" stop-color="#2c6fb2" />
                </linearGradient>
            </defs>
            <rect x="12" y="5" width="40" height="54" rx="5" fill="url(#calc-body)" stroke="#6c7787" stroke-width="1.6" />
            <rect x="17" y="11" width="30" height="12" rx="2" fill="url(#calc-screen)" stroke="#7f9973" stroke-width="1" />
            <rect x="20" y="15" width="24" height="4" rx="1" fill="#3d5d31" opacity="0.75" />
            <g fill="#eef3f8" stroke="#8192a8" stroke-width="0.7">
                <rect x="17" y="28" width="8" height="7" rx="1.4" />
                <rect x="28" y="28" width="8" height="7" rx="1.4" />
                <rect x="39" y="28" width="8" height="7" rx="1.4" />
                <rect x="17" y="38" width="8" height="7" rx="1.4" />
                <rect x="28" y="38" width="8" height="7" rx="1.4" />
                <rect x="39" y="38" width="8" height="7" rx="1.4" />
                <rect x="17" y="48" width="8" height="7" rx="1.4" />
                <rect x="28" y="48" width="8" height="7" rx="1.4" />
            </g>
            <rect x="39" y="48" width="8" height="7" rx="1.4" fill="url(#calc-accent)" stroke="#1f5f9d" stroke-width="0.8" />
        </svg>`,

        'notepad': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="pad-cover" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f6fbff" />
                    <stop offset="100%" stop-color="#d9e7f6" />
                </linearGradient>
                <linearGradient id="pad-top" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#74b1f0" />
                    <stop offset="100%" stop-color="#3d83ca" />
                </linearGradient>
            </defs>
            <rect x="10" y="8" width="44" height="50" rx="4" fill="url(#pad-cover)" stroke="#7e9ebf" stroke-width="1.6" />
            <rect x="10" y="8" width="44" height="10" rx="4" fill="url(#pad-top)" />
            <g fill="#f0f7ff" stroke="#2d6fae" stroke-width="0.8">
                <circle cx="18" cy="13" r="1.6" />
                <circle cx="26" cy="13" r="1.6" />
                <circle cx="34" cy="13" r="1.6" />
                <circle cx="42" cy="13" r="1.6" />
            </g>
            <line x1="18" y1="24" x2="46" y2="24" stroke="#9db6d1" stroke-width="1.3" />
            <line x1="18" y1="30" x2="46" y2="30" stroke="#9db6d1" stroke-width="1.3" />
            <line x1="18" y1="36" x2="46" y2="36" stroke="#9db6d1" stroke-width="1.3" />
            <line x1="18" y1="42" x2="46" y2="42" stroke="#9db6d1" stroke-width="1.3" />
            <line x1="18" y1="48" x2="38" y2="48" stroke="#9db6d1" stroke-width="1.3" />
        </svg>`,

        'paint': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="palette" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#d4aa70" />
                    <stop offset="100%" stop-color="#996c33" />
                </linearGradient>
                <filter id="paint-shadow"><feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/></filter>
            </defs>
            <path d="M 32 10 C 18 10 10 24 14 38 C 16 46 24 54 36 54 C 52 54 60 40 54 24 C 48 10 40 10 32 10 Z" fill="url(#palette)" filter="url(#paint-shadow)" stroke="#8b5a2b" stroke-width="1.5" />
            <circle cx="22" cy="26" r="4" fill="#ffffff" /> <!-- Thumb hole -->
            <circle cx="32" cy="20" r="4.5" fill="#e74c3c" />
            <circle cx="42" cy="26" r="4" fill="#3498db" />
            <circle cx="44" cy="38" r="4.5" fill="#f1c40f" />
            <circle cx="34" cy="44" r="4" fill="#2ecc71" />
            <!-- Paintbrush -->
            <path d="M 12 52 L 24 40 Z" stroke="#bdc3c7" stroke-width="4" stroke-linecap="round" filter="url(#paint-shadow)" />
            <path d="M 22 42 L 30 34" stroke="#e67e22" stroke-width="3" stroke-linecap="round" />
            <path d="M 28 36 L 36 28 C 36 28 40 32 38 34 L 30 42 Z" fill="#ffe0b2" stroke="#d35400" stroke-width="1" />
            <path d="M 36 28 C 34 24 38 22 40 20 C 44 26 42 30 38 34 C 40 32 38 28 36 28 Z" fill="#c0392b" />
        </svg>`,

        'taskmanager': `<svg ${xmlns} viewBox="0 0 64 64">
            <defs>
                <linearGradient id="tm-monitor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f0f0f0" />
                    <stop offset="100%" stop-color="#a0a0a0" />
                </linearGradient>
                <linearGradient id="tm-screen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#111111" />
                    <stop offset="100%" stop-color="#333333" />
                </linearGradient>
            </defs>
            <rect x="6" y="12" width="52" height="36" rx="3" fill="url(#tm-monitor)" stroke="#555" stroke-width="2" />
            <rect x="10" y="16" width="44" height="28" fill="url(#tm-screen)" stroke="#000" stroke-width="1" />
            <path d="M 24 48 L 40 48 L 42 56 L 22 56 Z" fill="#888" />
            <!-- Graph in screen -->
            <path d="M 10 44 L 14 36 L 20 40 L 26 24 L 32 32 L 38 20 L 44 28 L 50 16 L 54 44 Z" fill="rgba(50,205,50,0.3)" stroke="#32cd32" stroke-width="1.5" />
            <line x1="10" y1="36" x2="54" y2="36" stroke="#226622" stroke-width="0.5" />
            <line x1="10" y1="26" x2="54" y2="26" stroke="#226622" stroke-width="0.5" />
            <rect x="8" y="4" width="24" height="6" fill="#e0e0e0" stroke="#777" stroke-width="1" />
            <circle cx="12" cy="7" r="1.5" fill="#e74c3c" />
            <circle cx="16" cy="7" r="1.5" fill="#f1c40f" />
            <circle cx="20" cy="7" r="1.5" fill="#2ecc71" />
        </svg>`
    };
    return `data:image/svg+xml,${encodeURIComponent(icons[type] || icons['folder'])}`;
}

const APPS = {
    'computer': { title: 'My Computer', icon: 'computer', type: 'iframe', url: 'computer.html', width: 700, height: 480 },
    'projects': { title: 'Projects', icon: 'folder', type: 'iframe', url: 'projects.html' },
    'private-projects': { title: 'Private Projects', icon: 'private_folder', type: 'iframe', url: 'private-projects.html' },
    'resume': { title: 'Resume', icon: 'document', type: 'iframe', url: 'resume.html' },
    'skills': { title: 'Skills', icon: 'skills', type: 'iframe', url: 'skills.html', width: 500, height: 600 },
    'terminal': { title: 'Terminal', icon: 'terminal', type: 'iframe', url: 'terminal.html', width: 600, height: 400 },
    'calculator': { title: 'Calculator', icon: 'calculator', type: 'iframe', url: 'calculator.html', width: 360, height: 580 },
    'notepad': { title: 'Notepad', icon: 'notepad', type: 'iframe', url: 'notepad.html', width: 760, height: 520 },
    'paint': { title: 'Paint', icon: 'paint', type: 'iframe', url: 'paint.html', width: 640, height: 480 },
    'taskmanager': { title: 'Task Manager', icon: 'taskmanager', type: 'iframe', url: 'taskmanager.html', width: 650, height: 550 },
    'about': { title: 'About RishavOS', icon: 'computer', width: 450, height: 420, type: 'iframe', url: 'about.html' },
    'github': { title: 'GitHub', icon: 'github', type: 'link', url: 'https://github.com/dev-mahir-ahmed' },
    'contact': { title: 'Contact', icon: 'contact', type: 'iframe', url: 'contact.html' },
    'recycle': { title: 'Recycle Bin', icon: 'recycle', type: 'iframe', url: 'recycle.html', width: 600, height: 420 }
};

// Global State
const SystemState = {
    isBooting: true,
    startMenuOpen: false,
    isShuttingDown: false
};

const WALLPAPER_URL = 'https://res.cloudinary.com/db1tiugho/image/upload/f_avif,q_70,w_1200/windows_jlalyc.jpg';
const PROFILE_PIC_URL = 'img/Mahir.jpg';
let appWarmupScheduled = false;

// Preload and manage wallpaper caching
function initializeWallpaper() {
    const desktopEl = document.getElementById('desktop-environment');
    let cachedBackground = null;
    try {
        cachedBackground = localStorage.getItem('win7_wallpaper');
    } catch (e) { console.warn("localStorage disabled", e); }
    
    if (cachedBackground) {
        desktopEl.style.backgroundImage = `url(${cachedBackground})`;
    } else {
        fetch(WALLPAPER_URL)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    try { localStorage.setItem('win7_wallpaper', base64data); } catch(e) {}
                    desktopEl.style.backgroundImage = `url(${base64data})`;
                }
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.error("Failed to fetch wallpaper:", err);
                desktopEl.style.backgroundImage = `url('${WALLPAPER_URL}')`;
            });
    }
}

// Preload and manage profile picture caching for start menu
function initializeProfilePic() {
    // Also save in localStorage so iframes like resume.html can easily access it
    let cachedProfile = null;
    try {
        cachedProfile = localStorage.getItem('win7_profile');
    } catch (e) { }
    
    const setProfileSrc = (src) => {
        const startMenuAvatar = document.querySelector('.user-avatar');
        if (startMenuAvatar) startMenuAvatar.src = src;
    };

    if (cachedProfile) {
        setProfileSrc(cachedProfile);
    } else {
        fetch(PROFILE_PIC_URL)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    try { localStorage.setItem('win7_profile', base64data); } catch(e) {}
                    setProfileSrc(base64data);
                }
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                console.error("Failed to fetch profile pic:", err);
                setProfileSrc(PROFILE_PIC_URL);
            });
    }
}

function warmHostedAppCache() {
    // Warm iframe app pages only when running over HTTP(S).
    if (!/^https?:$/.test(window.location.protocol)) return;
    if (navigator.connection && navigator.connection.saveData) return;

    const appUrls = [...new Set(
        Object.values(APPS)
            .filter(app => app.type === 'iframe' && app.url)
            .map(app => app.url)
    )];
    const warmUrls = ['css/apps.css', ...appUrls];

    appUrls.forEach((url) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'document';
        link.href = url;
        document.head.appendChild(link);
    });

    const styleLink = document.createElement('link');
    styleLink.rel = 'prefetch';
    styleLink.as = 'style';
    styleLink.href = 'css/apps.css';
    document.head.appendChild(styleLink);

    warmUrls.forEach((url) => {
        fetch(url, { cache: 'force-cache', credentials: 'same-origin' }).catch(() => {});
    });
}

function scheduleAppWarmup() {
    if (appWarmupScheduled) return;
    appWarmupScheduled = true;

    const runWarmup = () => {
        setTimeout(warmHostedAppCache, 500);
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(runWarmup, { timeout: 1500 });
    } else {
        setTimeout(runWarmup, 900);
    }
}

// System Functions
document.addEventListener('DOMContentLoaded', () => {
    initializeWallpaper();
    initializeProfilePic();
    
    // Boot Sequence (Straight to Login)
    const loginScreen = document.getElementById('login-screen');
    const desktopEnv = document.getElementById('desktop-environment');
    const startupAudio = document.getElementById('audio-startup');
    const shutdownAudio = document.getElementById('audio-shutdown');
    const restartAudio = document.getElementById('audio-restart');
    const loginBtn = document.getElementById('btn-login');
    const loginNameEl = document.getElementById('login-selected-user');
    const loginUserItems = Array.from(document.querySelectorAll('.login-bottom-left .w11-user-list-item'));
    const loginActionToast = document.getElementById('login-action-toast');
    const accessibilityToggleBtn = document.querySelector('.lock-icon-btn[data-action="accessibility"]');
    const themeToggleBtn = document.querySelector('.lock-icon-btn[data-action="theme"]');
    const restartLoginBtn = document.querySelector('.lock-icon-btn[data-action="restart"]');
    const lockTimeEl = document.getElementById('lock-time');
    const lockDateEl = document.getElementById('lock-date');
    const shutdownScreenEl = document.getElementById('shutdown-screen');
    const shutdownScreenLabelEl = shutdownScreenEl ? shutdownScreenEl.querySelector('h1') : null;
    let shutdownAudioPrimed = false;
    let lockClockIntervalId = null;
    let loginToastTimeoutId = null;
    let skipNextLoginAppear = false;

    try {
        skipNextLoginAppear = sessionStorage.getItem('skipLoginAppearOnce') === '1';
        if (skipNextLoginAppear) {
            sessionStorage.removeItem('skipLoginAppearOnce');
        }
    } catch (_) {
        skipNextLoginAppear = false;
    }

    if (startupAudio) startupAudio.preload = 'auto';
    if (shutdownAudio) {
        shutdownAudio.preload = 'auto';
        shutdownAudio.load();
    }
    if (restartAudio) {
        restartAudio.preload = 'auto';
        restartAudio.load();
    }

    const primeShutdownAudio = () => {
        if (!shutdownAudio || shutdownAudioPrimed) return;
        shutdownAudioPrimed = true;
        shutdownAudio.volume = 0;
        shutdownAudio.play()
            .then(() => {
                shutdownAudio.pause();
                shutdownAudio.currentTime = 0;
                shutdownAudio.volume = 0.5;
            })
            .catch(() => {
                shutdownAudio.volume = 0.5;
                shutdownAudio.load();
            });
    };

    const revealLoginScreen = () => {
        if (!loginScreen) return;
        loginScreen.classList.remove('hidden');
        loginScreen.style.display = 'flex';
        loginScreen.classList.remove('login-appear');
        if (skipNextLoginAppear) {
            skipNextLoginAppear = false;
            return;
        }
        // Force reflow so repeated calls restart the fade-in animation.
        void loginScreen.offsetWidth;
        loginScreen.classList.add('login-appear');
    };
    window.showLoginScreenWithFade = revealLoginScreen;

    const revealDesktopWithFade = () => {
        if (!desktopEnv) return;
        desktopEnv.style.display = 'flex';
        desktopEnv.classList.add('fade-in-start');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                desktopEnv.classList.remove('fade-in-start');
            });
        });
    };

    const updateLockClock = () => {
        const now = new Date();
        if (lockTimeEl) {
            lockTimeEl.textContent = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        if (lockDateEl) {
            lockDateEl.textContent = now.toLocaleDateString([], {
                weekday: 'long',
                month: 'long',
                day: '2-digit'
            });
        }
    };

    if (lockTimeEl || lockDateEl) {
        updateLockClock();
        lockClockIntervalId = setInterval(updateLockClock, 1000);
    }
    revealLoginScreen();

    const setSelectedLoginUser = (targetItem) => {
        if (!targetItem) return;
        loginUserItems.forEach((item) => {
            const isActive = item === targetItem;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        if (loginNameEl) {
            loginNameEl.textContent = targetItem.dataset.user || targetItem.innerText.trim();
        }
    };

    loginUserItems.forEach((item) => {
        item.addEventListener('click', () => setSelectedLoginUser(item));
        item.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            event.stopPropagation();
            setSelectedLoginUser(item);
        });
    });
    setSelectedLoginUser(loginUserItems.find((item) => item.classList.contains('active')) || loginUserItems[0]);

    const showLoginActionToast = (message) => {
        if (!loginActionToast) return;
        loginActionToast.textContent = message;
        loginActionToast.classList.add('show');
        if (loginToastTimeoutId !== null) {
            clearTimeout(loginToastTimeoutId);
        }
        loginToastTimeoutId = setTimeout(() => {
            loginActionToast.classList.remove('show');
            loginToastTimeoutId = null;
        }, 1100);
    };

    if (accessibilityToggleBtn && loginScreen) {
        accessibilityToggleBtn.addEventListener('click', () => {
            const enabled = loginScreen.classList.toggle('login-a11y-mode');
            accessibilityToggleBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
            showLoginActionToast(enabled ? 'Accessibility mode on' : 'Accessibility mode off');
        });
    }

    if (themeToggleBtn && loginScreen) {
        themeToggleBtn.addEventListener('click', () => {
            const enabled = loginScreen.classList.toggle('login-alt-theme');
            themeToggleBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
            showLoginActionToast(enabled ? 'Background style: warm' : 'Background style: default');
        });
    }

    if (restartLoginBtn) {
        restartLoginBtn.addEventListener('click', () => {
            try {
                sessionStorage.setItem('skipLoginAppearOnce', '1');
            } catch (_) {}
            if (restartAudio) {
                restartAudio.pause();
                restartAudio.currentTime = 0;
                restartAudio.volume = 0.5;
                restartAudio.play().catch(() => {});
            }
            if (shutdownScreenEl) {
                if (loginActionToast) loginActionToast.classList.remove('show');
                if (shutdownScreenLabelEl) shutdownScreenLabelEl.textContent = 'Restarting...';
                shutdownScreenEl.style.display = 'flex';
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showLoginActionToast('Restarting...');
                setTimeout(() => window.location.reload(), 260);
            }
        });
    }

    const handleLoginHotkey = (event) => {
        if (event.key !== 'Enter') return;
        if (event.target && event.target.closest && (event.target.closest('.login-bottom-left') || event.target.closest('.login-bottom-right'))) return;
        if (!loginScreen || loginScreen.style.display === 'none' || !loginBtn) return;
        event.preventDefault();
        loginBtn.click();
    };
    document.addEventListener('keydown', handleLoginHotkey);

    if (loginBtn && loginScreen) {
        loginBtn.addEventListener('click', () => {
            // Play startup sound
            if (startupAudio) {
                startupAudio.volume = 0.5;
                startupAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
            }
            primeShutdownAudio();

            if (lockClockIntervalId !== null) {
                clearInterval(lockClockIntervalId);
                lockClockIntervalId = null;
            }

            // Fade out login first, then bring desktop in smoothly.
            loginScreen.classList.remove('login-appear');
            // Ensure we transition from steady state (opacity: 1) before hiding.
            void loginScreen.offsetWidth;
            loginScreen.classList.add('hidden');
            setTimeout(() => {
                revealDesktopWithFade();
            }, 540);

            setTimeout(() => {
                document.removeEventListener('keydown', handleLoginHotkey);
                loginScreen.style.display = 'none';
                SystemState.isBooting = false;
                scheduleAppWarmup();
            }, 1000);
        });
    } else {
        // Fallback if login screen is missing
        revealDesktopWithFade();
        SystemState.isBooting = false;
        scheduleAppWarmup();
    }

    // Global Click Handler (close start menu)
    document.addEventListener('click', (e) => {
        if (SystemState.startMenuOpen && 
            !e.target.closest('#start-menu') && 
            !e.target.closest('#start-button')) {
            TaskBar.toggleStartMenu(false);
        }
        
        // Deselect icons
        if (!e.target.closest('.desktop-icon')) {
            document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
        }
    });
});

// ── Source Code Inspect Block js code ────────

document.addEventListener('contextmenu', event => event.preventDefault());
            document.onkeydown = function(e) {
            if (e.keyCode == 123 || (e.ctrlKey && e.key == 'u') || (e.ctrlKey && e.shiftKey && e.key == 'I')) {
                return false;
              }
            }