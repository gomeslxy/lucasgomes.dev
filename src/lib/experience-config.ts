/** Shared art direction. Durations are milliseconds; pointer angles are degrees. */
export const experienceConfig = {
  intro: {
    minimumMs: 380,
    maximumMs: 1100,
    mobileMaximumMs: 850,
    exitMs: 460,
    mobileExitMs: 320,
  },
  pointer: {
    maxTiltX: .6,
    maxTiltY: .8,
    lightOpacity: .28,
  },
  spring: { stiffness: 110, damping: 28, mass: .65 },
  atmosphere: {
    particleCount: 12,
    mobileParticleCount: 4,
    cycleSeconds: 22,
    glowOpacity: .36,
  },
} as const;
