import React from 'react';

export const EnergenWorldLogo: React.FC<{ className?: string }> = ({ className = 'w-72' }) => (
  <svg viewBox="0 0 380 155" className={className} aria-label="Logo Energen World">
    <defs>
      <linearGradient id="ribbonGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="55%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="wheatGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#451A03" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Wheat ears left & right */}
    <g stroke="#78350F" strokeWidth="3" fill="url(#wheatGrad)" filter="url(#softShadow)">
      <ellipse cx="48" cy="108" rx="14" ry="8" transform="rotate(-35 48 108)" />
      <ellipse cx="36" cy="88" rx="14" ry="8" transform="rotate(-25 36 88)" />
      <ellipse cx="30" cy="66" rx="13" ry="7" transform="rotate(-10 30 66)" />
      <ellipse cx="332" cy="108" rx="14" ry="8" transform="rotate(35 332 108)" />
      <ellipse cx="344" cy="88" rx="14" ry="8" transform="rotate(25 344 88)" />
      <ellipse cx="350" cy="66" rx="13" ry="7" transform="rotate(10 350 66)" />
    </g>

    {/* Golden Banner */}
    <g filter="url(#softShadow)">
      <path
        d="M58 26 Q190 8 322 26 L312 76 Q190 62 68 76 Z"
        fill="url(#ribbonGrad)"
        stroke="#78350F"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <text
        x="190"
        y="56"
        textAnchor="middle"
        fill="#DC2626"
        stroke="#FFFFFF"
        strokeWidth="5"
        paintOrder="stroke"
        fontFamily="Fredoka, sans-serif"
        fontWeight="700"
        fontSize="40"
        letterSpacing="2"
      >
        ENERGEN
      </text>
    </g>

    {/* WORLD Pill Plaque */}
    <g filter="url(#softShadow)">
      <rect
        x="72"
        y="74"
        width="236"
        height="62"
        rx="28"
        fill="#FFFBEB"
        stroke="#78350F"
        strokeWidth="5"
      />
      <text
        x="190"
        y="119"
        textAnchor="middle"
        fill="#5C2810"
        fontFamily="Fredoka, sans-serif"
        fontWeight="700"
        fontSize="44"
        letterSpacing="2"
      >
        WORLD
      </text>
    </g>
  </svg>
);

