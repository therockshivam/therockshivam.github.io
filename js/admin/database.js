// Admin Dialogs & Modal Forms Module
import { PortfolioService } from "../services/portfolio-service.js";
import { StorageService } from "../services/storage-service.js";
import { UI } from "./ui.js";

export const DatabaseManager = {

    /**
     * Show Modal Dialog with custom HTML content
     */
    showModal(title, formHtml, onSubmitCallback) {
        const modalContainer = document.getElementById("modalContainer");
        if (!modalContainer) return;

        modalContainer.innerHTML = `
            <div class="card" style="width: 520px; max-width: 90vw; max-height: 85vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>${title}</h3>
                    <button id="closeModalBtn" style="background: transparent; color: var(--muted); font-size: 20px;">&times;</button>
                </div>
                <div id="modalError" style="display:none; color:#f87171; background:rgba(239, 68, 68, 0.15); padding:10px; border-radius:8px; margin-bottom:15px;"></div>
                <form id="modalForm">
                    ${formHtml}
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button type="button" id="cancelModalBtn" style="background: var(--border); color: white; padding: 10px 18px;">Cancel</button>
                        <button type="submit" id="saveModalBtn" style="background: var(--primary); color: white; padding: 10px 20px;">Save</button>
                    </div>
                </form>
            </div>
        `;

        modalContainer.style.display = "flex";

        document.getElementById("closeModalBtn")?.addEventListener("click", () => this.closeModal());
        document.getElementById("cancelModalBtn")?.addEventListener("click", () => this.closeModal());

        const form = document.getElementById("modalForm");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("saveModalBtn");
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Saving...";
                await onSubmitCallback(form);
                this.closeModal();
            } catch (err) {
                console.error("Form submit error:", err);
                const errDiv = document.getElementById("modalError");
                if (errDiv) {
                    errDiv.textContent = err.message || "Failed to save item.";
                    errDiv.style.display = "block";
                }
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    },

    closeModal() {
        const modalContainer = document.getElementById("modalContainer");
        if (modalContainer) {
            modalContainer.style.display = "none";
            modalContainer.innerHTML = "";
        }
    },

    /**
     * Show Modal for Add / Edit Project
     */
    showProjectModal(project = null) {
        const isEdit = !!project;
        const html = `
            <div>
                <label>Project Title *</label>
                <input type="text" id="p-title" required value="${project?.title || ''}" placeholder="e.g. SmartBill">
            </div>
            <div>
                <label>Description *</label>
                <textarea id="p-desc" required rows="3" placeholder="Brief overview of the project...">${project?.description || ''}</textarea>
            </div>
            <div>
                <label>Technologies (Comma separated)</label>
                <input type="text" id="p-tech" value="${(project?.technologies || []).join(', ')}" placeholder="Java, Spring Boot, Swing">
            </div>
            <div>
                <label>GitHub Repository URL</label>
                <input type="url" id="p-github" value="${project?.githubUrl || ''}" placeholder="https://github.com/...">
            </div>
            <div>
                <label>Live App URL</label>
                <input type="text" id="p-live" value="${project?.liveUrl || '#'}" placeholder="https://...">
            </div>
            <div>
                <label>Project Image (Upload File or paste Image URL)</label>
                <input type="file" id="p-file" accept="image/*" style="margin-bottom:8px;">
                <input type="text" id="p-imgurl" value="${project?.imageUrl || ''}" placeholder="Or paste image URL https://...">
            </div>
            <div>
                <label>Display Order (Number)</label>
                <input type="number" id="p-order" value="${project?.displayOrder || 1}">
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                <input type="checkbox" id="p-published" ${project?.published !== false ? 'checked' : ''} style="width:auto; margin:0;">
                <label for="p-published" style="margin:0;">Publish immediately on public portfolio</label>
            </div>
        `;

        this.showModal(isEdit ? "Edit Project" : "Add New Project", html, async (form) => {
            let finalImgUrl = document.getElementById("p-imgurl").value.trim();
            const fileInput = document.getElementById("p-file");

            if (fileInput?.files?.length > 0) {
                finalImgUrl = await StorageService.uploadFile(fileInput.files[0], "projects");
            }

            const techString = document.getElementById("p-tech").value;
            const techArray = techString ? techString.split(',').map(s => s.trim()).filter(Boolean) : [];

            const payload = {
                title: document.getElementById("p-title").value.trim(),
                description: document.getElementById("p-desc").value.trim(),
                technologies: techArray,
                githubUrl: document.getElementById("p-github").value.trim(),
                liveUrl: document.getElementById("p-live").value.trim() || "#",
                imageUrl: finalImgUrl || "#",
                displayOrder: parseInt(document.getElementById("p-order").value) || 1,
                published: document.getElementById("p-published").checked
            };

            await PortfolioService.saveProject(payload, project?.id || null);
            UI.loadProjects();
        });
    },

    /**
     * Show Modal for Add / Edit Tool
     */
    showToolModal(tool = null) {
        const isEdit = !!tool;
        const html = `
            <div>
                <label>Tool Title *</label>
                <input type="text" id="t-title" required value="${tool?.title || ''}" placeholder="e.g. 🧠 Grammar AI">
            </div>
            <div>
                <label>Description *</label>
                <textarea id="t-desc" required rows="3" placeholder="What does this tool do?">${tool?.description || ''}</textarea>
            </div>
            <div>
                <label>Tool Link Path *</label>
                <input type="text" id="t-link" required value="${tool?.link || ''}" placeholder="tools/grammar-correction-system/index.html">
            </div>
            <div>
                <label>Status</label>
                <select id="t-status">
                    <option value="live" ${tool?.status === 'live' ? 'selected' : ''}>LIVE</option>
                    <option value="coming-soon" ${tool?.status === 'coming-soon' ? 'selected' : ''}>Coming Soon</option>
                </select>
            </div>
            <div>
                <label>Display Order</label>
                <input type="number" id="t-order" value="${tool?.displayOrder || 1}">
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                <input type="checkbox" id="t-published" ${tool?.published !== false ? 'checked' : ''} style="width:auto; margin:0;">
                <label for="t-published" style="margin:0;">Publish on public portfolio</label>
            </div>
        `;

        this.showModal(isEdit ? "Edit Tool" : "Add New Tool", html, async () => {
            const payload = {
                title: document.getElementById("t-title").value.trim(),
                description: document.getElementById("t-desc").value.trim(),
                link: document.getElementById("t-link").value.trim(),
                status: document.getElementById("t-status").value,
                displayOrder: parseInt(document.getElementById("t-order").value) || 1,
                published: document.getElementById("t-published").checked
            };

            await PortfolioService.saveTool(payload, tool?.id || null);
            UI.loadTools();
        });
    },

    /**
     * Show Modal for Add / Edit Vault Note
     */
    showNoteModal(note = null) {
        const isEdit = !!note;
        const html = `
            <div>
                <label>Note Title *</label>
                <input type="text" id="n-title" required value="${note?.title || ''}" placeholder="e.g. Docker Commands">
            </div>
            <div>
                <label>Description *</label>
                <textarea id="n-desc" required rows="3" placeholder="Brief summary of notes...">${note?.description || ''}</textarea>
            </div>
            <div>
                <label>Note Link Path *</label>
                <input type="text" id="n-link" required value="${note?.link || ''}" placeholder="notes/docker.html">
            </div>
            <div>
                <label>Category</label>
                <input type="text" id="n-cat" value="${note?.category || 'General'}" placeholder="DevOps, Database, Java">
            </div>
            <div>
                <label>Display Order</label>
                <input type="number" id="n-order" value="${note?.displayOrder || 1}">
            </div>
            <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                <input type="checkbox" id="n-published" ${note?.published !== false ? 'checked' : ''} style="width:auto; margin:0;">
                <label for="n-published" style="margin:0;">Publish on public portfolio</label>
            </div>
        `;

        this.showModal(isEdit ? "Edit Vault Note" : "Add New Vault Note", html, async () => {
            const payload = {
                title: document.getElementById("n-title").value.trim(),
                description: document.getElementById("n-desc").value.trim(),
                link: document.getElementById("n-link").value.trim(),
                category: document.getElementById("n-cat").value.trim() || "General",
                displayOrder: parseInt(document.getElementById("n-order").value) || 1,
                published: document.getElementById("n-published").checked
            };

            await PortfolioService.saveVaultNote(payload, note?.id || null);
            UI.loadNotes();
        });
    }
};