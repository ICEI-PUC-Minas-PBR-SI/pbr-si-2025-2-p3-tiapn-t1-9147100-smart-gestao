import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define os tipos de arquivo permitidos e suas respectivas pastas de destino.
const allowedMimeTypes = {
  'image/jpeg': 'img',
  'image/jpg': 'img',
  'image/png': 'img',
  'application/pdf': 'pdf',
};

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  /**
   * Define o diretório de destino para o arquivo.
   * A estrutura de pastas é criada dinamicamente para garantir o isolamento dos dados:
   * `uploads/[companyId]/[img|pdf]/`
   */
  destination: (req, file, cb) => {
    // O companyId é injetado pelo authMiddleware
    const companyId = req.user?.companyId;
    if (!companyId) {
      return cb(new Error('ID da empresa não encontrado na requisição para o upload.'), null);
    }

    const subfolder = allowedMimeTypes[file.mimetype] || 'other';
    const uploadPath = path.join('uploads', companyId.toString(), subfolder);

    // Cria o diretório de destino se ele não existir
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  /**
   * Define o nome do arquivo, adicionando um timestamp para garantir que seja único.
   */
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtro para validar o tipo do arquivo
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes[file.mimetype]) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas PDF, PNG, JPG e JPEG são permitidos.'), false); // Rejeita o arquivo
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;