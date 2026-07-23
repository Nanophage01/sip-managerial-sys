"use client";

export default function LogSawAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] select-none">
      <div className="relative w-[600px] h-[450px] flex items-center justify-center">
        <svg
          viewBox="0 0 600 450"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Wood grain gradient for the log */}
            <linearGradient id="woodGrain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5E3C" />
              <stop offset="15%" stopColor="#A0724B" />
              <stop offset="30%" stopColor="#7A4E2D" />
              <stop offset="45%" stopColor="#9C6B42" />
              <stop offset="55%" stopColor="#7A4E2D" />
              <stop offset="70%" stopColor="#A0724B" />
              <stop offset="85%" stopColor="#8B5E3C" />
              <stop offset="100%" stopColor="#6B4226" />
            </linearGradient>

            {/* Log end grain (circular face) */}
            <radialGradient id="logEnd" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C48A5C" />
              <stop offset="40%" stopColor="#A0724B" />
              <stop offset="70%" stopColor="#8B5E3C" />
              <stop offset="100%" stopColor="#6B4226" />
            </radialGradient>

            {/* Ring metal gradient */}
            <linearGradient id="ringMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B4226" />
              <stop offset="50%" stopColor="#6B4226" />
              <stop offset="100%" stopColor="#6B4226" />
            </linearGradient>

            {/* Shadow filters */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="4"
                dy="6"
                stdDeviation="6"
                floodColor="#00000077"
              />
            </filter>
            <filter
              id="shadowLight"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="2"
                dy="3"
                stdDeviation="3"
                floodColor="#6B4226"
              />
            </filter>
          </defs>

          {/* === BACK HALF OF RING (behind log) === */}
          <path
            d="M 300 65 A 80 150 0 0 0 300 385"
            fill="none"
            stroke="url(#ringMetal)"
            strokeWidth="16"
            strokeLinecap="round"
            filter="url(#shadowLight)"
          />
          <path
            d="M 300 65 A 80 150 0 0 0 300 385"
            fill="none"
            stroke="#6B4226"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.2"
          />

          {/* === LOG (slides through the ring) === */}
          <g
            className="log-group"
            style={{
              animation: "sawLog 3s ease-in-out infinite alternate",
            }}
          >
            {/* Log body */}
            <rect
              x="80"
              y="155"
              width="440"
              height="140"
              rx="12"
              ry="12"
              fill="url(#woodGrain)"
              filter="url(#shadow)"
            />

            {/* Wood grain lines */}
            <line
              x1="100"
              y1="170"
              x2="500"
              y2="170"
              stroke="#6B4226"
              strokeWidth="1.5"
              opacity="0.35"
            />
            <line
              x1="100"
              y1="195"
              x2="500"
              y2="195"
              stroke="#6B4226"
              strokeWidth="2"
              opacity="0.25"
            />
            <line
              x1="100"
              y1="220"
              x2="500"
              y2="220"
              stroke="#6B4226"
              strokeWidth="1.8"
              opacity="0.3"
            />
            <line
              x1="100"
              y1="245"
              x2="500"
              y2="245"
              stroke="#6B4226"
              strokeWidth="1.5"
              opacity="0.35"
            />
            <line
              x1="100"
              y1="265"
              x2="500"
              y2="265"
              stroke="#6B4226"
              strokeWidth="1.2"
              opacity="0.25"
            />
            <line
              x1="100"
              y1="280"
              x2="500"
              y2="280"
              stroke="#6B4226"
              strokeWidth="1.5"
              opacity="0.3"
            />

            {/* Bark texture */}
            <rect
              x="80"
              y="155"
              width="440"
              height="10"
              rx="4"
              ry="4"
              fill="#4a2c16"
              opacity="0.4"
            />
            <rect
              x="80"
              y="285"
              width="440"
              height="10"
              rx="4"
              ry="4"
              fill="#4a2c16"
              opacity="0.4"
            />

            {/* Knots */}
            <ellipse
              cx="180"
              cy="210"
              rx="12"
              ry="6"
              fill="#6B4226"
              opacity="0.3"
            />
            <ellipse
              cx="350"
              cy="260"
              rx="10"
              ry="5"
              fill="#6B4226"
              opacity="0.2"
            />
            <ellipse
              cx="420"
              cy="190"
              rx="8"
              ry="4"
              fill="#6B4226"
              opacity="0.25"
            />

            {/* Left end cap (rounded) */}
            <ellipse cx="80" cy="225" rx="14" ry="70" fill="url(#logEnd)" />
            <ellipse
              cx="80"
              cy="225"
              rx="14"
              ry="70"
              fill="none"
              stroke="#5a3a1e"
              strokeWidth="1.5"
            />
            <ellipse
              cx="80"
              cy="225"
              rx="7"
              ry="38"
              fill="none"
              stroke="#6B4226"
              strokeWidth="1"
              opacity="0.5"
            />
            <ellipse
              cx="80"
              cy="225"
              rx="3"
              ry="18"
              fill="none"
              stroke="#6B4226"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* Right end cap - curved triangle tip (bullet/nose shape) */}
            {/* Starts at top of log (155), curves to a rounded point at x=545, then back to bottom (295) */}
            <path
              d="M 520 155 Q 560 155 565 200 Q 568 225 565 250 Q 560 295 520 295"
              fill="url(#logEnd)"
              filter="url(#shadow)"
            />
            <path
              d="M 520 155 Q 560 155 565 200 Q 568 225 565 250 Q 560 295 520 295"
              fill="none"
              stroke="#5a3a1e"
              strokeWidth="1.5"
            />

            {/* Wood grain lines extended onto the tip */}
            <line
              x1="520"
              y1="185"
              x2="560"
              y2="200"
              stroke="#6B4226"
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1="520"
              y1="225"
              x2="563"
              y2="225"
              stroke="#6B4226"
              strokeWidth="1"
              opacity="0.25"
            />
            <line
              x1="520"
              y1="265"
              x2="560"
              y2="252"
              stroke="#6B4226"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Growth rings on the tip face */}
            <ellipse
              cx="565"
              cy="225"
              rx="4"
              ry="12"
              fill="none"
              stroke="#6B4226"
              strokeWidth="0.8"
              opacity="0.4"
            />
            <ellipse
              cx="565"
              cy="225"
              rx="2"
              ry="6"
              fill="none"
              stroke="#6B4226"
              strokeWidth="0.8"
              opacity="0.3"
            />
          </g>

          {/* === FRONT HALF OF RING (in front of log) === */}
          <path
            d="M 300 65 A 80 150 0 0 1 300 385"
            fill="none"
            stroke="url(#ringMetal)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#shadow)"
          />
          <path
            d="M 300 65 A 80 150 0 0 1 300 385"
            fill="none"
            stroke="#6B4226"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* Ring inner rim for depth */}
          <path
            d="M 300 75 A 70 140 0 0 1 300 375"
            fill="none"
            stroke="#6B4226"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Highlight arc for 3D look */}
          <path
            d="M 370 95 A 68 135 0 0 1 370 355"
            fill="none"
            stroke="#6B4226"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Dark interior of the ring opening */}
          <ellipse
            cx="300"
            cy="225"
            rx="76"
            ry="146"
            fill="#a50606c9"
            opacity="0.92"
          />
        </svg>
      </div>

      <p className="mt-6 text-gray-500 text-sm text-center max-w-md">
        A brown log slides in and out of an upright circular ring.
      </p>
    </div>
  );
}
