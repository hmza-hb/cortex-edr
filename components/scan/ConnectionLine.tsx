import React from 'react';

interface ConnectionLineProps {
    id: string
    from: { x: number, y: number }
    to: { x: number, y: number }
    active: boolean        // is this line currently transmitting?
    completed: boolean     // has this connection completed?
}

export function ConnectionLine({
    id, from, to, active, completed
}: ConnectionLineProps) {

    // Create curved path using cubic bezier
    // The curve direction depends on the angle between points
    const dx = to.x - from.x
    const dy = to.y - from.y

    // Control points for natural-looking curve
    const controlX1 = from.x + dx * 0.5
    const controlY1 = from.y
    const controlX2 = from.x + dx * 0.5
    const controlY2 = to.y

    const pathD = `M ${from.x} ${from.y} 
                 C ${controlX1} ${controlY1}, 
                   ${controlX2} ${controlY2}, 
                   ${to.x} ${to.y}`

    return (
        <g>
            {/* LAYER 1: Base line (always visible, very dim) */}
            <path
                d={pathD}
                stroke="#1a1a2e"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="4 4"
            />

            {/* LAYER 2: Glow line (visible when active or completed) */}
            <path
                d={pathD}
                stroke={completed ? '#10b981' : active ? '#3b82f6' : 'transparent'}
                strokeWidth={1.5}
                fill="none"
                opacity={completed ? 0.4 : active ? 0.6 : 0}
                style={{ transition: 'opacity 0.8s ease' }}
            />

            {/* LAYER 3: The traveling light dot */}
            {active && (
                <circle r={3} fill="#3b82f6" fillOpacity={0.8}>
                    <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={pathD}
                    />
                </circle>
            )}

            {active && (
                <>
                    <circle r={6} fill="#3b82f6" opacity={0.2}>
                        <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path={pathD}
                            begin="0.1s"
                        />
                    </circle>
                    <circle r={8} fill="#3b82f6" opacity={0.05}>
                        <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path={pathD}
                            begin="0.2s"
                        />
                    </circle>
                </>
            )}

            {/* LAYER 5: Connection dots at endpoints */}
            <circle
                cx={from.x}
                cy={from.y}
                r={4}
                fill={active || completed ? '#ef4444' : '#2a2a2a'}
                style={{
                    filter: active ? 'drop-shadow(0 0 4px #ef4444)' : 'none',
                    transition: 'all 0.8s ease'
                }}
            />
            <circle
                cx={to.x}
                cy={to.y}
                r={4}
                fill={active || completed ? '#ef4444' : '#2a2a2a'}
                style={{
                    filter: active ? 'drop-shadow(0 0 4px #ef4444)' : 'none',
                    transition: 'all 0.8s ease'
                }}
            />
        </g>
    )
}
