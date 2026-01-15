# harmonics and healing Website

A modern, smooth-scrolling healing website with parallax effects similar to Atomix NYC.

## Features

- ✨ Smooth scrolling animations
- 🎨 Parallax effects on images and sections
- 📱 Fully responsive design
- 🎭 GSAP-powered animations
- 🖼️ Lazy loading images
- 🎯 Intersection Observer API
- 🍔 Mobile-friendly navigation
- ⚡ Optimized performance

## File Structure

```
project/
│
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Installation & Setup

### 1. Download Files
Save all three files (index.html, styles.css, script.js) in the same folder.

### 2. Replace Images
The website currently uses placeholder images from Unsplash. Replace them with your own:

**In index.html, find and replace these image URLs:**
- Hero section backgrounds
- Grid section images (4 images)
- About section image
- Parallax section background
- Menu items (3 images)

**Image recommendations:**
- Hero: High-quality restaurant interior or signature dish
- Grid: Mix of food, ambiance, and detail shots
- About: Chef at work or restaurant details
- Parallax: Restaurant dining area or atmospheric shot
- Menu: Professional food photography

### 3. Update Content
**Replace text content in index.html:**
- Restaurant name (currently "Lumina")
- Hero subtitle
- About section philosophy
- Experience descriptions
- Menu items and descriptions
- Contact information
- Footer social links

### 4. Customize Colors
**In styles.css, update the CSS variables:**
```css
:root {
    --primary-color: #1a1a1a;      /* Dark background color */
    --secondary-color: #f5f5f5;    /* Light background color */
    --accent-color: #c9a96e;       /* Gold/accent color */
    --text-color: #333;            /* Main text color */
    --light-text: #666;            /* Secondary text color */
}
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **GSAP 3.12** - Animation library
- **ScrollTrigger** - Scroll-based animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

The website includes several optimizations:
- Lazy loading for images
- Hardware-accelerated CSS transforms
- RequestAnimationFrame for smooth animations
- Intersection Observer for efficient viewport detection
- Optimized GSAP animations with `will-change`

## Customization Tips

### Change Animation Speed
In `script.js`, adjust the `duration` values in GSAP animations:
```javascript
gsap.from('.hero-title', {
    duration: 1.2,  // Change this value (higher = slower)
    // ...
});
```

### Adjust Parallax Intensity
Change the `y` values in parallax animations:
```javascript
gsap.to(item, {
    y: -100,  // Change this (higher = more movement)
    // ...
});
```

### Modify Section Heights
In `styles.css`, adjust padding values:
```css
.about-section {
    padding: 8rem 2rem;  /* Vertical | Horizontal */
}
```

## Mobile Responsiveness

The site is fully responsive with:
- Hamburger menu for mobile devices
- Adjusted font sizes using `clamp()`
- Flexible grid layouts
- Touch-friendly navigation
- Optimized animations for mobile

## Optional Features

### Custom Cursor
Uncomment this line in `script.js` to enable:
```javascript
// initCursor();
```

### Change Scroll Behavior
Modify the smooth scroll settings in the CSS:
```css
html {
    scroll-behavior: smooth;  /* or 'auto' for instant */
}
```

## Troubleshooting

**Animations not working:**
- Ensure GSAP CDN links are loading correctly
- Check browser console for errors
- Verify JavaScript is enabled

**Images not loading:**
- Check image URLs are correct
- Ensure image files are in the correct location
- Verify internet connection for external images

**Mobile menu not working:**
- Clear browser cache
- Check viewport meta tag in HTML
- Test on different devices

## Credits

- **GSAP** - GreenSock Animation Platform
- **Images** - Unsplash (placeholder images)
- **Fonts** - System fonts (Helvetica Neue)

## License

This template is free to use for personal and commercial projects.

## Support

For questions or issues:
1. Check browser console for errors
2. Verify all files are in the same directory
3. Ensure CDN links are accessible
4. Test in different browsers

---

**Last Updated:** January 2025
**Version:** 1.0