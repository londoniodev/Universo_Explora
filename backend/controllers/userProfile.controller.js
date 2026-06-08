import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

export const getAccountInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

export const updateAccountInfo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, message: "Información actualizada", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

//---------------------------------------------
// GET AND UPDATE PSYCHOLOGIST ACCOUNT INFO
//---------------------------------------------

export const getPsychologistAccountInfo = async (req, res) => {
  try {
    const psychologist = await User.findById(req.user._id).select("-password");

    if (!psychologist || (psychologist.role !== "psychologist" && psychologist.role !== "fallback_psychologist")) {
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado" });
    }

    return res.status(200).json({
      success: true,
      psychologist: {
        ...psychologist.toObject(),
        profilePicture: psychologist.profilePicture?.startsWith("http") 
          ? psychologist.profilePicture 
          : `https://res.cloudinary.com/dkandom0b/image/upload/${psychologist.profilePicture}`,
        
        degreeCertificate: psychologist.degreeCertificate?.startsWith("http") 
          ? psychologist.degreeCertificate 
          : `https://res.cloudinary.com/dkandom0b/image/upload/${psychologist.degreeCertificate}`,
        
        professionalCard: psychologist.professionalCard?.startsWith("http") 
          ? psychologist.professionalCard 
          : `https://res.cloudinary.com/dkandom0b/image/upload/${psychologist.professionalCard}`,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// ---------------------------------------------
// UPDATE PSYCHOLOGIST ACCOUNT INFO USING CLOUDINARY
// ---------------------------------------------
export const updatePsychologistAccountInfo = async (req, res) => {
  try {
    const psychologist = await User.findById(req.userId);

    if (!psychologist || psychologist.role !== "psychologist") {
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado" });
    }

    const updates = ["name", "last_name", "phone", "city", "gender", "documentId", "experienceYears"];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        psychologist[field] = req.body[field];
      }
    });

    if (req.files?.profilePicture) {
      psychologist.profilePicture = await uploadToCloudinary(req.files.profilePicture[0], "psychologists", psychologist.profilePicture);
    }
    if (req.files?.degreeCertificate) {
      psychologist.degreeCertificate = await uploadToCloudinary(req.files.degreeCertificate[0], "psychologists", psychologist.degreeCertificate);
    }
    if (req.files?.professionalCard) {
      psychologist.professionalCard = await uploadToCloudinary(req.files.professionalCard[0], "psychologists", psychologist.professionalCard);
    }

    await psychologist.save();

    return res.status(200).json({
      success: true,
      message: "Información actualizada correctamente",
      psychologist,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

// ---------------------------------------------
//  MARK RESULTS AS SENT
// ---------------------------------------------
export const markResultsAsSent = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    user.resultsSent = true;
    await user.save();

    return res.status(200).json({ success: true, message: "Resultados marcados como enviados." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error del servidor." });
  }
};
