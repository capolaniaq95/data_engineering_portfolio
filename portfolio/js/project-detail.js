// Project Detail Page Functionality
class ProjectDetail {
    constructor() {
        this.projectId = this.getProjectIdFromURL();
        this.projectData = null;
        this.init();
    }

    init() {
        if (this.projectId) {
            this.loadProjectData();
        } else {
            this.showError('No project ID specified');
        }
        this.setupScrollSpy();
        this.setupThemeToggle();
    }

    getProjectIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadProjectData() {
        try {
            const response = await fetch('assets/data/projects.json');
            const projects = await response.json();
            this.projectData = projects.find(p => p.id === this.projectId);

            if (this.projectData) {
                this.renderProject();
            } else {
                this.showError('Project not found');
            }
        } catch (error) {
            console.error('Error loading project data:', error);
            this.showError('Error loading project data');
        }
    }

    renderProject() {
        const project = this.projectData;

        // Update page title and meta
        document.getElementById('project-title').textContent = `${project.title} - Data Engineer Portfolio`;
        document.getElementById('project-meta-description').setAttribute('content',
            `Learn about ${project.title}: ${project.shortDescription}`);

        // Update hero section
        document.getElementById('project-hero-title').textContent = project.title;
        document.getElementById('project-hero-description').textContent = project.shortDescription;
        document.getElementById('project-category').textContent = project.category.toUpperCase();

        // Update status badge
        const statusEl = document.getElementById('project-status');
        statusEl.textContent = project.status.replace('-', ' ').toUpperCase();
        statusEl.className = `status-badge status-${project.status}`;

        // Update duration
        const startDate = new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const endDate = new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        document.getElementById('project-duration').textContent = `${startDate} - ${endDate}`;

        // Update technologies
        const techContainer = document.getElementById('project-technologies');
        techContainer.innerHTML = project.technologies.map(tech =>
            `<span class="tech-badge">${tech}</span>`
        ).join('');

        // Update links
        if (project.githubUrl) {
            document.getElementById('project-github-link').href = project.githubUrl;
        }
        if (project.liveUrl) {
            document.getElementById('project-live-link').href = project.liveUrl;
        }

        // Update content sections
        this.updateContentSections();

        // Update gallery
        this.updateGallery();
    }

    updateContentSections() {
        const project = this.projectData;

        // Overview
        document.getElementById('project-overview').textContent = project.content.overview;

        // Challenge
        document.getElementById('project-challenge').textContent = project.content.challenge;

        // Solution
        document.getElementById('project-solution').textContent = project.content.solution;

        // Architecture
        const architectureEl = document.getElementById('project-architecture');
        architectureEl.innerHTML = `
            <p>${project.content.architecture.split('\n\n')[0]}</p>
            <ul>
                ${project.content.architecture.split('\n\n').slice(1).join('\n').split('\n- ').filter(item => item.trim()).map(item =>
                    `<li><strong>${item.split(':')[0]}:</strong> ${item.split(':').slice(1).join(':')}</li>`
                ).join('')}
            </ul>
        `;

        // Technologies detail
        const techDetailEl = document.getElementById('project-technologies-detail');
        techDetailEl.innerHTML = Object.entries(project.content.technologiesUsed).map(([category, technologies]) => `
            <div class="tech-category">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div class="tech-list">
                    ${technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // Results
        document.getElementById('project-results').innerHTML = `
            <p>${project.content.results.split('\n')[0]}</p>
            <div class="metrics-grid">
                ${Object.entries(project.metrics).map(([key, value]) => `
                    <div class="metric-item">
                        <div class="metric-value">${value}</div>
                        <div class="metric-label">${this.formatMetricLabel(key)}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Lessons learned
        document.getElementById('project-lessons').innerHTML = `
            <p>${project.content.lessonsLearned.split('\n')[0]}</p>
            <ul>
                ${project.content.lessonsLearned.split('\n').slice(1).map(lesson =>
                    `<li>${lesson.replace('- ', '')}</li>`
                ).join('')}
            </ul>
        `;

        // Future improvements
        document.getElementById('project-future').innerHTML = `
            <p>${project.content.futureImprovements.split('\n')[0]}</p>
            <ul>
                ${project.content.futureImprovements.split('\n').slice(1).map(improvement =>
                    `<li>${improvement.replace('- ', '')}</li>`
                ).join('')}
            </ul>
        `;
    }

    updateGallery() {
        const project = this.projectData;
        const galleryEl = document.getElementById('project-gallery');

        if (project.images && project.images.length > 0) {
            galleryEl.innerHTML = project.images.map((image, index) => `
                <div class="gallery-item">
                    <img src="${image}" alt="${project.title} screenshot ${index + 1}" loading="lazy">
                    <div class="gallery-caption">${project.title} - Image ${index + 1}</div>
                </div>
            `).join('');
        } else {
            // Hide gallery section if no images
            const gallerySection = galleryEl.closest('.project-gallery');
            if (gallerySection) {
                gallerySection.style.display = 'none';
            }
        }
    }

    formatMetricLabel(key) {
        return key.split(/(?=[A-Z])/).map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setupScrollSpy() {
        // Smooth scrolling for TOC links
        document.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update active TOC link
                    this.updateActiveTocLink(link);
                }
            });
        });

        // Update active TOC link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.content-section');
            const tocLinks = document.querySelectorAll('.toc-link');

            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    updateActiveTocLink(activeLink) {
        document.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);

                // Update theme icon
                const themeIcon = themeToggle.querySelector('.theme-icon');
                themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            });
        }
    }

    showError(message) {
        const main = document.querySelector('.project-content .container');
        main.innerHTML = `
            <div class="error-message" style="
                text-align: center;
                padding: 4rem 2rem;
                background: var(--card-bg);
                border-radius: 12px;
                border: 1px solid var(--border-color);
            ">
                <h2 style="color: var(--primary-color); margin-bottom: 1rem;">Error</h2>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">${message}</p>
                <a href="index.html#projects" style="
                    display: inline-block;
                    margin-top: 2rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                ">← Back to Projects</a>
            </div>
        `;
    }
}

// Initialize project detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetail();
});

// Export for potential use in other scripts
window.ProjectDetail = ProjectDetail;