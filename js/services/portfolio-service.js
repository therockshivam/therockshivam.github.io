// Portfolio Data & Firestore Service Module
import { db } from "../firebase-config.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// In-Memory Cache Store to minimize Firestore reads
const cacheStore = {
  profile: null,
  projects: null,
  tools: null,
  vaultNotes: null,
  messages: null
};

// Static Fallback Data
const FALLBACK_PROFILE = {
  name: "Shivam",
  headline: "Creative Software Engineer",
  bio: "I'm Shivam – a creative software engineer, developer of ideas, and a lifelong learner. Whether it’s building apps like SmartBill or crafting beautiful UI experiences, I mix logic with art.",
  typewriterRoles: ["Creative Coder", "Problem Solver", "YouTube Educator", "Tech Explorer"],
  email: "shivam@example.com",
  githubUrl: "https://github.com/therockshivam",
  profileImageUrl: "#",
  resumeUrl: "#"
};

const FALLBACK_PROJECTS = [
  {
    id: "smartbill",
    title: "SmartBill",
    description: "A Java desktop billing app built using Swing & Spring Boot.",
    technologies: ["Java", "Swing", "Spring Boot"],
    imageUrl: "#",
    alt: "SmartBill App",
    published: true,
    displayOrder: 1
  },
  {
    id: "chatterbox",
    title: "ChatterBox",
    description: "An Angular-based chat app made for smooth real-time conversations.",
    technologies: ["Angular", "TypeScript", "RxJS"],
    imageUrl: "#",
    alt: "ChatterBox App",
    published: true,
    displayOrder: 2
  },
  {
    id: "mindflow",
    title: "MindFlow",
    description: "An AI-powered thought organizer – part memory, part mentor.",
    technologies: ["AI", "Web Tech"],
    imageUrl: "#",
    alt: "MindFlow App",
    published: true,
    displayOrder: 3
  },
  {
    id: "posthub",
    title: "PostHub",
    description: "A web app for sharing and discovering posts, built with Angular and Spring Boot.",
    technologies: ["Angular", "Spring Boot"],
    imageUrl: "#",
    alt: "PostHub App",
    published: true,
    displayOrder: 4
  }
];

const FALLBACK_TOOLS = [
  {
    id: "grammar-ai",
    title: "🧠 Grammar AI",
    description: "An AI-powered grammar correction system to make your writing shine.",
    link: "tools/grammar-correction-system/index.html",
    status: "live",
    published: true,
    displayOrder: 1
  },
  {
    id: "bill-generator",
    title: "🧾 Bill Slip Generator",
    description: "A tool that allows users to create and manage bill slips.",
    link: "tools/bill-generator-tool/index.html",
    status: "live",
    published: true,
    displayOrder: 2
  },
  {
    id: "plate-identifier",
    title: "🚗🔎 Plate Identifier",
    description: "Instantly fetch vehicle details by simply entering a number plate.",
    link: "tools/plate-identifier/index.html",
    status: "live",
    published: true,
    displayOrder: 3
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description: "Chat with our bot to find out more.",
    link: "tools/chatbot/index.html",
    status: "live",
    published: true,
    displayOrder: 4
  },
  {
    id: "music-visualizer",
    title: "Music Visualizer",
    description: "Web-based audio visualizer that turns music into moving bars.",
    link: "tools/music-visualizer/index.html",
    status: "live",
    published: true,
    displayOrder: 5
  },
  {
    id: "web-dev-toolkit",
    title: "🛠️ Web Dev Toolkit",
    description: "A simple drag-and-drop tool to create structure and styling for websites.",
    link: "tools/web-dev-toolkit/index.html",
    status: "live",
    published: true,
    displayOrder: 6
  },
  {
    id: "snake-game",
    title: "🐍 Snake Game",
    description: "A simple snake game built with HTML, CSS, and JS.",
    link: "tools/snake-game/index.html",
    status: "live",
    published: true,
    displayOrder: 7
  },
  {
    id: "travel-management",
    title: "🗺️ Travel Management System",
    description: "A travel management system to manage your trips and expenses.",
    link: "tools/travel-management-system/index.html",
    status: "live",
    published: true,
    displayOrder: 8
  },
  {
    id: "split-expense",
    title: "🧾 Split Expense",
    description: "A simple tool to split expenses among friends and family.",
    link: "tools/split-expense/index.html",
    status: "live",
    published: true,
    displayOrder: 9
  },
  {
    id: "password-manager",
    title: "Password Manager",
    description: "A simple password manager to store your passwords securely.",
    link: "tools/password-manager/index.html",
    status: "live",
    published: true,
    displayOrder: 10
  },
  {
    id: "resume-generator",
    title: "📋 Resume Generator",
    description: "Build modern resumes effortlessly with AI-guided content.",
    link: "#",
    status: "coming-soon",
    published: true,
    displayOrder: 11
  },
  {
    id: "clockedin",
    title: "⏰ LockedIn",
    description: "A clock to make your efforts easy.",
    link: "tools/clockedin/index.html",
    status: "coming-soon",
    published: true,
    displayOrder: 12
  },
  {
    id: "streambox",
    title: "🎥 StreamBox",
    description: "A Live OTT Platform.",
    link: "tools/streambox/index.html",
    status: "live",
    published: true,
    displayOrder: 13
  }
];

