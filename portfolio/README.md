# Data Engineer Portfolio

A modern, responsive portfolio website for a Data Engineer built with vanilla HTML, CSS, and JavaScript. Features a clean design, smooth animations, and comprehensive functionality.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Dark/Light Theme**: Toggle between themes with localStorage persistence
- **Smooth Animations**: Scroll-based reveal animations and interactive effects
- **Form Validation**: Client-side validation with accessibility features
- **Particle System**: Animated background particles in hero section
- **Project Filtering**: Filter projects by technology/category
- **Skill Bars**: Animated progress bars for skills visualization
- **Timeline**: Interactive experience timeline
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 📁 Project Structure

```
portfolio/
├── index.html                 # Main HTML file
├── css/
│   ├── style.css             # Main styles with CSS variables
│   ├── responsive.css        # Responsive design styles
│   └── animations.css        # Animation keyframes and classes
├── js/
│   ├── main.js               # Navigation, theme toggle, general interactions
│   ├── animations.js         # Scroll animations and effects
│   └── form-validation.js    # Contact form validation
├── assets/
│   ├── images/
│   │   ├── profile.jpg       # Profile photo (400x400px recommended)
│   │   ├── projects/         # Project screenshots
│   │   │   └── project1.jpg
│   │   └── icons/            # Certification and tech icons
│   │       ├── aws.png
│   │       ├── favicon.ico
│   └── documents/
│       └── cv.pdf            # Resume/CV file
└── php/
    └── contact.php           # Backend form handler (future implementation)
```

## 🎨 Customization Guide

### 1. Personal Information

Update the following in `index.html`:

```html
<!-- Hero Section -->
<h1 class="hero-title">
    <span class="hero-title-main">Data Engineer</span>
    <span class="hero-title-sub">Your Tagline Here</span>
</h1>

<!-- Contact Information -->
<p>your.email@example.com</p>
<p>+1 (555) 123-4567</p>
<p>San Francisco, CA</p>

<!-- Social Links -->
<a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a>
<a href="https://github.com/yourusername" target="_blank">GitHub</a>
```

### 2. Color Scheme

Modify CSS variables in `css/style.css`:

```css
:root {
  --primary-color: #2563eb;      /* Main blue */
  --secondary-color: #10b981;    /* Accent green */
  --accent-color: #f59e0b;       /* Warning/attention color */
  --bg-primary: #ffffff;         /* Main background */
  --text-primary: #111827;       /* Primary text */
}
```

### 3. Skills and Technologies

Update the skills section in `index.html`:

```html
<div class="skill-item">
    <span class="skill-name">Python</span>
    <div class="skill-bar">
        <div class="skill-progress" style="width: 95%"></div>
    </div>
</div>
```

### 4. Projects

Add your projects in the projects section:

```html
<div class="project-card" data-category="etl">
    <div class="project-image">
        <img src="assets/images/projects/your-project.jpg" alt="Project Name" loading="lazy">
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Title</h3>
        <p class="project-description">Project description...</p>
        <div class="project-tech">
            <span class="tech-badge">Python</span>
            <span class="tech-badge">Spark</span>
        </div>
    </div>
</div>
```

### 5. Experience Timeline

Update the experience section:

```html
<div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <div class="timeline-date">2023 - Present</div>
        <h3 class="timeline-title">Senior Data Engineer</h3>
        <div class="timeline-company">Your Company</div>
        <ul class="timeline-responsibilities">
            <li>Responsibility 1</li>
            <li>Responsibility 2</li>
        </ul>
    </div>
</div>
```

### 6. Certifications

Add your certifications:

```html
<div class="certification-card">
    <div class="certification-icon">
        <img src="assets/images/icons/certification.png" alt="Cert Name" loading="lazy">
    </div>
    <h3 class="certification-title">AWS Certified Solutions Architect</h3>
    <p class="certification-issuer">Amazon Web Services</p>
    <span class="certification-date">2023</span>
</div>
```

## 🖼️ Required Assets

### Images to Add:

1. **Profile Photo** (`assets/images/profile.jpg`)
   - Size: 400x400px minimum
   - Format: JPG/PNG
   - Style: Professional headshot

2. **Project Screenshots** (`assets/images/projects/`)
   - Size: 600x400px recommended
   - Format: JPG/PNG
   - Content: Project interfaces or diagrams

3. **Certification Icons** (`assets/images/icons/`)
   - Size: 60x60px
   - Format: PNG with transparent background
   - Sources: Official certification logos

4. **Tech Stack Icons** (optional)
   - For project badges
   - Size: 20x20px
   - Format: PNG/SVG

5. **Favicon** (`assets/images/icons/favicon.ico`)
   - Size: 32x32px or 16x16px
   - Format: ICO

6. **CV/Resume** (`assets/documents/cv.pdf`)
   - Format: PDF
   - Keep under 2MB

## 🔧 Backend Integration

### PHP Contact Form

The contact form is prepared for PHP backend integration. Create `php/contact.php`:

```php
<?php
// Basic contact form handler
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Validate inputs
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }

    // Send email (configure SMTP settings)
    $to = "your.email@example.com";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/html\r\n";

    $emailBody = "
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Subject:</strong> $subject</p>
    <p><strong>Message:</strong></p>
    <p>$message</p>
    ";

    if (mail($to, $subject, $emailBody, $headers)) {
        echo json_encode(['success' => 'Message sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message']);
    }
}
?>
```

Update form action in `index.html`:
```html
<form id="contact-form" action="php/contact.php" method="POST">
```

## 🚀 Deployment

### Local Development

1. Clone or download the project
2. Open `index.html` in your browser
3. For PHP functionality, run on a local server (XAMPP, MAMP, etc.)

### Web Server Deployment

1. Upload all files to your web server
2. Ensure PHP support if using backend
3. Test all functionality
4. Configure domain/subdomain

### Static Site Generators (Optional)

For easier maintenance, consider converting to:
- **Jekyll** (GitHub Pages compatible)
- **Hugo** (Fast static site generator)
- **Gatsby** (React-based)

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔍 SEO Optimization

### Meta Tags

Update meta tags in `index.html`:

```html
<meta name="description" content="Professional portfolio of [Your Name], Data Engineer specializing in ETL, Big Data, and Cloud technologies.">
<meta name="keywords" content="Data Engineer, ETL, Big Data, Python, SQL, AWS, Azure, Spark">
<meta name="author" content="[Your Name]">
```

### Structured Data (Optional)

Add JSON-LD structured data for better SEO:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Your Name]",
  "jobTitle": "Data Engineer",
  "url": "https://yourwebsite.com"
}
</script>
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Responsive design on mobile/tablet/desktop
- [ ] Theme toggle functionality
- [ ] Navigation menu on mobile
- [ ] Form validation and submission
- [ ] Scroll animations
- [ ] Project filtering
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Image optimization
- [ ] Minified CSS/JS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: your.email@example.com

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**