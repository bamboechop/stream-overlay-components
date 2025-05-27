export const GAME_METADATA: Record<string, Partial<{ backgroundImagePath: string; color: string; iconPath: string; intermissionTextMode: string }>> = {
  'Brotato': {
    backgroundImagePath: '/modern/game-backgrounds/brotato.jpg',
    color: 'transparent',
    iconPath: '/programs/{themePath}/brotato.icon.png',
    intermissionTextMode: 'default',
  },
  'Cities: Skylines II': {
    backgroundImagePath: '/modern/game-backgrounds/cities-skylines-ii.jpg',
    color: 'rgba(30, 71, 159, 0.5)',
    iconPath: '/programs/{themePath}/cities-skylines-ii.icon.png',
    intermissionTextMode: 'default',
  },
  'Cult of the Lamb': {
    backgroundImagePath: '/modern/game-backgrounds/cult-of-the-lamb.jpg',
    color: 'rgba(239, 17, 30, 0.35)',
    iconPath: '/programs/{themePath}/cult-of-the-lamb.icon.png',
    intermissionTextMode: 'default',
  },
  'Deep Rock Galactic: Survivor': {
    backgroundImagePath: '/modern/game-backgrounds/drg-survivor.jpg',
    color: 'transparent',
    iconPath: '/programs/{themePath}/drg-survivor.icon.png',
    intermissionTextMode: 'default',
  },
  'Golf It!': {
    backgroundImagePath: '/modern/game-backgrounds/golf-it.jpg',
    color: 'rgba(135, 80, 5, 0.5)',
    iconPath: '/programs/{themePath}/golf-it.icon.png',
    intermissionTextMode: 'default',
  },
  'Lego & Brickbuilding': {
    iconPath: '/programs/{themePath}/brickbuilding.icon.png',
  },
  'Just Chatting': {
    intermissionTextMode: 'chatting',
  },
  'Need for Speed: Most Wanted': {
    backgroundImagePath: '/modern/game-backgrounds/need-for-speed-most-wanted.jpg',
    color: 'rgba(4, 60, 73, 0.75)',
    iconPath: '/programs/{themePath}/need-for-speed-most-wanted.icon.png',
    intermissionTextMode: 'default',
  },
  'Mirror\'s Edge': {
    backgroundImagePath: '/modern/game-backgrounds/mirrors-edge.jpg',
    color: 'rgba(242, 0, 0, 0.5)',
    iconPath: '/programs/{themePath}/mirrors-edge.icon.png',
    intermissionTextMode: 'default',
  },
} as const;
