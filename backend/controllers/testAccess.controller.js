import { UserPackageAccess } from "../models/UserPackageAccess.model.js";
import { generateTestAccessToken, verifyTestAccessToken } from "../utils/testAccessToken.utils.js";
import { PsychologistAccessPurchase } from "../models/PsychologistAccessPurchase.model.js";
import { PsychologistPackage } from "../models/PsychologistPackage.model.js";
import { User } from "../models/user.model.js";

export const createAccessToken = async (req, res) => {
  const { packageId, expiration } = req.body;
  const userId = req.userId;

  if (!userId || !packageId) {
    return res.status(400).json({ success: false, message: "userId y packageId son requeridos." });
  }

  try {
    const token = generateTestAccessToken({ userId, packageId }, expiration || 604800);
    const expiresAt = expiration ? new Date(Date.now() + expiration * 1000) : null;

    const newAccess = await UserPackageAccess.create({
      token,
      userId,
      packageId,
      expiresAt,
    });

    res.status(201).json({ success: true, access: newAccess });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear el token." });
  }
};

export const validateAccessToken = async (req, res) => {
  const { token } = req.body;
  const userId = req.userId;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token es requerido." });
  }

  try {
    const decoded = verifyTestAccessToken(token);

    const access = await UserPackageAccess.findOne({ token });

    if (!access) {
      return res.status(404).json({ success: false, message: "Token no encontrado." });
    }

    if (!access.isActive) {
      return res.status(400).json({ success: false, message: "Este token ya ha sido usado." });
    }

    if (access.expiresAt && new Date() > access.expiresAt) {
      return res.status(400).json({ success: false, message: "Token expirado." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const psychologist = await User.findById(access.createdBy);

    if (!user.psychologistAssigned) {
      user.psychologistAssigned = psychologist ? psychologist._id : null;
    }

    const packageExists = user.purchasedTests.some(
      (p) => p.id.toString() === access.packageId.toString()
    );

    if (!packageExists) {
      user.purchasedTests.push({ id: access.packageId, title: "Paquete asignado por token" });
    }

    await user.save();

    access.isActive = false;
    access.used = true;
    access.usedBy = userId;
    await access.save();

    return res.status(200).json({
      success: true,
      message: "Token válido. Acceso concedido.",
      psychologistAssigned: user.psychologistAssigned,
      packageId: access.packageId,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al validar el acceso." });
  }
};

export const revokeAccessToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token es requerido." });
  }

  try {
    const access = await UserPackageAccess.findOneAndUpdate(
      { token },
      { isActive: false, usedBy: null, used: false, usedByName: "Revocado" },
      { new: true }
    );

    if (!access) {
      return res.status(404).json({ success: false, message: "Token no encontrado." });
    }

    return res.status(200).json({ success: true, message: "Token revocado con éxito.", access });
  } catch (error) {
    console.error("Error al revocar el token:", error);
    return res.status(500).json({ success: false, message: "Error al revocar el token." });
  }
};

/**
 * Genera un acceso para un usuario desde el saldo del psicólogo.
 */

export const generateAccessForUser = async (req, res) => {
  try {
    
    const psychologistId = req.userId;
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ success: false, message: "El packageId es requerido." });
    }

    const psychologist = await User.findById(psychologistId);
    if (!psychologist || (psychologist.role !== "psychologist" && psychologist.role !== "fallback_psychologist")) {
      return res.status(403).json({ success: false, message: "Acción no permitida." });
    }

    if (psychologist.accessBalance <= 0) {
      return res.status(400).json({ success: false, message: "No tienes accesos disponibles." });
    }

    const token = generateTestAccessToken({ psychologistId, packageId }, "30d");

    let newAccess;
    try {
      newAccess = await UserPackageAccess.create({
        userId: null,
        psychologistId,
        packageId,
        token,
        createdBy: psychologistId,
        isActive: true,
        used: false,
        usedBy: null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isPermanent: false,
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al guardar el acceso en la base de datos." });
    }

    psychologist.accessBalance -= 1;
    await psychologist.save();

    return res.status(201).json({
      success: true,
      message: "Acceso generado con éxito.",
      accessToken: token,
      remainingAccesses: psychologist.accessBalance,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al generar el acceso." });
  }
};


/**
 * Obtiene la lista de accesos generados por el psicólogo.
 */
export const getPsychologistAccesses = async (req, res) => {
  try {
    const psychologistId = req.userId;

    const accesses = await UserPackageAccess.find({ createdBy: psychologistId });

    return res.status(200).json({ success: true, accesses });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al obtener los accesos" });
  }
};

/**
 * Obtiene el historial de compras del psicólogo y su saldo de accesos.
*/

export const getPsychologistPurchases = async (req, res) => {
  try {
    const psychologistId = req.userId;

    const purchases = await PsychologistAccessPurchase.find({
      psychologistId,
      paymentStatus: { $in: ["completed", "pending"] },
    }).lean();

    for (let purchase of purchases) {
      if (purchase.packageId) {
        const packageInfo = await PsychologistPackage.findById(purchase.packageId).select("name");
        purchase.packageName = packageInfo ? packageInfo.name : "Desconocido";
      } else {
        purchase.packageName = "Desconocido";
      }
    }

    return res.status(200).json({
      success: true,
      accessBalance: purchases.reduce((total, p) => total + p.quantity, 0),
      purchases: purchases.map(p => ({
        _id: p._id,
        packageId: p.packageId,
        packageName: p.packageName,
        quantity: p.quantity,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al obtener las compras" });
  }
};

export const validateAccessTokenForUser = async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user._id;

    if (!token) {
      return res.status(400).json({ success: false, message: "Debes ingresar un token." });
    }

    const accessRecord = await UserPackageAccess.findOne({ token, isActive: true });

    if (!accessRecord) {
      return res.status(400).json({ success: false, message: "Token inválido o expirado." });
    }

    const packageInfo = await PsychologistPackage.findById(accessRecord.packageId);
    if (!packageInfo) {
      return res.status(400).json({ success: false, message: "El paquete asociado no existe." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    if (accessRecord.used) {
      return res.status(400).json({ success: false, message: "Este token ya fue usado." });
    }

    user.psychologistAssigned = accessRecord.psychologistId;

    const packageExists = user.purchasedTests.some((p) => p.id.toString() === packageInfo._id.toString());

    if (!packageExists) {
      user.purchasedTests.push({
        id: packageInfo._id,
        title: packageInfo.name,
        price: packageInfo.price || 0,
      });
    }

    await user.save();

    accessRecord.used = true;
    accessRecord.usedBy = userId;
    accessRecord.usedByName = `${user.name} ${user.last_name}`;
    await accessRecord.save();

    return res.status(200).json({
      success: true,
      message: "Token válido.",
      packageId: packageInfo._id,
      packageName: packageInfo.name,
      psychologistId: accessRecord.psychologistId,
      usedBy: userId,
      usedByName: `${user.name} ${user.last_name}`,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error interno al validar el token." });
  }
};