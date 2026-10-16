// Resume Data & Firestore Service Module
import { db } from "../firebase-config.js";
import { PortfolioService } from "./portfolio-service.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

let cachedResume = null;

// Dynamic Fallback Generator reusing Profile info
async function getFallbackResume() {
  const profile = await PortfolioService.getProfile();

  return {
    personal: {
      name: profile.name || "Shivam Lodhi",
      title: profile.headline || "Software Engineer",
      location: "India",
      email: profile.email || "shivam@example.com",
      phone: "",
      website: "",
      githubUrl: profile.githubUrl || "https://github.com/therockshivam",
      linkedinUrl: "",
      profileImageUrl: profile.profileImageUrl || ""
    },
    summary: profile.bio ? profile.bio.replace(/<[^>]*>?/gm, '') : "Creative software engineer specialized in building web applications, Spring Boot backends, and modern user interfaces.",
    experience: [
      {
        id: "exp_1",
        company: "Personal Projects & Open Source",
        position: "Software Engineer",
        location: "India",
        startDate: "2023-01",
        endDate: "",
        current: true,
        description: "Designing and developing productivity tools, web utilities, and desktop applications.",
        responsibilities: [
          "Developed SmartBill application using Java Swing & Spring Boot.",
          "Engineered lightweight web utilities and interactive developer tools.",
          "Hosted portfolio & micro-tools on static GitHub Pages with serverless Firebase integration."
        ],
        technologies: ["Java", "Spring Boot", "JavaScript", "HTML/CSS", "Firebase"],
        displayOrder: 1
      }
    ],
    education: [
      {
        id: "edu_1",
        institution: "University / Institute",
        degree: "Bachelor of Technology (B.Tech)",
        fieldOfStudy: "Computer Science & Engineering",
        location: "India",
        startDate: "2019",
        endDate: "2023",
        description: "Specialized in Software Engineering, Data Structures, Algorithms, and Web Development.",
        displayOrder: 1
      }
    ],
    skills: {
      programmingLanguages: ["Java", "JavaScript (ES6+)", "SQL", "HTML5/CSS3"],
      frameworks: ["Spring Boot", "Swing", "Angular"],
      databases: ["PostgreSQL", "Cloud Firestore", "MySQL"],
      cloud: ["Firebase Auth", "Firestore", "Firebase Storage"],
      devops: ["Docker", "Nginx", "Git", "GitHub Actions"],
      tools: ["VS Code", "Postman", "IntelliJ IDEA"],
      other: ["REST API Design", "Responsive Web Design", "Defensive Programming"]
    },
    projects: [
      {
        id: "proj_1",
        name: "SmartBill",
        description: "A Java desktop billing app built using Swing & Spring Boot for automated invoice creation.",
        technologies: ["Java", "Swing", "Spring Boot"],
        githubUrl: "https://github.com/therockshivam",
        liveUrl: "#",
        displayOrder: 1
      },
      {
        id: "proj_2",
        name: "ChatterBox",
        description: "An Angular-based chat app made for smooth real-time conversations.",
        technologies: ["Angular", "TypeScript", "RxJS"],
        githubUrl: "https://github.com/therockshivam",
        liveUrl: "#",
        displayOrder: 2
      }
    ],
    certifications: [
      {
        id: "cert_1",
        name: "Full Stack Software Engineering",
        issuer: "Software Academy",
        issueDate: "2023",
        credentialUrl: "",
        displayOrder: 1
      }
    ],
    achievements: [
      {
        id: "ach_1",
        title: "Developer Community Educator",
        description: "Created developer tools and technical cheatsheets helping thousands of learners.",
        displayOrder: 1
      }
    ],
    languages: [
      {
        id: "lang_1",
        name: "English",
        proficiency: "Full Professional Proficiency",
        displayOrder: 1
      }
    ],
    published: true,
    updatedAt: new Date().toISOString()
  };
}

export const ResumeService = {
  /**
   * Fetches resume from Firestore with caching & fallback support
   * @param {boolean} includeDrafts - If false, returns null when resume is unpublished
   */
  async getResume(includeDrafts = false) {
    if (cachedResume && (!includeDrafts ? cachedResume.published !== false : true)) {
      return cachedResume;
    }

    try {
      const docRef = doc(db, "resume", "main");
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        cachedResume = data;

        if (!includeDrafts && data.published === false) {
          return null; // Public visitors cannot access draft resumes
        }
        return cachedResume;
      }
    } catch (err) {
      console.warn("Firestore resume fetch skipped/failed, using fallback:", err.message);
    }

    // Fallback data for initial rendering
    const fallback = await getFallbackResume();
    if (!includeDrafts && fallback.published === false) {
      return null;
    }
    cachedResume = fallback;
    return cachedResume;
  },

  /**
   * Saves updated resume draft to Firestore
   */
  async saveResume(resumeData) {
    if (!resumeData || typeof resumeData !== "object") {
      throw new Error("Invalid resume payload provided.");
    }

    cachedResume = null; // Invalidate cache
    const docRef = doc(db, "resume", "main");

    const payload = {
      ...resumeData,
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, payload, { merge: true });
    cachedResume = payload;
    return true;
  },

  /**
   * Toggle published state to TRUE
   */
  async publishResume() {
    return await this.saveResume({ published: true });
  },

  /**
   * Toggle published state to FALSE
   */
  async unpublishResume() {
    return await this.saveResume({ published: false });
  },

  /**
   * Export resume object as a downloadable JSON backup
   */
  exportResumeJSON(resumeData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const fileName = `${(resumeData?.personal?.name || 'Shivam_Lodhi').replace(/[^a-zA-Z0-9]/g, '_')}_Resume.json`;
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
