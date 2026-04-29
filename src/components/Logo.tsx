"use client";

export default function Logo({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* The "Structural E" Icon */}
      {/* Background Frame - Optional for a more structured look */}
      <rect x="15" y="15" width="70" height="70" stroke={color} strokeWidth="2" strokeOpacity="0.1" />
      
      {/* Main Structural Elements */}
      {/* Vertical Spine */}
      <path 
        d="M35 25V75" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="square"
      />
      
      {/* Top Cantilever (Longest) */}
      <path 
        d="M35 28H75" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="square"
      />
      
      {/* Middle Cantilever (Medium) */}
      <path 
        d="M35 50H65" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="square"
      />
      
      {/* Bottom Cantilever (Shortest - creates dynamic perspective) */}
      <path 
        d="M35 72H55" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="square"
      />
      
      {/* Accent Geometric Dot (The "Discovery" point) */}
      <circle cx="75" cy="72" r="4" fill={color} />
    </svg>
  );
}
