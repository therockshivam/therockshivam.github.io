/**
 * Canonical ATS-Friendly Resume Renderer Engine
 * Provides a single source of truth for rendering HTML across Public View, Admin Preview, and PDF/Print.
 */

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const ResumeRenderer = {
  /**
   * Renders a complete ATS-optimized HTML string from structured resume data.
   * @param {Object} data - Resume data schema object
   * @param {Object} options - Render options { isPrint: false }
   * @returns {string} Clean HTML string
   */
  renderHTML(data, options = {}) {
    if (!data) return '<div class="resume-error">No resume data available.</div>';

    const p = data.personal || {};
    const summary = data.summary || "";
    const expList = Array.isArray(data.experience) ? [...data.experience].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];
    const eduList = Array.isArray(data.education) ? [...data.education].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];
    const projList = Array.isArray(data.projects) ? [...data.projects].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];
    const certList = Array.isArray(data.certifications) ? [...data.certifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];
    const achList = Array.isArray(data.achievements) ? [...data.achievements].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];
    const langList = Array.isArray(data.languages) ? [...data.languages].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];
    const skills = data.skills || {};

    // Header Metadata Contact Items
    const contactItems = [];
    if (p.location) contactItems.push(`<span>📍 ${escapeHtml(p.location)}</span>`);
    if (p.email) contactItems.push(`<span>✉️ <a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></span>`);
    if (p.phone) contactItems.push(`<span>📞 ${escapeHtml(p.phone)}</span>`);
    if (p.website) contactItems.push(`<span>🌐 <a href="${escapeHtml(p.website)}" target="_blank" rel="noopener">${escapeHtml(p.website)}</a></span>`);
    if (p.githubUrl) contactItems.push(`<span>💻 <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener">GitHub</a></span>`);
    if (p.linkedinUrl) contactItems.push(`<span>🔗 <a href="${escapeHtml(p.linkedinUrl)}" target="_blank" rel="noopener">LinkedIn</a></span>`);

    return `
      <div class="ats-resume-container ${options.isPrint ? 'print-mode' : ''}">
        
        <!-- Header Section -->
        <header class="ats-resume-header">
          <h1 class="ats-name">${escapeHtml(p.name || "Shivam Lodhi")}</h1>
          ${p.title ? `<h2 class="ats-title">${escapeHtml(p.title)}</h2>` : ''}
          <div class="ats-contact-bar">
            ${contactItems.join(' <span class="sep">•</span> ')}
          </div>
        </header>

        <!-- Professional Summary -->
        ${summary ? `
          <section class="ats-section">
            <h2 class="ats-section-title">PROFESSIONAL SUMMARY</h2>
            <div class="ats-section-divider"></div>
            <p class="ats-summary-text">${escapeHtml(summary)}</p>
          </section>
        ` : ''}

        <!-- Work Experience -->
        ${expList.length > 0 ? `
          <section class="ats-section">
            <h2 class="ats-section-title">WORK EXPERIENCE</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-items-list">
              ${expList.map(exp => `
                <article class="ats-entry">
                  <div class="ats-entry-header">
                    <div>
                      <h3 class="ats-entry-title">${escapeHtml(exp.position || "Position")}</h3>
                      <div class="ats-company">${escapeHtml(exp.company || "Company")} ${exp.location ? `<span class="ats-loc">| ${escapeHtml(exp.location)}</span>` : ''}</div>
                    </div>
                    <div class="ats-date">
                      ${escapeHtml(exp.startDate || '')} ${exp.startDate || exp.endDate ? '–' : ''} ${exp.current ? 'Present' : escapeHtml(exp.endDate || '')}
                    </div>
                  </div>
                  ${exp.description ? `<p class="ats-entry-desc">${escapeHtml(exp.description)}</p>` : ''}
                  ${Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? `
                    <ul class="ats-bullet-list">
                      ${exp.responsibilities.filter(r => r && r.trim()).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                    </ul>
                  ` : ''}
                  ${Array.isArray(exp.technologies) && exp.technologies.length > 0 ? `
                    <div class="ats-tech-tags">
                      <strong>Technologies:</strong> ${exp.technologies.map(t => `<span class="ats-tag">${escapeHtml(t)}</span>`).join(', ')}
                    </div>
                  ` : ''}
                </article>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Technical Skills -->
        ${this.hasSkills(skills) ? `
          <section class="ats-section">
            <h2 class="ats-section-title">TECHNICAL SKILLS</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-skills-grid">
              ${this.renderSkillCategory("Languages", skills.programmingLanguages)}
              ${this.renderSkillCategory("Frameworks & Libraries", skills.frameworks)}
              ${this.renderSkillCategory("Databases", skills.databases)}
              ${this.renderSkillCategory("Cloud & Platforms", skills.cloud)}
              ${this.renderSkillCategory("DevOps & CI/CD", skills.devops)}
              ${this.renderSkillCategory("Developer Tools", skills.tools)}
              ${this.renderSkillCategory("Other Skills", skills.other)}
            </div>
          </section>
        ` : ''}

        <!-- Featured Projects -->
        ${projList.length > 0 ? `
          <section class="ats-section">
            <h2 class="ats-section-title">KEY PROJECTS</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-items-list">
              ${projList.map(proj => `
                <article class="ats-entry">
                  <div class="ats-entry-header">
                    <h3 class="ats-entry-title">
                      ${escapeHtml(proj.name)} 
                      ${proj.githubUrl ? `<small>[<a href="${escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">Code</a>]</small>` : ''}
                      ${proj.liveUrl && proj.liveUrl !== '#' ? `<small>[<a href="${escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener">Live Demo</a>]</small>` : ''}
                    </h3>
                  </div>
                  ${proj.description ? `<p class="ats-entry-desc">${escapeHtml(proj.description)}</p>` : ''}
                  ${Array.isArray(proj.technologies) && proj.technologies.length > 0 ? `
                    <div class="ats-tech-tags">
                      <strong>Built with:</strong> ${proj.technologies.map(t => `<span class="ats-tag">${escapeHtml(t)}</span>`).join(', ')}
                    </div>
                  ` : ''}
                </article>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Education -->
        ${eduList.length > 0 ? `
          <section class="ats-section">
            <h2 class="ats-section-title">EDUCATION</h2>
            <div class="ats-section-divider"></div>
            <div class="ats-items-list">
              ${eduList.map(edu => `
                <article class="ats-entry">
                  <div class="ats-entry-header">
                    <div>
                      <h3 class="ats-entry-title">${escapeHtml(edu.degree)} ${edu.fieldOfStudy ? `in ${escapeHtml(edu.fieldOfStudy)}` : ''}</h3>
                      <div class="ats-company">${escapeHtml(edu.institution)} ${edu.location ? `| ${escapeHtml(edu.location)}` : ''}</div>
                    </div>
                    <div class="ats-date">
                      ${escapeHtml(edu.startDate || '')} ${edu.startDate || edu.endDate ? '–' : ''} ${escapeHtml(edu.endDate || '')}
                    </div>
                  </div>
                  ${edu.description ? `<p class="ats-entry-desc">${escapeHtml(edu.description)}</p>` : ''}
                </article>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Certifications -->
        ${certList.length > 0 ? `
          <section class="ats-section">
            <h2 class="ats-section-title">CERTIFICATIONS</h2>
            <div class="ats-section-divider"></div>
            <ul class="ats-bullet-list">
              ${certList.map(cert => `
                <li>
                  <strong>${escapeHtml(cert.name)}</strong> – ${escapeHtml(cert.issuer || '')} ${cert.issueDate ? `(${escapeHtml(cert.issueDate)})` : ''}
                  ${cert.credentialUrl ? `<a href="${escapeHtml(cert.credentialUrl)}" target="_blank" rel="noopener">[Verify]</a>` : ''}
                </li>
              `).join('')}
            </ul>
          </section>
        ` : ''}

        <!-- Achievements & Languages -->
        ${achList.length > 0 || langList.length > 0 ? `
          <div class="ats-two-col">
            ${achList.length > 0 ? `
              <section class="ats-section">
                <h2 class="ats-section-title">ACHIEVEMENTS</h2>
                <div class="ats-section-divider"></div>
                <ul class="ats-bullet-list">
                  ${achList.map(a => `<li><strong>${escapeHtml(a.title)}:</strong> ${escapeHtml(a.description)}</li>`).join('')}
                </ul>
              </section>
            ` : ''}

            ${langList.length > 0 ? `
              <section class="ats-section">
                <h2 class="ats-section-title">LANGUAGES</h2>
                <div class="ats-section-divider"></div>
                <ul class="ats-bullet-list">
                  ${langList.map(l => `<li><strong>${escapeHtml(l.name)}:</strong> ${escapeHtml(l.proficiency)}</li>`).join('')}
                </ul>
              </section>
            ` : ''}
          </div>
        ` : ''}

      </div>
    `;
  },

  hasSkills(skills) {
    if (!skills) return false;
    return Object.values(skills).some(arr => Array.isArray(arr) && arr.length > 0);
  },

  renderSkillCategory(label, list) {
    if (!Array.isArray(list) || list.length === 0) return '';
    return `
      <div class="ats-skill-row">
        <strong class="ats-skill-label">${escapeHtml(label)}:</strong>
        <span class="ats-skill-values">${list.map(s => escapeHtml(s)).join(', ')}</span>
      </div>
    `;
  }
};
