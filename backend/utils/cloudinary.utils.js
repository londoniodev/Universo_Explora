import cloudinary from "../config/cloudinary.config.js";

export const uploadToCloudinary = async (file, folder, oldUrl) => {
  if (oldUrl) {
    try {
      const oldPublicId = oldUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`${folder}/${oldPublicId}`);
    } catch (err) {
      console.warn("⚠️ Error eliminando imagen antigua en Cloudinary:", err.message);
    }
  }

  const result = await cloudinary.uploader.upload(file.path, { 
    folder: folder, 
    secure: true
  });

  return result.secure_url;
};
