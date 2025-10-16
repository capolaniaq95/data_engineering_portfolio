#!/usr/bin/env python3
"""
Real-time ETL Pipeline for Project Data Processing
Processes project data and generates dynamic content for the portfolio website.
"""

import json
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import hashlib
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('etl/logs/pipeline.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ProjectETLPipeline:
    """ETL Pipeline for processing project data"""

    def __init__(self, data_dir: str = "assets/data", output_dir: str = "etl/output"):
        self.data_dir = Path(data_dir)
        self.output_dir = Path(output_dir)
        self.raw_data_path = self.data_dir / "projects.json"
        self.processed_data_path = self.output_dir / "processed_projects.json"
        self.analytics_path = self.output_dir / "project_analytics.json"

        # Create directories if they don't exist
        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / "logs").mkdir(parents=True, exist_ok=True)

    def extract(self) -> List[Dict[str, Any]]:
        """Extract project data from JSON file"""
        try:
            logger.info(f"Extracting data from {self.raw_data_path}")

            if not self.raw_data_path.exists():
                raise FileNotFoundError(f"Data file not found: {self.raw_data_path}")

            with open(self.raw_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            logger.info(f"Extracted {len(data)} projects")
            return data

        except Exception as e:
            logger.error(f"Error during extraction: {str(e)}")
            raise

    def transform(self, projects: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Transform and enrich project data"""
        try:
            logger.info("Transforming project data")

            transformed_projects = []
            analytics = {
                "total_projects": len(projects),
                "categories": {},
                "technologies": {},
                "status_distribution": {},
                "recent_projects": [],
                "featured_projects": [],
                "processing_timestamp": datetime.now().isoformat(),
                "data_quality_metrics": {}
            }

            for project in projects:
                # Validate and enrich project data
                enriched_project = self._enrich_project_data(project)

                # Update analytics
                self._update_analytics(analytics, enriched_project)

                transformed_projects.append(enriched_project)

            # Generate insights
            analytics["insights"] = self._generate_insights(analytics)

            logger.info(f"Transformed {len(transformed_projects)} projects")
            return {
                "projects": transformed_projects,
                "analytics": analytics
            }

        except Exception as e:
            logger.error(f"Error during transformation: {str(e)}")
            raise

    def _enrich_project_data(self, project: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich individual project data with computed fields"""
        enriched = project.copy()

        # Generate slug if not present
        if 'slug' not in enriched:
            enriched['slug'] = self._generate_slug(project['title'])

        # Calculate project duration in days
        if 'startDate' in project and 'endDate' in project:
            enriched['duration_days'] = self._calculate_duration(
                project['startDate'], project['endDate']
            )

        # Generate content hash for change detection
        enriched['content_hash'] = self._generate_content_hash(project)

        # Add SEO metadata
        enriched['seo_metadata'] = self._generate_seo_metadata(project)

        # Validate data quality
        enriched['data_quality_score'] = self._calculate_data_quality_score(project)

        # Add formatted description for display
        enriched['formatted_description'] = self._format_description(project.get('shortDescription', ''))

        return enriched

    def _update_analytics(self, analytics: Dict[str, Any], project: Dict[str, Any]):
        """Update analytics data with project information"""
        # Category distribution
        category = project.get('category', 'uncategorized')
        analytics['categories'][category] = analytics['categories'].get(category, 0) + 1

        # Technology frequency
        for tech in project.get('technologies', []):
            analytics['technologies'][tech] = analytics['technologies'].get(tech, 0) + 1

        # Status distribution
        status = project.get('status', 'unknown')
        analytics['status_distribution'][status] = analytics['status_distribution'].get(status, 0) + 1

        # Recent projects (last 6 months)
        if self._is_recent_project(project):
            analytics['recent_projects'].append({
                'id': project['id'],
                'title': project['title'],
                'category': project.get('category', ''),
                'startDate': project.get('startDate', '')
            })

        # Featured projects
        if project.get('featured', False):
            analytics['featured_projects'].append({
                'id': project['id'],
                'title': project['title'],
                'category': project.get('category', ''),
                'technologies': project.get('technologies', [])[:3]  # Top 3 technologies
            })

    def _generate_insights(self, analytics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate insights from analytics data"""
        insights = {}

        # Most used technology
        if analytics['technologies']:
            most_used_tech = max(analytics['technologies'].items(), key=lambda x: x[1])
            insights['most_used_technology'] = {
                'name': most_used_tech[0],
                'count': most_used_tech[1]
            }

        # Most common category
        if analytics['categories']:
            most_common_category = max(analytics['categories'].items(), key=lambda x: x[1])
            insights['most_common_category'] = {
                'name': most_common_category[0],
                'count': most_common_category[1]
            }

        # Project completion rate
        total_projects = analytics['total_projects']
        completed_projects = analytics['status_distribution'].get('completed', 0)
        insights['completion_rate'] = (completed_projects / total_projects * 100) if total_projects > 0 else 0

        # Average project duration (for completed projects)
        completed_projects_data = [
            p for p in analytics.get('projects', [])
            if p.get('status') == 'completed' and 'duration_days' in p
        ]
        if completed_projects_data:
            avg_duration = sum(p['duration_days'] for p in completed_projects_data) / len(completed_projects_data)
            insights['average_project_duration_days'] = round(avg_duration, 1)

        return insights

    def load(self, processed_data: Dict[str, Any]):
        """Load processed data to output files"""
        try:
            logger.info("Loading processed data")

            # Save processed projects
            with open(self.processed_data_path, 'w', encoding='utf-8') as f:
                json.dump(processed_data['projects'], f, indent=2, ensure_ascii=False)

            # Save analytics
            with open(self.analytics_path, 'w', encoding='utf-8') as f:
                json.dump(processed_data['analytics'], f, indent=2, ensure_ascii=False)

            # Generate HTML snippets for dynamic content
            self._generate_html_snippets(processed_data['projects'])

            logger.info(f"Data loaded successfully to {self.output_dir}")

        except Exception as e:
            logger.error(f"Error during loading: {str(e)}")
            raise

    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        slug = title.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)  # Remove special characters
        slug = re.sub(r'[\s_-]+', '-', slug)  # Replace spaces and underscores with hyphens
        return slug.strip('-')

    def _calculate_duration(self, start_date: str, end_date: str) -> int:
        """Calculate project duration in days"""
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            return (end - start).days
        except:
            return 0

    def _generate_content_hash(self, project: Dict[str, Any]) -> str:
        """Generate hash of project content for change detection"""
        content = json.dumps(project, sort_keys=True)
        return hashlib.md5(content.encode()).hexdigest()

    def _generate_seo_metadata(self, project: Dict[str, Any]) -> Dict[str, str]:
        """Generate SEO metadata for project"""
        return {
            'meta_description': project.get('shortDescription', '')[:160],
            'keywords': ', '.join(project.get('technologies', [])[:5]),
            'reading_time': str(min(max(len(project.get('content', {}).get('overview', '')) // 200, 1), 10))  # minutes
        }

    def _calculate_data_quality_score(self, project: Dict[str, Any]) -> float:
        """Calculate data quality score (0-100)"""
        score = 0
        checks = [
            ('title', 10),
            ('shortDescription', 15),
            ('technologies', 10),
            ('content.overview', 20),
            ('content.challenge', 10),
            ('content.solution', 15),
            ('startDate', 5),
            ('endDate', 5),
            ('images', 10)
        ]

        for field, weight in checks:
            if self._get_nested_value(project, field):
                score += weight

        return min(score, 100.0)

    def _get_nested_value(self, obj: Dict[str, Any], path: str) -> Any:
        """Get nested value from object using dot notation"""
        keys = path.split('.')
        current = obj

        for key in keys:
            if isinstance(current, dict) and key in current:
                current = current[key]
            else:
                return None

        return current if current else None

    def _format_description(self, description: str) -> str:
        """Format description for better display"""
        if not description:
            return ""

        # Add line breaks for better readability
        sentences = description.split('. ')
        if len(sentences) > 1:
            return '. '.join(sentences[:-1]) + '.\n\n' + sentences[-1] + '.'
        return description

    def _is_recent_project(self, project: Dict[str, Any]) -> bool:
        """Check if project is recent (within last 6 months)"""
        try:
            end_date = project.get('endDate', project.get('startDate', ''))
            if not end_date:
                return False

            project_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            six_months_ago = datetime.now() - timedelta(days=180)

            return project_date > six_months_ago
        except:
            return False

    def _generate_html_snippets(self, projects: List[Dict[str, Any]]):
        """Generate HTML snippets for dynamic content insertion"""
        snippets_dir = self.output_dir / "snippets"
        snippets_dir.mkdir(exist_ok=True)

        # Generate project cards HTML
        project_cards_html = self._generate_project_cards_html(projects)
        with open(snippets_dir / "project_cards.html", 'w', encoding='utf-8') as f:
            f.write(project_cards_html)

        # Generate featured projects HTML
        featured_projects = [p for p in projects if p.get('featured', False)]
        featured_html = self._generate_featured_projects_html(featured_projects)
        with open(snippets_dir / "featured_projects.html", 'w', encoding='utf-8') as f:
            f.write(featured_html)

        logger.info(f"Generated HTML snippets in {snippets_dir}")

    def _generate_project_cards_html(self, projects: List[Dict[str, Any]]) -> str:
        """Generate HTML for project cards"""
        html = []

        for project in projects:
            html.append(f'''
            <div class="project-card" data-category="{project.get('category', '')}">
                <div class="project-image">
                    <img src="{project.get('thumbnail', 'assets/images/projects/default.jpg')}"
                         alt="{project['title']}" loading="lazy">
                    <div class="project-overlay">
                        <div class="project-links">
                            <a href="project-detail.html?id={project['id']}" class="project-link">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a href="{project.get('githubUrl', '#')}" class="project-link" target="_blank">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">{project['title']}</h3>
                    <p class="project-description">
                        {project.get('shortDescription', '')}
                    </p>
                    <div class="project-tech">
                        {''.join(f'<span class="tech-badge">{tech}</span>' for tech in project.get('technologies', [])[:3])}
                    </div>
                </div>
            </div>
            ''')

        return '\n'.join(html)

    def _generate_featured_projects_html(self, projects: List[Dict[str, Any]]) -> str:
        """Generate HTML for featured projects section"""
        if not projects:
            return ""

        html = ['<div class="featured-projects">']
        html.append('<h2>Featured Projects</h2>')
        html.append('<div class="featured-grid">')

        for project in projects[:3]:  # Show top 3 featured projects
            html.append(f'''
            <div class="featured-project-card">
                <div class="featured-project-image">
                    <img src="{project.get('thumbnail', '')}" alt="{project['title']}" loading="lazy">
                </div>
                <div class="featured-project-content">
                    <h3>{project['title']}</h3>
                    <p>{project.get('shortDescription', '')}</p>
                    <div class="featured-project-tech">
                        {''.join(f'<span class="tech-badge">{tech}</span>' for tech in project.get('technologies', [])[:3])}
                    </div>
                    <a href="project-detail.html?id={project['id']}" class="btn btn-primary">Learn More</a>
                </div>
            </div>
            ''')

        html.append('</div>')
        html.append('</div>')

        return '\n'.join(html)

    def run_pipeline(self) -> Dict[str, Any]:
        """Run the complete ETL pipeline"""
        logger.info("Starting ETL pipeline")

        try:
            # Extract
            raw_data = self.extract()

            # Transform
            processed_data = self.transform(raw_data)

            # Load
            self.load(processed_data)

            logger.info("ETL pipeline completed successfully")

            return {
                "status": "success",
                "projects_processed": len(processed_data['projects']),
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"ETL pipeline failed: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

def main():
    """Main function to run the ETL pipeline"""
    pipeline = ProjectETLPipeline()
    result = pipeline.run_pipeline()

    if result["status"] == "success":
        print(f"✅ Pipeline completed successfully! Processed {result['projects_processed']} projects.")
    else:
        print(f"❌ Pipeline failed: {result['error']}")
        exit(1)

if __name__ == "__main__":
    main()