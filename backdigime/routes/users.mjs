import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import UserTemplate from "../models/UserTemplate.mjs";

const router = express.Router();

// Improved file storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "uploads/";

    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Error creating upload directory:", err);
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "_");

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(sanitizedOriginalName);

    cb(
      null,
      `${uniqueSuffix}-${sanitizedOriginalName.replace(
        extension,
        ""
      )}${extension}`
    );
  },
});

// File filter for security
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only images are allowed."), false);
  }

  cb(null, true);
};

// Image optimization middleware
// Image optimization middleware (actualizado)
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const optimizedImagePath = path.join(
      req.file.destination,
      `optimized-${req.file.filename}`
    );

    // Generar una copia optimizada en formato WebP
    await sharp(req.file.path)
      .resize({
        width: 800,
        height: 800,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(optimizedImagePath);

    // Actualiza `req.file` sin eliminar el original
    req.file.optimizedPath = optimizedImagePath;
    req.file.optimizedFilename = `optimized-${req.file.filename}`;
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    console.error("Error al optimizar la imagen:", error);
    next(error);
  }
};

// Configure multer with enhanced options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1, // Limit to single file upload
    fieldSize: 10 * 1024 * 1024, // 10MB field size
  },
});

// Error handling middleware for file upload
const handleFileUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: "File upload error",
      message: err.message,
    });
  } else if (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
  next();
};

const cleanUsername = (username) => {
  return username.replace(/\s+/g, "").toLowerCase(); // Elimina espacios y pasa a minúsculas
};

const formatUsername = (username) => {
  return (
    username
      // Añade un espacio antes de cada letra mayúscula (pero no al inicio)
      .replace(/([A-Z])/g, " $1")
      // Elimina el espacio inicial si lo hay
      .trim()
      // Formatea cada palabra: primera letra mayúscula, resto minúscula
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
};

// Utility function to generate user component
const generateUserComponent = (newUser) => {
  const username = formatUsername(
    newUser.username.charAt(0).toUpperCase() + newUser.username.slice(1)
  );

  const ckeckUsernameFormat = (username) => {
    return /^[a-z0-9]+$/i.test(username);
  };
  console.log(ckeckUsernameFormat(username));

  const pdfUrl = newUser.pdfUrl ? `'${newUser.pdfUrl}'` : "null";

  return `import React from 'react';
import ClientTemplate from '../templates/ClientTemplate';

const ${username} = () => {
  const contactInfo = {
    phone: '${newUser.phone}',
    phoneCode: '${newUser.phoneCode}',
    email: '${newUser.email}',
    whatsapp: 'https://wa.me/${newUser.whatsapp}',
    twitter: 'https://x.com/${newUser.twitter}',
    linkedin: 'https://linkedin.com/in/${newUser.linkedin}',
    instagram: 'https://instagram.com/${newUser.instagram}',
  };

  const content = \`${newUser.description}\`;

  // Genera la URL de la imagen desde el servidor backend
  const imageUrl = \`https://backdigime.onrender.com/uploads/${newUser.imageFile}\`;

  return (
    <ClientTemplate
      name="${username}"
      phone={contactInfo.phone}
      phoneCode={contactInfo.phoneCode}
      email={contactInfo.email}
      whatsapp={contactInfo.whatsapp}
      twitter={contactInfo.twitter}
      linkedin={contactInfo.linkedin}
      instagram={contactInfo.instagram}
      content={content}
      specialization="${newUser.specialization}"
      imageUrl={imageUrl}
      terms={${newUser.terms}}
      pdfUrl={${pdfUrl}}

    />
  );
};

export default ${username};
`;
};

// POST: Crear un nuevo usuario con archivos
router.post(
  "/api/users/create",
  upload.single("imageFile"),
  optimizeImage,
  handleFileUploadError,
  async (req, res) => {
    const session = await UserTemplate.startSession();

    try {
      session.startTransaction();

      const {
        phone,
        phoneCode,
        email,
        whatsapp,
        twitter,
        linkedin,
        instagram,
        description,
        specialization,
        terms,
        pdfUrl,
      } = req.body;

      const username = cleanUsername(req.body.username); // Limpia el nombre

      const newUser = new UserTemplate({
        phone,
        phoneCode,
        email,
        whatsapp,
        twitter,
        linkedin,
        instagram,
        username,
        description,
        specialization,
        terms,
        pdfUrl,
        imageFile: req.file ? req.file.filename : null,
      });

      // Guarda el usuario para obtener el ID
      await newUser.save({ session });

      // Renombra la imagen usando el ID y el nombre del usuario
      if (req.file) {
        const finalImageName = `${newUser._id}-${username}.webp`;
        const finalImagePath = path.join(req.file.destination, finalImageName);

        await fs.rename(req.file.optimizedPath, finalImagePath);
        newUser.imageFile = finalImageName;
      }

      // Genera el componente
      const componentContent = generateUserComponent(newUser);
      const componentsDir = path.join(__dirname, "../../digime/src/pages/");
      await fs.mkdir(componentsDir, { recursive: true });
      const componentPath = path.join(componentsDir, `${username}Component.js`);
      await fs.writeFile(componentPath, componentContent);

      // Confirma la transacción
      await session.commitTransaction();

      res.status(201).json({
        message: "Usuario creado exitosamente",
        user: newUser,
        componentPath: componentPath,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      res.status(500).json({ error: "Error al crear el usuario" });
    } finally {
      session.endSession();
    }
  }
);

// GET: Obtener todos los usuarios
router.get("/api/users", async (_, res) => {
  try {
    const users = await UserTemplate.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// GET: Obtener un usuario por username
router.get("/api/users/:username", async (req, res) => {
  try {
    const user = await UserTemplate.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

// PUT: Actualizar un usuario
router.put(
  "/api/users/:username",
  upload.single("imageFile"),
  optimizeImage,
  handleFileUploadError,
  async (req, res) => {
    try {
      const { username } = req.params;
      const updateData = { ...req.body };

      // If a new image was uploaded, update the image file
      if (req.file) {
        updateData.imageFile = req.file.filename;
      }

      const updatedUser = await UserTemplate.findOneAndUpdate(
        { username },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Regenerate component with updated information
      const componentContent = generateUserComponent(updatedUser);
      const componentsDir = path.join(__dirname, "../../digime/src/pages/");
      const componentPath = path.join(componentsDir, `${username}Component.js`);
      await fs.writeFile(componentPath, componentContent);

      res.status(200).json({
        message: "Usuario actualizado exitosamente",
        user: updatedUser,
        componentPath: componentPath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }
);

// DELETE: Eliminar un usuario
router.delete("/api/users/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const deletedUser = await UserTemplate.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Optionally, remove the user's component file
    const componentsDir = path.join(__dirname, "../../digime/src/pages/");
    const componentPath = path.join(componentsDir, `${username}Component.js`);

    try {
      await fs.unlink(componentPath);
    } catch (fileError) {
      console.warn(`Could not delete component file: ${fileError.message}`);
    }

    res.status(200).json({
      message: "Usuario eliminado exitosamente",
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
