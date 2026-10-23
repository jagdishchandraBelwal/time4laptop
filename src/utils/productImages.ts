// High-fidelity SVG-based device illustration generator
// Guarantees 100% reliable rendering with zero external image host dependency or broken links

export function getProductPlaceholder(category: string, name: string, brand: string, color = '#6D28D9'): string {
  const cleanName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cleanBrand = brand.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  let deviceSvg = '';

  switch (category) {
    case 'laptops':
      deviceSvg = `
        <!-- Laptop Screen -->
        <rect x="70" y="45" width="260" height="155" rx="10" fill="#0F172A" stroke="#334155" stroke-width="4"/>
        <rect x="80" y="55" width="240" height="135" rx="4" fill="url(#screenGrad)"/>
        <!-- Screen Content Mockup -->
        <path d="M100 130 Q 150 90, 200 120 T 300 100" fill="none" stroke="#A855F7" stroke-width="3" opacity="0.8"/>
        <circle cx="200" cy="110" r="18" fill="#7C3AED" opacity="0.3"/>
        <text x="200" y="114" fill="#FFFFFF" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">${cleanBrand}</text>
        <!-- Laptop Hinge & Base -->
        <rect x="180" y="200" width="40" height="6" fill="#475569" rx="2"/>
        <path d="M40 206 L 360 206 L 330 230 L 70 230 Z" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="160" y="212" width="80" height="14" rx="3" fill="#CBD5E1"/>
      `;
      break;

    case 'mobiles':
      deviceSvg = `
        <!-- Phone Body -->
        <rect x="135" y="30" width="130" height="230" rx="28" fill="#0F172A" stroke="#475569" stroke-width="4"/>
        <rect x="142" y="36" width="116" height="218" rx="22" fill="url(#screenGrad)"/>
        <!-- Dynamic Island / Punch Hole -->
        <rect x="180" y="44" width="40" height="10" rx="5" fill="#000000"/>
        <!-- Screen details -->
        <circle cx="200" cy="130" r="32" fill="#7C3AED" opacity="0.4"/>
        <text x="200" y="135" fill="#FFFFFF" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">5G</text>
        <rect x="160" y="180" width="80" height="6" rx="3" fill="#FFFFFF" opacity="0.5"/>
        <rect x="175" y="195" width="50" height="4" rx="2" fill="#A855F7" opacity="0.7"/>
      `;
      break;

    case 'gaming':
      deviceSvg = `
        <!-- Gaming Rig Tower -->
        <rect x="110" y="30" width="180" height="230" rx="8" fill="#090D16" stroke="#581C87" stroke-width="4"/>
        <!-- Glass Side Panel with RGB -->
        <rect x="120" y="40" width="160" height="170" rx="4" fill="#0F172A" opacity="0.95"/>
        <circle cx="160" cy="85" r="28" fill="none" stroke="#C084FC" stroke-width="4" stroke-dasharray="140" opacity="0.9"/>
        <circle cx="235" cy="85" r="28" fill="none" stroke="#9333EA" stroke-width="4" stroke-dasharray="140" opacity="0.9"/>
        <rect x="135" y="130" width="130" height="40" rx="6" fill="#1E1B4B" stroke="#7E22CE" stroke-width="2"/>
        <text x="200" y="155" fill="#E9D5FF" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">RTX OC EDITION</text>
        <rect x="120" y="218" width="160" height="30" rx="3" fill="#1E293B"/>
        <circle cx="260" cy="233" r="4" fill="#A855F7"/>
      `;
      break;

    case 'ps5':
      deviceSvg = `
        <!-- PS5 Console Silhouette -->
        <path d="M150 30 Q 185 20, 205 30 L 225 240 Q 185 250, 150 240 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
        <!-- Black Center Core -->
        <path d="M165 35 Q 185 30, 195 35 L 210 235 Q 185 240, 165 235 Z" fill="#0F172A"/>
        <!-- Blue / Purple LED Glow -->
        <path d="M163 45 L 168 225" stroke="#7C3AED" stroke-width="3" opacity="0.9"/>
        <path d="M197 45 L 202 225" stroke="#60A5FA" stroke-width="2" opacity="0.8"/>
        <!-- Stand Base -->
        <ellipse cx="185" cy="246" rx="45" ry="12" fill="#0F172A" stroke="#334155" stroke-width="2"/>
        <!-- Logo Stamp -->
        <text x="185" y="140" fill="#A855F7" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">TIME4LAPTOP.COM</text>
      `;
      break;

    case 'monitors':
      deviceSvg = `
        <!-- Curved / Flat Monitor Display -->
        <rect x="60" y="40" width="280" height="165" rx="8" fill="#0F172A" stroke="#334155" stroke-width="4"/>
        <rect x="68" y="48" width="264" height="149" rx="4" fill="url(#screenGrad)"/>
        <!-- Display Visual Wave -->
        <path d="M80 140 C 140 100, 200 170, 320 90" fill="none" stroke="#C084FC" stroke-width="3"/>
        <text x="200" y="105" fill="#FFFFFF" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">4K UHD · 165Hz</text>
        <!-- Stand Stem & Base -->
        <rect x="190" y="205" width="20" height="35" fill="#475569"/>
        <polygon points="140,245 260,245 250,252 150,252" fill="#334155"/>
      `;
      break;

    case 'keyboards':
      deviceSvg = `
        <!-- Mechanical Keyboard Body -->
        <rect x="60" y="85" width="280" height="110" rx="8" fill="#1E1B4B" stroke="#4C1D95" stroke-width="3"/>
        <!-- Keycaps matrix -->
        <g fill="#312E81" stroke="#4338CA" stroke-width="1">
          <rect x="75" y="98" width="22" height="18" rx="3"/>
          <rect x="102" y="98" width="22" height="18" rx="3"/>
          <rect x="129" y="98" width="22" height="18" rx="3"/>
          <rect x="156" y="98" width="22" height="18" rx="3"/>
          <rect x="183" y="98" width="22" height="18" rx="3"/>
          <rect x="210" y="98" width="22" height="18" rx="3"/>
          <rect x="237" y="98" width="22" height="18" rx="3"/>
          <rect x="264" y="98" width="22" height="18" rx="3"/>
          <rect x="291" y="98" width="35" height="18" rx="3" fill="#7C3AED"/>
          
          <rect x="75" y="122" width="28" height="18" rx="3"/>
          <rect x="108" y="122" width="22" height="18" rx="3"/>
          <rect x="135" y="122" width="22" height="18" rx="3"/>
          <rect x="162" y="122" width="22" height="18" rx="3" fill="#A855F7"/>
          <rect x="189" y="122" width="22" height="18" rx="3"/>
          <rect x="216" y="122" width="22" height="18" rx="3"/>
          <rect x="243" y="122" width="22" height="18" rx="3"/>
          <rect x="270" y="122" width="56" height="18" rx="3"/>

          <rect x="75" y="146" width="34" height="18" rx="3"/>
          <rect x="114" y="146" width="22" height="18" rx="3"/>
          <rect x="141" y="146" width="105" height="18" rx="3" fill="#6D28D9"/>
          <rect x="251" y="146" width="22" height="18" rx="3"/>
          <rect x="278" y="146" width="48" height="18" rx="3"/>
        </g>
      `;
      break;

    case 'mouse':
      deviceSvg = `
        <!-- Mouse Body -->
        <ellipse cx="200" cy="140" rx="60" ry="85" fill="#1E293B" stroke="#6D28D9" stroke-width="3"/>
        <!-- Mouse Split & Wheel -->
        <path d="M200 55 L 200 120" stroke="#475569" stroke-width="2"/>
        <rect x="194" y="75" width="12" height="24" rx="4" fill="#A855F7"/>
        <path d="M150 120 Q 200 135, 250 120" stroke="#334155" stroke-width="2" fill="none"/>
        <circle cx="200" cy="175" r="8" fill="#7C3AED" opacity="0.6"/>
      `;
      break;

    case 'headphones':
      deviceSvg = `
        <!-- Headband Arc -->
        <path d="M120 160 A 85 85 0 0 1 280 160" fill="none" stroke="#334155" stroke-width="12" stroke-linecap="round"/>
        <path d="M135 130 A 70 70 0 0 1 265 130" fill="none" stroke="#7C3AED" stroke-width="4"/>
        <!-- Left Ear Cup -->
        <rect x="95" y="150" width="38" height="65" rx="16" fill="#1E1B4B" stroke="#6D28D9" stroke-width="3"/>
        <rect x="100" y="156" width="10" height="52" rx="5" fill="#A855F7"/>
        <!-- Right Ear Cup -->
        <rect x="267" y="150" width="38" height="65" rx="16" fill="#1E1B4B" stroke="#6D28D9" stroke-width="3"/>
        <rect x="290" y="156" width="10" height="52" rx="5" fill="#A855F7"/>
      `;
      break;

    case 'storage':
      deviceSvg = `
        <!-- NVMe M.2 SSD / External Rugged SSD -->
        <rect x="110" y="70" width="180" height="130" rx="12" fill="#0F172A" stroke="#7C3AED" stroke-width="3"/>
        <rect x="125" y="85" width="150" height="75" rx="6" fill="#1E293B"/>
        <text x="200" y="115" fill="#FFFFFF" font-size="14" font-family="sans-serif" font-weight="bold" text-anchor="middle">GEN 4 NVMe</text>
        <text x="200" y="135" fill="#A855F7" font-size="12" font-family="sans-serif" font-weight="600" text-anchor="middle">7450 MB/s · 2TB</text>
        <!-- Gold Connector Pins -->
        <g fill="#F59E0B">
          <rect x="145" y="180" width="4" height="12"/>
          <rect x="155" y="180" width="4" height="12"/>
          <rect x="165" y="180" width="4" height="12"/>
          <rect x="175" y="180" width="4" height="12"/>
          <rect x="195" y="180" width="4" height="12"/>
          <rect x="205" y="180" width="4" height="12"/>
          <rect x="215" y="180" width="4" height="12"/>
          <rect x="225" y="180" width="4" height="12"/>
          <rect x="235" y="180" width="4" height="12"/>
          <rect x="245" y="180" width="4" height="12"/>
        </g>
      `;
      break;

    case 'printers':
      deviceSvg = `
        <!-- Smart InkTank Printer -->
        <rect x="80" y="90" width="240" height="110" rx="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="3"/>
        <!-- Scanner Top Lid -->
        <rect x="85" y="75" width="230" height="18" rx="4" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="2"/>
        <!-- Paper Output Tray -->
        <rect x="110" y="150" width="180" height="35" rx="4" fill="#0F172A"/>
        <rect x="130" y="160" width="140" height="18" rx="2" fill="#FFFFFF"/>
        <!-- Ink Tank Level Windows -->
        <circle cx="285" cy="120" r="5" fill="#0284C7"/>
        <circle cx="285" cy="135" r="5" fill="#DB2777"/>
        <circle cx="285" cy="150" r="5" fill="#EAB308"/>
        <circle cx="285" cy="165" r="5" fill="#0F172A"/>
      `;
      break;

    case 'networking':
      deviceSvg = `
        <!-- Wi-Fi 6/7 Router with Antennas -->
        <!-- Antennas -->
        <line x1="100" y1="50" x2="110" y2="130" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <line x1="160" y1="40" x2="165" y2="130" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <line x1="240" y1="40" x2="235" y2="130" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <line x1="300" y1="50" x2="290" y2="130" stroke="#334155" stroke-width="6" stroke-linecap="round"/>
        <!-- Router Body -->
        <polygon points="90,130 310,130 330,195 70,195" fill="#0F172A" stroke="#7C3AED" stroke-width="2"/>
        <!-- Signal Waves -->
        <circle cx="200" cy="170" r="4" fill="#A855F7"/>
        <path d="M190 162 Q 200 156, 210 162" fill="none" stroke="#C084FC" stroke-width="2"/>
        <path d="M182 154 Q 200 144, 218 154" fill="none" stroke="#E9D5FF" stroke-width="2"/>
      `;
      break;

    default:
      // Chargers, Adapters, Cables, General Accessories
      deviceSvg = `
        <!-- GaN Fast Charger Block -->
        <rect x="130" y="80" width="140" height="130" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
        <rect x="150" y="105" width="100" height="40" rx="8" fill="#F1F5F9"/>
        <text x="200" y="130" fill="#7C3AED" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">100W GaN</text>
        <!-- Type-C Ports -->
        <rect x="160" y="165" width="24" height="8" rx="4" fill="#0F172A"/>
        <rect x="195" y="165" width="24" height="8" rx="4" fill="#0F172A"/>
        <rect x="230" y="165" width="20" height="10" rx="3" fill="#D97706"/>
      `;
      break;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FAF5FF" />
          <stop offset="50%" stop-color="#F8FAFC" />
          <stop offset="100%" stop-color="#F1F5F9" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E1B4B" />
          <stop offset="50%" stop-color="#2E1065" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>
      
      <!-- Card Backdrop -->
      <rect width="400" height="280" fill="url(#bgGrad)"/>
      <circle cx="340" cy="50" r="100" fill="#F3E8FF" opacity="0.6"/>
      <circle cx="60" cy="230" r="80" fill="#EDE9FE" opacity="0.5"/>
      
      <!-- Device Illustration -->
      <g>
        ${deviceSvg}
      </g>
      
      <!-- Subtle Brand Tag -->
      <text x="24" y="32" fill="#6B21A8" font-size="11" font-family="sans-serif" font-weight="700" letter-spacing="0.5">TIME4LAPTOP.COM</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
