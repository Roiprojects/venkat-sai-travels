import React, { useId } from 'react'

interface LogoProps {
  variant?: 'oval' | 'horizontal' | 'icon' | 'full'
  className?: string
  height?: number | string
  showTagline?: boolean
}

export default function Logo({ variant = 'full', className = '', height = 75, showTagline = true }: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    gold:        `vstGold_${uid}`,
    goldLight:   `vstGoldLight_${uid}`,
    crimson:     `vstCrimson_${uid}`,
    border:      `vstBorder_${uid}`,
    darkFacet:   `vstDarkFacet_${uid}`,
    popShadow:   `popShadow_${uid}`,
  }

  // Refined Pure Transparent Vector Art with complete, perfectly closed, symmetrical diamond
  const TransparentLogoSVG = (
    <svg
      viewBox="0 0 520 315"
      className="h-full w-auto select-none filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic Gold Primary Gradient */}
        <linearGradient id={ids.gold} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFF6C2" />
          <stop offset="25%"  stopColor="#F6E29C" />
          <stop offset="50%"  stopColor="#D4AF37" />
          <stop offset="75%"  stopColor="#AA7B12" />
          <stop offset="100%" stopColor="#7A5600" />
        </linearGradient>

        {/* Metallic Gold Highlight Gradient */}
        <linearGradient id={ids.goldLight} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4AF37" />
          <stop offset="50%"  stopColor="#FFF8D6" />
          <stop offset="100%" stopColor="#AA7B12" />
        </linearGradient>

        {/* Deep Crimson Maroon Gradient */}
        <linearGradient id={ids.crimson} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#C81818" />
          <stop offset="40%"  stopColor="#880000" />
          <stop offset="80%"  stopColor="#580000" />
          <stop offset="100%" stopColor="#360000" />
        </linearGradient>

        {/* Gold Border Metallic Gradient */}
        <linearGradient id={ids.border} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FFF9D8" />
          <stop offset="35%"  stopColor="#E5C158" />
          <stop offset="70%"  stopColor="#B58618" />
          <stop offset="100%" stopColor="#7A5600" />
        </linearGradient>

        {/* Dark Metallic Core Gradient */}
        <linearGradient id={ids.darkFacet} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1C2633" />
          <stop offset="50%"  stopColor="#0F1722" />
          <stop offset="100%" stopColor="#080D14" />
        </linearGradient>

        {/* 3D Depth Drop Shadow Filter */}
        <filter id={ids.popShadow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* ── 1. COMPLETE, CLOSED, PERFECTLY SYMMETRICAL DIAMOND EMBLEM ── */}
      <g transform="translate(260, 108)" filter={`url(#${ids.popShadow})`}>
        {/* Outer Continuous Gold Diamond Border */}
        <polygon
          points="0,-96 104,0 0,96 -104,0"
          fill={`url(#${ids.border})`}
          stroke="#3C0000"
          strokeWidth="3"
        />

        {/* Inner Dark Metallic Facet */}
        <polygon
          points="0,-86 93,0 0,86 -93,0"
          fill={`url(#${ids.darkFacet})`}
          stroke={`url(#${ids.gold})`}
          strokeWidth="1.2"
        />

        {/* Delicate Inner Gold Trim Frame */}
        <polygon
          points="0,-78 84,0 0,78 -84,0"
          fill="none"
          stroke={`url(#${ids.goldLight})`}
          strokeWidth="1"
          opacity="0.85"
        />

        {/* Top Gold 'S' / Chevron Upper Accent (Contained inside top triangle) */}
        <g>
          <path
            d="M0,-74 L68,-10 L44,-10 L0,-48 L-30,-18 L-42,-28 Z"
            fill={`url(#${ids.gold})`}
            stroke="#580000"
            strokeWidth="1.5"
          />
          <path
            d="M0,-62 L54,-10 L38,-10 L0,-40 L-24,-16 L-32,-22 Z"
            fill="#FFF8D0"
            opacity="0.5"
          />
        </g>

        {/* Bottom Deep Crimson 'V' Monogram (Contained inside bottom triangle) */}
        <polygon
          points="-74,-6 0,74 74,-6 50,-6 0,48 -50,-6"
          fill={`url(#${ids.crimson})`}
          stroke={`url(#${ids.border})`}
          strokeWidth="2.5"
        />

        {/* Central 3D 'T' Block */}
        <g filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.65))">
          {/* Gold Outline & Base */}
          <path
            d="M-38,-34 H38 V-12 H14 V48 H-14 V-12 H-38 Z"
            fill={`url(#${ids.border})`}
            stroke="#3C0000"
            strokeWidth="2"
          />
          {/* Deep Crimson Body */}
          <path
            d="M-33,-29 H33 V-16 H10 V43 H-10 V-16 H-33 Z"
            fill={`url(#${ids.crimson})`}
          />
          {/* Crisp White Face */}
          <path
            d="M-27,-25 H27 V-20 H6 V38 H-6 V-20 H-27 Z"
            fill="#FFFFFF"
            stroke="#800000"
            strokeWidth="0.8"
          />
        </g>
      </g>

      {/* ── 2. "VENKAT SAI" TYPOGRAPHY (Embossed Deep Red & Metallic Gold) ── */}
      <g filter={`url(#${ids.popShadow})`}>
        {/* Shadow Layer */}
        <text
          x="260"
          y="238"
          fontFamily="'Playfair Display', 'Times New Roman', serif"
          fontSize="46"
          fontWeight="900"
          fill="#4A0000"
          textAnchor="middle"
          letterSpacing="4"
        >
          VENK<tspan fill="#8C660B">Λ</tspan>T SAI
        </text>
        {/* Top Highlight Layer */}
        <text
          x="260"
          y="236"
          fontFamily="'Playfair Display', 'Times New Roman', serif"
          fontSize="46"
          fontWeight="900"
          fill="#880000"
          textAnchor="middle"
          letterSpacing="4"
        >
          VENK<tspan fill={`url(#${ids.gold})`}>Λ</tspan>T SAI
        </text>
      </g>

      {/* ── 3. "T R A V E L S" & METALLIC WINGS ── */}
      <g transform="translate(260, 270)" filter={`url(#${ids.popShadow})`}>
        {/* Left Wing Lines */}
        <path
          d="M-195,-6 L-125,-6 M-185,-1 L-125,-1 M-175,4 L-125,4"
          stroke={`url(#${ids.border})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Right Wing Lines */}
        <path
          d="M125,-6 L195,-6 M125,-1 L185,-1 M125,4 L175,4"
          stroke={`url(#${ids.border})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* TRAVELS Lettering */}
        <text
          x="0"
          y="4"
          fontFamily="'Poppins', 'Inter', sans-serif"
          fontSize="21"
          fontWeight="900"
          fill="#111827"
          textAnchor="middle"
          letterSpacing="11"
        >
          TRAVELS
        </text>
      </g>

      {/* ── 4. BRAND TAGLINE ── */}
      {showTagline && (
        <text
          x="260"
          y="298"
          fontFamily="'Poppins', 'Inter', sans-serif"
          fontSize="9.5"
          fontWeight="800"
          fill="#334155"
          textAnchor="middle"
          letterSpacing="3.5"
        >
          SAFE JOURNEY <tspan fill="#880000">•</tspan> HAPPY DESTINATION
        </text>
      )}
    </svg>
  )

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ height }}>
      {TransparentLogoSVG}
    </div>
  )
}