const FALLBACK_VAULT_NOTES = [
  {
    id: "docker",
    title: "Docker Commands",
    description: "A list of essential Docker commands to manage containers and images efficiently.",
    link: "notes/docker.html",
    published: true,
    displayOrder: 1
  },
  {
    id: "nginx",
    title: "NGINX Commands",
    description: "A list of essential NGINX commands to configure and manage web servers efficiently.",
    link: "notes/nginx.html",
    published: true,
    displayOrder: 2
  },
  {
    id: "sql-where",
    title: "Understanding the WHERE Clause in SQL",
    description: "Learn how to filter your database queries using SQL WHERE. Easy syntax with real examples...",
    link: "#",
    published: true,
    displayOrder: 3
  },
  {
    id: "java-heap",
    title: "Fixing Java Heap Space Errors",
    description: "A quick guide on diagnosing and fixing memory overflow issues in Java apps.",
    link: "#",
    published: true,
    displayOrder: 4
  }
];

export const PortfolioService = {

  /**
   * Fetches profile data with caching
   */
  async getProfile() {
    if (cacheStore.profile) return cacheStore.profile;

    try {
      const docRef = doc(db, "profile", "main");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        cacheStore.profile = { id: snapshot.id, ...snapshot.data() };
        return cacheStore.profile;
      }
    } catch (err) {
      console.warn("Firestore profile fetch skipped/failed, using static fallback:", err.message);
    }

    cacheStore.profile = FALLBACK_PROFILE;
    return cacheStore.profile;
  },

  /**
   * Fetches published projects for public display
   */
  async getProjects(includeUnpublished = false) {
    if (cacheStore.projects && !includeUnpublished) return cacheStore.projects;

    try {
      const colRef = collection(db, "projects");
      let q;
      if (includeUnpublished) {
        q = query(colRef, orderBy("displayOrder", "asc"));
      } else {
        q = query(colRef, where("published", "==", true), orderBy("displayOrder", "asc"));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (!includeUnpublished) cacheStore.projects = list;
        return list;
      }
    } catch (err) {
      console.warn("Firestore projects fetch skipped/failed, using static fallback:", err.message);
    }

    return FALLBACK_PROJECTS;
  },

  /**
   * Fetches tools list
   */
  async getTools(includeUnpublished = false) {
    if (cacheStore.tools && !includeUnpublished) return cacheStore.tools;

    try {
      const colRef = collection(db, "tools");
      let q;
      if (includeUnpublished) {
        q = query(colRef, orderBy("displayOrder", "asc"));
      } else {
        q = query(colRef, where("published", "==", true), orderBy("displayOrder", "asc"));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (!includeUnpublished) cacheStore.tools = list;
        return list;
      }
    } catch (err) {
      console.warn("Firestore tools fetch skipped/failed, using static fallback:", err.message);
    }

    return FALLBACK_TOOLS;
  },

  /**
   * Fetches vault notes list
   */
  async getVaultNotes(includeUnpublished = false) {
    if (cacheStore.vaultNotes && !includeUnpublished) return cacheStore.vaultNotes;

    try {
      const colRef = collection(db, "vault_notes");
      let q;
      if (includeUnpublished) {
        q = query(colRef, orderBy("displayOrder", "asc"));
      } else {
        q = query(colRef, where("published", "==", true), orderBy("displayOrder", "asc"));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (!includeUnpublished) cacheStore.vaultNotes = list;
        return list;
      }
    } catch (err) {
      console.warn("Firestore vault notes fetch skipped/failed, using static fallback:", err.message);
    }

    return FALLBACK_VAULT_NOTES;
  },

  /**
   * Submits a user message to Firestore
   */
  async sendContactMessage({ name, email, message }) {
    if (!name || !email || !message) {
      throw new Error("Name, email, and message are required fields.");
    }

    const payload = {
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 150),
      message: message.trim().slice(0, 2000),
      createdAt: serverTimestamp(),
      read: false
    };

    const colRef = collection(db, "contact_messages");
    return await addDoc(colRef, payload);
  },

  /**
   * Admin Operations: Fetch all contact messages
   */
  async getContactMessages() {
    try {
      const colRef = collection(db, "contact_messages");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error("Failed to fetch contact messages:", err);
      return [];
    }
  },

  /**
   * Admin Operations: Create or Update Project
   */
  async saveProject(projectData, id = null) {
    cacheStore.projects = null; // Clear cache
    const colRef = collection(db, "projects");

    const payload = {
      ...projectData,
      updatedAt: serverTimestamp()
    };

    if (id) {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      payload.createdAt = serverTimestamp();
      const newDoc = await addDoc(colRef, payload);
      return newDoc.id;
    }
  },

  /**
   * Admin Operations: Delete Project
   */
  async deleteProject(id) {
    cacheStore.projects = null;
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
  },

  /**
   * Admin Operations: Create or Update Tool
   */
  async saveTool(toolData, id = null) {
    cacheStore.tools = null;
    const colRef = collection(db, "tools");

    const payload = { ...toolData, updatedAt: serverTimestamp() };

    if (id) {
      const docRef = doc(db, "tools", id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      payload.createdAt = serverTimestamp();
      const newDoc = await addDoc(colRef, payload);
      return newDoc.id;
    }
  },

  /**
   * Admin Operations: Delete Tool
   */
  async deleteTool(id) {
    cacheStore.tools = null;
    const docRef = doc(db, "tools", id);
    await deleteDoc(docRef);
  },

  /**
   * Admin Operations: Create or Update Vault Note
   */
  async saveVaultNote(noteData, id = null) {
    cacheStore.vaultNotes = null;
    const colRef = collection(db, "vault_notes");

    const payload = { ...noteData, updatedAt: serverTimestamp() };

    if (id) {
      const docRef = doc(db, "vault_notes", id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      payload.createdAt = serverTimestamp();
      const newDoc = await addDoc(colRef, payload);
      return newDoc.id;
    }
  },

  /**
   * Admin Operations: Delete Vault Note
   */
  async deleteVaultNote(id) {
    cacheStore.vaultNotes = null;
    const docRef = doc(db, "vault_notes", id);
    await deleteDoc(docRef);
  },

  /**
   * Admin Operations: Update Profile
   */
  async updateProfile(profileData) {
    cacheStore.profile = null;
    const docRef = doc(db, "profile", "main");
    await setDoc(docRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
  }
};