export const BoboBallsSvg: React.FC<{
  className?: string;
  mood?: 'happy' | 'cheer' | 'sad';
}> = ({ className = 'w-28 h-28', mood = 'happy' }) => (
  <svg viewBox="0 0 140 150" className={className} aria-label="Karakter Bobo Balls">
    <defs>
      <radialGradient id="boboGrad" cx="38%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#A65E34" />
        <stop offset="60%" stopColor="#6F3618" />
        <stop offset="100%" stopColor="#431C08" />
      </radialGradient>
    </defs>

    {/* Ground shadow */}
    <ellipse cx="70" cy="138" rx="34" ry="7" fill="rgba(0,0,0,0.22)" />

    {/* Legs & Red Sneakers */}
    <path d="M56 105 L51 124 M84 105 L89 124" stroke="#1E110A" strokeWidth="7" strokeLinecap="round" />
    <g stroke="#1E110A" strokeWidth="3.2">
      <ellipse cx="47" cy="127" rx="15" ry="9" fill="#DC2626" />
      <path d="M35 129 Q47 135 59 129" fill="#FFFFFF" stroke="none" />
      <ellipse cx="93" cy="127" rx="15" ry="9" fill="#DC2626" />
      <path d="M81 129 Q93 135 105 129" fill="#FFFFFF" stroke="none" />
    </g>

    {/* Arms + White Gloves */}
    <path
      d={mood === 'cheer' ? 'M38 72 L18 46 M102 72 L122 46' : 'M38 74 L20 82 M102 74 L122 62'}
      stroke="#1E110A"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    <circle cx={mood === 'cheer' ? 17 : 18} cy={mood === 'cheer' ? 44 : 83} r="11" fill="#FFFFFF" stroke="#1E110A" strokeWidth="3.2" />
    <circle cx={mood === 'cheer' ? 123 : 123} cy={mood === 'cheer' ? 44 : 61} r="11" fill="#FFFFFF" stroke="#1E110A" strokeWidth="3.2" />

    {/* Chocolate Sphere */}
    <circle cx="70" cy="72" r="37" fill="url(#boboGrad)" stroke="#1E110A" strokeWidth="4" />
    <circle cx="48" cy="85" r="3.5" fill="rgba(35,12,3,0.35)" />
    <circle cx="92" cy="90" r="2.8" fill="rgba(35,12,3,0.35)" />

    {/* Backwards Red Cap */}
    <path d="M35 58 A36 33 0 0 1 105 58 Z" fill="#EF4444" stroke="#1E110A" strokeWidth="3.5" />
    <ellipse cx="32" cy="54" rx="15" ry="5.5" transform="rotate(-10 32 54)" fill="#EF4444" stroke="#1E110A" strokeWidth="3.2" />
    <text x="83" y="46" fill="#FACC15" stroke="#1E110A" strokeWidth="1.2" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="16">
      B
    </text>

    {/* Eyes & Mouth */}
    {mood === 'cheer' ? (
      <>
        <path d="M49 69 Q56 61 63 69" fill="none" stroke="#1E110A" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M77 69 Q84 61 91 69" fill="none" stroke="#1E110A" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="56" cy="69" rx="8.5" ry="11" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.8" />
        <ellipse cx="57" cy="70" rx="5" ry="7" fill="#241108" />
        <circle cx="55" cy="66" r="2.3" fill="#FFFFFF" />
        <ellipse cx="84" cy="69" rx="8.5" ry="11" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.8" />
        <ellipse cx="83" cy="70" rx="5" ry="7" fill="#241108" />
        <circle cx="81" cy="66" r="2.3" fill="#FFFFFF" />
      </>
    )}

    {mood === 'sad' ? (
      <ellipse cx="70" cy="89" rx="7" ry="5" fill="#7F1D1D" stroke="#1E110A" strokeWidth="2.8" />
    ) : (
      <>
        <path d="M58 83 Q70 98 82 83 Z" fill="#7F1D1D" stroke="#1E110A" strokeWidth="2.8" />
        <ellipse cx="70" cy="89" rx="6" ry="3.2" fill="#FB7185" />
      </>
    )}
  </svg>
);

