# Connexxion Agro-Herders - Branding Guide

## Company Name
**Connexxion Agro-Herders Identity, Verification and Security**

## Logo Usage

### Logo File
- **Location**: `frontend/public/Connexxion_agro_logo.png`
- **Format**: PNG with transparency
- **Usage**: All branding and UI elements

### Implementation

The logo is used in the following locations:

1. **Navigation Bar** (`frontend/components/Navbar.tsx`)
   - Size: 40x40px
   - Position: Top left corner
   - Displays on all authenticated pages

2. **Login Page** (`frontend/app/login/page.tsx`)
   - Hero logo: 128x128px (large display on left panel)
   - Mobile logo: 48x48px (mobile view)

3. **Home Page** (`frontend/app/page.tsx`)
   - Header logo: 40x40px
   - Footer logo: 32x32px

### HTML Implementation
```tsx
<img 
  src="/Connexxion_agro_logo.png" 
  alt="Connexxion Agro-Herders" 
  className="w-10 h-10 object-contain" 
/>
```

### Sizing Guidelines
- **Navigation**: 40x40px (w-10 h-10)
- **Hero/Featured**: 128x128px (w-32 h-32)
- **Mobile**: 48x48px (w-12 h-12)
- **Footer**: 32x32px (w-8 h-8)

## Color Scheme

### Primary Colors
- **Green**: `#059669` (emerald-600) - Primary brand color
- **Dark Green**: `#047857` (emerald-700) - Hover states
- **Light Green**: `#10b981` (emerald-500) - Accents

### Secondary Colors
- **Blue**: `#2563eb` (blue-600) - Secondary actions
- **Gray**: `#6b7280` (gray-500) - Text and borders

### Background Colors
- **Light**: `#f9fafb` (gray-50) - Page backgrounds
- **White**: `#ffffff` - Cards and panels
- **Dark**: `#1f2937` (gray-800) - Dark mode elements

## Typography

### Headings
- Font: System default (sans-serif)
- Weight: Bold (700)
- Color: Gray-800 or White (depending on background)

### Body Text
- Font: System default (sans-serif)
- Weight: Normal (400)
- Color: Gray-600

## Default Credentials

For testing and demo purposes:
- **Email**: officer@connexxion.gov
- **Password**: SecurePass123

## Notes

- Logo should always maintain aspect ratio (use `object-contain`)
- Logo works on both light and dark backgrounds
- All branding updated from previous "AHISMS" to "Connexxion Agro-Herders"
