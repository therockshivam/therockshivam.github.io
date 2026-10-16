// Firebase Storage Service Module
import { storage } from "../firebase-config.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB Limit

export const StorageService = {
  /**
   * Uploads a file to Firebase Storage under /public/ folder
   * @param {File} file - File object from input
   * @param {string} folder - Destination subfolder (e.g., 'projects', 'profile')
   * @returns {Promise<string>} Download URL of uploaded asset
   */
  async uploadFile(file, folder = "projects") {
    if (!file) throw new Error("No file selected for upload.");

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File exceeds maximum size limit of 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
    }

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      throw new Error("Invalid file format. Only JPEG, PNG, WEBP images and PDF documents are allowed.");
    }

    const timeStamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `public/${folder}/${timeStamp}_${cleanFileName}`;
    
    const storageRef = ref(storage, filePath);

    console.log(`Uploading ${file.name} to ${filePath}...`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log("Upload successful:", downloadUrl);
    return downloadUrl;
  },

  /**
   * Deletes a file from Firebase Storage using its full URL
   */
  async deleteFileByUrl(fileUrl) {
    if (!fileUrl || !fileUrl.includes("firebasestorage.googleapis.com")) return;

    try {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
      console.log("Deleted old asset from storage.");
    } catch (err) {
      console.warn("Storage delete failed/skipped:", err.message);
    }
  }
};