export const MalkiSvg: React.FC<{
  className?: string;
  mood?: 'happy' | 'cheer' | 'think';
}> = ({ className = 'w-28 h-28', mood = 'happy' }) => (
  <svg viewBox="0 0 140 155" className={className} aria-label="Karakter Malki">
    <defs>
      <linearGradient id="malkiGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="55%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>

    <ellipse cx="70" cy="142" rx="34" ry="7" fill="rgba(0,0,0,0.22)" />

    {/* Yellow Sneakers */}
    <path d="M55 108 L51 128 M85 108 L89 128" stroke="#1E110A" strokeWidth="7" strokeLinecap="round" />
    <g stroke="#1E110A" strokeWidth="3.2">
      <ellipse cx="47" cy="131" rx="14" ry="8.5" fill="#F59E0B" />
      <ellipse cx="93" cy="131" rx="14" ry="8.5" fill="#F59E0B" />
    </g>

    {/* Arms + Gloves */}
    <path
      d={mood === 'cheer' ? 'M34 78 L16 50 M106 78 L124 50' : 'M34 78 L16 86 M106 78 L124 68'}
      stroke="#1E110A"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    <circle cx={mood === 'cheer' ? 16 : 16} cy={mood === 'cheer' ? 48 : 88} r="10.5" fill="#FFFFFF" stroke="#1E110A" strokeWidth="3.2" />
    <circle cx={mood === 'cheer' ? 124 : 124} cy={mood === 'cheer' ? 48 : 66} r="10.5" fill="#FFFFFF" stroke="#1E110A" strokeWidth="3.2" />

    {/* Golden Biscuit Body */}
    <rect x="33" y="42" width="74" height="72" rx="14" fill="url(#malkiGrad)" stroke="#1E110A" strokeWidth="4" />

    {/* Cracker dimples */}
    {[
      [44, 52],
      [96, 52],
      [44, 102],
      [96, 102],
      [42, 77],
      [98, 77],
    ].map(([cx, cy], idx) => (
      <circle key={idx} cx={cx} cy={cy} r="2.8" fill="#B45309" />
    ))}

    {/* Yellow/White Malkist Cap */}
    <path d="M40 44 A30 26 0 0 1 100 44 Z" fill="#FACC15" stroke="#1E110A" strokeWidth="3.5" />
    <rect x="52" y="21" width="36" height="17" rx="4" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.6" />
    <text x="70" y="33" textAnchor="middle" fill="#1E110A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="9.5">
      Malkist
    </text>
    <ellipse cx="88" cy="43" rx="20" ry="5" fill="#FACC15" stroke="#1E110A" strokeWidth="3" />

    {/* Eyes & Smile */}
    {mood === 'cheer' ? (
      <>
        <path d="M48 72 Q55 64 62 72" fill="none" stroke="#1E110A" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M78 72 Q85 64 92 72" fill="none" stroke="#1E110A" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="55" cy="72" rx="8" ry="10.5" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.8" />
        <ellipse cx="55" cy="73" rx="4.5" ry="6.5" fill="#1E110A" />
        <circle cx="53" cy="69" r="2.2" fill="#FFFFFF" />
        <ellipse cx="85" cy="72" rx="8" ry="10.5" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.8" />
        <ellipse cx="85" cy="73" rx="4.5" ry="6.5" fill="#1E110A" />
        <circle cx="83" cy="69" r="2.2" fill="#FFFFFF" />
      </>
    )}

    {mood === 'think' ? (
      <path d="M62 92 Q70 89 78 92" fill="none" stroke="#1E110A" strokeWidth="3" strokeLinecap="round" />
    ) : (
      <>
        <path d="M58 87 Q70 101 82 87 Z" fill="#7F1D1D" stroke="#1E110A" strokeWidth="2.8" />
        <ellipse cx="70" cy="93" rx="5.5" ry="3" fill="#FB7185" />
      </>
    )}
  </svg>
);

export const EnergenJahatSvg: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 140 150" className={className} aria-label="Boss Energen Jahat">
    <rect x="34" y="26" width="72" height="94" rx="14" fill="#DC2626" stroke="#1E110A" strokeWidth="4" />
    <rect x="40" y="32" width="60" height="20" rx="6" fill="#FACC15" stroke="#1E110A" strokeWidth="2.5" />
    <text x="70" y="46" textAnchor="middle" fill="#991B1B" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="11">
      JAHAT
    </text>
    <circle cx="56" cy="73" r="9" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.5" />
    <circle cx="56" cy="73" r="4.5" fill="#991B1B" />
    <circle cx="84" cy="73" r="9" fill="#FFFFFF" stroke="#1E110A" strokeWidth="2.5" />
    <circle cx="84" cy="73" r="4.5" fill="#991B1B" />
    <path d="M44 60 L64 67 M96 60 L76 67" stroke="#1E110A" strokeWidth="4.5" strokeLinecap="round" />
    <rect x="50" y="92" width="40" height="15" rx="6" fill="#450A0A" stroke="#1E110A" strokeWidth="2.5" />
    <path d="M55 92 L59 99 L63 92 M66 92 L70 99 L74 92 M77 92 L81 99 L85 92" fill="#FFFFFF" />
    <circle cx="20" cy="82" r="12" fill="#FFFFFF" stroke="#1E110A" strokeWidth="3.2" />
    <circle cx="120" cy="82" r="12" fill="#FFFFFF" stroke="#1E110A" strokeWidth="3.2" />
  </svg>
);
