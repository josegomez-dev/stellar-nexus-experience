# 🖼️ Image Assets Guide - STELLAR NEXUS

## 📁 Folder Structure

```
public/images/
├── demos/          # Demo-specific icons and images
├── character/      # NEXUS PRIME character assets
├── logo/           # Project logos and branding
└── icons/          # General UI icons
```

## 🎭 Demo Icons

### Required Images for Demos:

#### 1. Baby Steps to Riches 🍼💰
- **File**: `demos/baby-steps.svg` or `demos/baby-steps.png`
- **Style**: Baby footprint, money symbols, or simple growth icon
- **Colors**: Blue to cyan gradient theme
- **Size**: 64x64px (SVG preferred for scalability)

#### 2. Democracy in Action 🗳️🎪
- **File**: `demos/democracy.svg` or `demos/democracy.png`
- **Style**: Voting ballot, multiple people, or consensus symbols
- **Colors**: Green to emerald gradient theme
- **Size**: 64x64px (SVG preferred for scalability)

#### 3. Drama Queen Escrow 👑🎭
- **File**: `demos/drama-queen.svg` or `demos/drama-queen.png`
- **Style**: Crown, theater masks, or dramatic symbols
- **Colors**: Orange to red gradient theme
- **Size**: 64x64px (SVG preferred for scalability)

#### 4. Gig Economy Madness 🛒🎪
- **File**: `demos/gig-economy.svg` or `demos/gig-economy.png`
- **Style**: Task list, marketplace, or gig work symbols
- **Colors**: Purple to pink gradient theme
- **Size**: 64x64px (SVG preferred for scalability)

## 🤖 NEXUS PRIME Character

### Character Assets:

#### Main Character
- **File**: `character/nexus-prime.svg` or `character/nexus-prime.png`
- **Style**: Futuristic holographic entity with Stellar network patterns
- **Colors**: Deep space black, cyan, purple with glowing effects
- **Size**: 128x128px for main avatar, 256x256px for detailed view

#### Character States
- **File**: `character/nexus-prime-connected.svg`
- **Style**: Character with active Stellar network connections
- **Use**: When wallet is connected

- **File**: `character/nexus-prime-disconnected.svg`
- **Style**: Character with dimmed or inactive appearance
- **Use**: When wallet is disconnected

#### Character Elements
- **File**: `character/network-pattern.svg`
- **Style**: Stellar network connection patterns
- **Use**: Background patterns and effects

## 🏷️ Logo & Branding

### Main Logo
- **File**: `logo/stellar-nexus.svg` or `logo/stellar-nexus.png`
- **Style**: STELLAR NEXUS text with Stellar blockchain elements
- **Colors**: Cyan to purple gradient
- **Size**: 200x80px (SVG preferred)

### Logo Variations
- **File**: `logo/stellar-nexus-white.svg`
- **Style**: White version for dark backgrounds
- **Use**: Header and main navigation

- **File**: `logo/stellar-nexus-icon.svg`
- **Style**: Icon-only version (NP initials)
- **Size**: 32x32px, 64x64px
- **Use**: Favicon, small branding elements

## 🔧 General Icons

### UI Icons
- **File**: `icons/wallet.svg`
- **Style**: Wallet or key icon
- **Use**: Wallet connection buttons

- **File**: `icons/network.svg`
- **Style**: Network or connection icon
- **Use**: Network status indicators

- **File**: `icons/copy.svg`
- **Style**: Copy or duplicate icon
- **Use**: Copy address buttons

- **File**: `icons/expand.svg`
- **Style**: Expand/collapse arrow
- **Use**: Sidebar toggle buttons

- **File**: `icons/close.svg`
- **Style**: Close or X icon
- **Use**: Close buttons and modals

## 🎨 Design Guidelines

### Image Formats
- **SVG**: Preferred for icons and logos (scalable, small file size)
- **PNG**: Use for complex images with transparency
- **WebP**: Modern format for photos and complex graphics

### Color Schemes
- **Primary**: Cyan (#06b6d4) to Purple (#8b5cf6)
- **Secondary**: Green (#10b981) to Emerald (#059669)
- **Accent**: Orange (#f97316) to Red (#ef4444)
- **Neutral**: Slate (#0f172a) to Gray (#6b7280)

### Style Guidelines
- **Futuristic**: Use sharp edges, glowing effects, and modern shapes
- **Stellar Theme**: Incorporate network patterns, nodes, and connection lines
- **Professional**: Clean, readable, and consistent with the project theme
- **Accessible**: Ensure good contrast and readability

## 📱 Responsive Considerations

### Icon Sizes
- **Mobile**: 32x32px minimum
- **Tablet**: 48x48px
- **Desktop**: 64x64px
- **High DPI**: Provide 2x versions for retina displays

### File Naming Convention
```
{category}/{name}-{variant}.{format}
Examples:
- demos/baby-steps.svg
- character/nexus-prime-connected.svg
- logo/stellar-nexus-white.svg
- icons/wallet.svg
```

## 🚀 Implementation Notes

### Next.js Image Optimization
- Use `next/image` component for automatic optimization
- Place images in `public/images/` for static serving
- Consider using `next/image` with `loader: 'default'` for dynamic images

### Performance Tips
- Optimize SVG files (remove unnecessary metadata)
- Compress PNG files using tools like TinyPNG
- Use WebP format for modern browsers
- Implement lazy loading for non-critical images

## 🔄 Update Process

1. **Add new images** to appropriate folders
2. **Update component imports** to use image paths
3. **Test responsiveness** across different screen sizes
4. **Verify accessibility** with screen readers
5. **Optimize file sizes** for production

---

**Note**: This guide should be updated as new image assets are added to the project.

