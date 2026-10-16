// Admin UI Renderer Module
import { PortfolioService } from "../services/portfolio-service.js";
import { StorageService } from "../services/storage-service.js";
import { ResumeService } from "../services/resume-service.js";
import { DatabaseManager } from "./database.js";

export const UI = {

    /**
     * Set header title & active status
     */
    setHeader(title) {
        const titleEl = document.getElementById("pageTitle");
        if (titleEl) titleEl.innerText = title;
    },

    /**
     * Dashboard Overview View
     */
    async loadDashboard() {
        this.setHeader("Dashboard Overview");

        const content = document.getElementById("content");
        if (!content) return;

        content.innerHTML = `
            <div class="cards">
                <div class="card">
                    <h4>Total Projects</h4>
                    <h2 id="projectCount">...</h2>
                </div>
                <div class="card">
                    <h4>Total Tools</h4>
                    <h2 id="toolCount">...</h2>
                </div>
                <div class="card">
                    <h4>Vault Notes</h4>
                    <h2 id="noteCount">...</h2>
                </div>
                <div class="card">
                    <h4>Contact Messages</h4>
                    <h2 id="messageCount">...</h2>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <h2>Quick Actions & Collections</h2>
                </div>
                <div id="tableList"></div>
            </div>
        `;

        try {
            const [projects, tools, notes, messages] = await Promise.all([
                PortfolioService.getProjects(true),
                PortfolioService.getTools(true),
                PortfolioService.getVaultNotes(true),
                PortfolioService.getContactMessages()
            ]);

            document.getElementById("projectCount").innerText = projects.length;
            document.getElementById("toolCount").innerText = tools.length;
            document.getElementById("noteCount").innerText = notes.length;
            document.getElementById("messageCount").innerText = messages.length;

            const grid = document.getElementById("tableList");
            grid.innerHTML = `
                <div class="table-card" onclick="document.querySelector('[data-page=projects]').click()">
                    <h3>🛠️ Projects</h3>
                    <p>${projects.length} Items Configured</p>
                    <div class="manage">Manage Projects →</div>
                </div>
                <div class="table-card" onclick="document.querySelector('[data-page=tools]').click()">
                    <h3>🧰 Tools</h3>
                    <p>${tools.length} Tools Listed</p>
                    <div class="manage">Manage Tools →</div>
                </div>
                <div class="table-card" onclick="document.querySelector('[data-page=notes]').click()">
                    <h3>📚 Vault Notes</h3>
                    <p>${notes.length} Cheatsheets</p>
                    <div class="manage">Manage Notes →</div>
                </div>
                <div class="table-card" onclick="document.querySelector('[data-page=profile]').click()">
                    <h3>👤 Portfolio Profile</h3>
                    <p>Edit Hero & Bio</p>
                    <div class="manage">Edit Profile →</div>
                </div>
                <div class="table-card" onclick="document.querySelector('[data-page=messages]').click()">
                    <h3>📬 Messages</h3>
                    <p>${messages.length} Submissions</p>
                    <div class="manage">View Messages →</div>
                </div>
            `;
        } catch (err) {
            console.error("Error loading dashboard overview:", err);
        }
    },

    /**
     * Projects Management View
     */
    async loadProjects() {
        this.setHeader("Manage Projects");

        const content = document.getElementById("content");
        content.innerHTML = `
            <div class="section-header">
                <h2>Projects (${0})</h2>
                <button id="addProjectBtn" style="background:var(--primary); color:white; padding:10px 18px;">
                    <i class="fa-solid fa-plus"></i> Add New Project
                </button>
            </div>
            <div id="projectsList" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
                <p>Loading projects...</p>
            </div>
        `;

        document.getElementById("addProjectBtn")?.addEventListener("click", () => {
            DatabaseManager.showProjectModal();
        });

        try {
            const projects = await PortfolioService.getProjects(true);
            const listContainer = document.getElementById("projectsList");

            if (projects.length === 0) {
                listContainer.innerHTML = `<p>No projects found. Click "Add New Project" to create one.</p>`;
                return;
            }

            listContainer.innerHTML = projects.map(p => `
                <div class="card" style="position:relative;">
                    <span style="position:absolute; top:15px; right:15px; padding:3px 8px; border-radius:12px; font-size:12px; background:${p.published !== false ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${p.published !== false ? '#34d399' : '#f87171'}; font-weight:600;">
                        ${p.published !== false ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    <h4>${p.title}</h4>
                    <p style="color:var(--muted); font-size:14px; margin-bottom:12px;">${p.description}</p>
                    <small style="display:block; margin-bottom:15px; color:#cbd5e1;">Tech: ${(p.technologies || []).join(', ')}</small>
                    <div style="display:flex; gap:10px; margin-top:15px;">
                        <button class="edit-proj-btn" data-id="${p.id}" style="background:var(--border); color:white; padding:6px 12px; font-size:13px;">Edit</button>
                        <button class="delete-proj-btn" data-id="${p.id}" style="background:rgba(239,68,68,0.2); color:#f87171; padding:6px 12px; font-size:13px;">Delete</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll(".edit-proj-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    const p = projects.find(x => x.id === id);
                    if (p) DatabaseManager.showProjectModal(p);
                });
            });

            document.querySelectorAll(".delete-proj-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    if (confirm("Are you sure you want to delete this project?")) {
                        await PortfolioService.deleteProject(btn.dataset.id);
                        this.loadProjects();
                    }
                });
            });

        } catch (err) {
            console.error("Error loading projects:", err);
        }
    },

    /**
     * Tools Management View
     */
    async loadTools() {
        this.setHeader("Manage Tools");

        const content = document.getElementById("content");
        content.innerHTML = `
            <div class="section-header">
                <h2>Tools Suite</h2>
                <button id="addToolBtn" style="background:var(--primary); color:white; padding:10px 18px;">
                    <i class="fa-solid fa-plus"></i> Add New Tool
                </button>
            </div>
            <div id="toolsList" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                <p>Loading tools...</p>
            </div>
        `;

        document.getElementById("addToolBtn")?.addEventListener("click", () => {
            DatabaseManager.showToolModal();
        });

        try {
            const tools = await PortfolioService.getTools(true);
            const container = document.getElementById("toolsList");

            if (tools.length === 0) {
                container.innerHTML = `<p>No tools configured.</p>`;
                return;
            }

            container.innerHTML = tools.map(t => `
                <div class="card">
                    <h4>${t.title}</h4>
                    <p style="color:var(--muted); font-size:14px; margin-bottom:10px;">${t.description}</p>
                    <small style="color:#38bdf8;">Path: ${t.link}</small>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                        <span style="font-size:12px; padding:3px 8px; border-radius:10px; background:${t.status === 'live' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color:${t.status === 'live' ? '#34d399' : '#fbbf24'};">
                            ${t.status === 'live' ? 'LIVE' : 'COMING SOON'}
                        </span>
                        <div>
                            <button class="edit-tool-btn" data-id="${t.id}" style="background:var(--border); color:white; padding:6px 10px; font-size:12px;">Edit</button>
                            <button class="del-tool-btn" data-id="${t.id}" style="background:rgba(239,68,68,0.2); color:#f87171; padding:6px 10px; font-size:12px;">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll(".edit-tool-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const t = tools.find(x => x.id === btn.dataset.id);
                    if (t) DatabaseManager.showToolModal(t);
                });
            });

            document.querySelectorAll(".del-tool-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    if (confirm("Delete this tool?")) {
                        await PortfolioService.deleteTool(btn.dataset.id);
                        this.loadTools();
                    }
                });
            });

        } catch (err) {
            console.error("Error loading tools:", err);
        }
    },

    /**
     * Vault Notes Management View
     */
    async loadNotes() {
        this.setHeader("Manage Vault Notes");

        const content = document.getElementById("content");
        content.innerHTML = `
            <div class="section-header">
                <h2>Vault Notes & Cheatsheets</h2>
                <button id="addNoteBtn" style="background:var(--primary); color:white; padding:10px 18px;">
                    <i class="fa-solid fa-plus"></i> Add Note
                </button>
            </div>
            <div id="notesList" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                <p>Loading notes...</p>
            </div>
        `;

        document.getElementById("addNoteBtn")?.addEventListener("click", () => {
            DatabaseManager.showNoteModal();
        });

        try {
            const notes = await PortfolioService.getVaultNotes(true);
            const container = document.getElementById("notesList");

            if (notes.length === 0) {
                container.innerHTML = `<p>No notes published.</p>`;
                return;
            }

            container.innerHTML = notes.map(n => `
                <div class="card">
                    <h4>${n.title}</h4>
                    <p style="color:var(--muted); font-size:14px; margin-bottom:10px;">${n.description}</p>
                    <small style="color:#38bdf8;">Category: ${n.category || 'General'}</small>
                    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:15px;">
                        <button class="edit-note-btn" data-id="${n.id}" style="background:var(--border); color:white; padding:6px 10px; font-size:12px;">Edit</button>
                        <button class="del-note-btn" data-id="${n.id}" style="background:rgba(239,68,68,0.2); color:#f87171; padding:6px 10px; font-size:12px;">Delete</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll(".edit-note-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const n = notes.find(x => x.id === btn.dataset.id);
                    if (n) DatabaseManager.showNoteModal(n);
                });
            });

            document.querySelectorAll(".del-note-btn").forEach(btn => {
                btn.addEventListener("click", async () => {
                    if (confirm("Delete this note?")) {
                        await PortfolioService.deleteVaultNote(btn.dataset.id);
                        this.loadNotes();
                    }
                });
            });

        } catch (err) {
            console.error("Error loading notes:", err);
        }
    },

    /**
     * Profile Management View
     */
    async loadProfile() {
        this.setHeader("Edit Portfolio Profile");

        const content = document.getElementById("content");
        content.innerHTML = `<p>Loading profile...</p>`;

        try {
            const profile = await PortfolioService.getProfile();

            content.innerHTML = `
                <div class="card" style="max-width: 650px;">
                    <h2>Profile & Bio Details</h2>
                    <p style="color:var(--muted); margin-bottom:20px;">Update public bio, headline, contact email, and hero typewriter roles.</p>
                    <div id="profStatus" style="display:none; padding:10px; border-radius:8px; margin-bottom:15px;"></div>
                    <form id="profileForm">
                        <div>
                            <label>Name</label>
                            <input type="text" id="prof-name" value="${profile.name || ''}" required>
                        </div>
                        <div>
                            <label>Headline / Subtitle</label>
                            <input type="text" id="prof-headline" value="${profile.headline || ''}">
                        </div>
                        <div>
                            <label>About Me Bio (HTML allowed)</label>
                            <textarea id="prof-bio" rows="4" required>${profile.bio || ''}</textarea>
                        </div>
                        <div>
                            <label>Typewriter Roles (Comma separated)</label>
                            <input type="text" id="prof-roles" value="${(profile.typewriterRoles || []).join(', ')}">
                        </div>
                        <div>
                            <label>Contact Email</label>
                            <input type="email" id="prof-email" value="${profile.email || ''}" required>
                        </div>
                        <div>
                            <label>Profile Image (Upload or Paste URL)</label>
                            <input type="file" id="prof-file" accept="image/*" style="margin-bottom:8px;">
                            <input type="text" id="prof-imgurl" value="${profile.profileImageUrl || ''}">
                        </div>
                        <button type="submit" id="saveProfBtn" style="background:var(--primary); color:white; padding:12px 24px; font-weight:600; margin-top:10px;">
                            Save Profile Changes
                        </button>
                    </form>
                </div>
            `;

            const form = document.getElementById("profileForm");
            form?.addEventListener("submit", async (e) => {
                e.preventDefault();
                const btn = document.getElementById("saveProfBtn");
                const status = document.getElementById("profStatus");

                try {
                    btn.disabled = true;
                    btn.textContent = "Saving...";
                    if (status) status.style.display = "none";

                    let imgUrl = document.getElementById("prof-imgurl").value.trim();
                    const fileInput = document.getElementById("prof-file");

                    if (fileInput?.files?.length > 0) {
                        imgUrl = await StorageService.uploadFile(fileInput.files[0], "profile");
                    }

                    const rolesString = document.getElementById("prof-roles").value;
                    const rolesArray = rolesString ? rolesString.split(',').map(s => s.trim()).filter(Boolean) : [];

                    const payload = {
                        name: document.getElementById("prof-name").value.trim(),
                        headline: document.getElementById("prof-headline").value.trim(),
                        bio: document.getElementById("prof-bio").value.trim(),
                        typewriterRoles: rolesArray,
                        email: document.getElementById("prof-email").value.trim(),
                        profileImageUrl: imgUrl || "#"
                    };

                    await PortfolioService.updateProfile(payload);

                    if (status) {
                        status.textContent = "Profile updated successfully!";
                        status.style.background = "rgba(16,185,129,0.2)";
                        status.style.color = "#34d399";
                        status.style.display = "block";
                    }
                } catch (err) {
                    console.error("Profile update error:", err);
                    if (status) {
                        status.textContent = `Error: ${err.message}`;
                        status.style.background = "rgba(239,68,68,0.2)";
                        status.style.color = "#f87171";
                        status.style.display = "block";
                    }
                } finally {
                    btn.disabled = false;
                    btn.textContent = "Save Profile Changes";
                }
            });

        } catch (err) {
            console.error("Error loading profile:", err);
        }
    },

    /**
     * Contact Messages Submissions View
     */
    async loadMessages() {
        this.setHeader("Submitted Contact Messages");

        const content = document.getElementById("content");
        content.innerHTML = `<p>Loading messages...</p>`;

        try {
            const messages = await PortfolioService.getContactMessages();

            if (messages.length === 0) {
                content.innerHTML = `<p>No contact messages submitted yet.</p>`;
                return;
            }

            content.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:15px; max-width:800px;">
                    ${messages.map(m => `
                        <div class="card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                                <strong>${m.name} (&lt;${m.email}&gt;)</strong>
                                <small style="color:var(--muted);">${m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : 'Recent'}</small>
                            </div>
                            <p style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid var(--border); color:#f8fafc; font-size:14px; white-space:pre-wrap;">${m.message}</p>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (err) {
            console.error("Error loading messages:", err);
        }
    },

    /**
     * Resume Management Editor View
     */
    async loadResumeEditor() {
        this.setHeader("Resume Management");
        const content = document.getElementById("content");
        if (!content) return;
        content.innerHTML = `
            <div class="section-header"><h2>Resume JSON Editor</h2></div>
            <textarea id="resume-json" style="width:100%; height:500px; font-family:monospace;" placeholder="Loading..."></textarea>
            <div style="margin-top:10px;">
                <button id="saveResumeBtn" style="background:var(--primary); color:white; padding:8px 16px;">Save Draft</button>
                <button id="publishResumeBtn" style="background:green; color:white; padding:8px 16px; margin-left:8px;">Publish</button>
                <button id="exportResumeBtn" style="background:var(--border); color:white; padding:8px 16px; margin-left:8px;">Export JSON</button>
            </div>
        `;
        try {
            const resume = await ResumeService.getResume(true);
            document.getElementById("resume-json").value = JSON.stringify(resume, null, 2);
        } catch (err) {
            console.error("Error loading resume:", err);
            document.getElementById("resume-json").value = "";
        }

        document.getElementById("saveResumeBtn")?.addEventListener("click", async () => {
            try {
                const data = JSON.parse(document.getElementById("resume-json").value);
                await ResumeService.saveResume(data);
                alert("Resume draft saved.");
            } catch (e) {
                alert("Invalid JSON: " + e.message);
            }
        });

        document.getElementById("publishResumeBtn")?.addEventListener("click", async () => {
            try {
                const data = JSON.parse(document.getElementById("resume-json").value);
                await ResumeService.saveResume(data);
                await ResumeService.publishResume();
                alert("Resume published.");
            } catch (e) {
                alert("Error publishing: " + e.message);
            }
        });

        document.getElementById("exportResumeBtn")?.addEventListener("click", () => {
            try {
                const data = JSON.parse(document.getElementById("resume-json").value);
                ResumeService.exportResumeJSON(data);
            } catch (e) {
                alert("Invalid JSON: " + e.message);
            }
        });
    },

};