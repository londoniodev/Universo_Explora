export const getPackageDetails = async (req, res) => {
    try {
      const { packageId } = req.params;
      const accessDetails = req.accessDetails;
  
      res.status(200).json({
        success: true,
        message: "Detalles del paquete obtenidos correctamente.",
        data: { packageId, accessDetails },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener detalles del paquete.",
        error: error.message,
      });
    }
};
  
export const accessPackageContent = async (req, res) => {
    try {
      const { packageId } = req.params;
  
      res.status(200).json({
        success: true,
        message: "Contenido del paquete obtenido correctamente.",
        data: { packageId },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al acceder al contenido del paquete.",
        error: error.message,
      });
    }
};  