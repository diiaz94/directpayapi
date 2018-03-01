exports.MIN_PASSWORD_LENGTH = 6;
exports.MIN_RUT_LENGTH = 7;
exports.BASE_FILES_PATH = 'https://pagodirecto.herokuapp.com/api/files/'; //TODO: Modificar de ser necesario
exports.DROPBOX_FOLDER_PATH = '/pagodirecto'; //TODO: Modificar de ser necesario
exports.ACCEPTED_EXTENSIONS = ['JPG', 'PNG', 'PDF'];
exports.MAX_FILE_SIZE = 1000000; //1MB

exports.ERRORS = {
  "INTERNAL_ERROR": {
    httpCode: 400,
    code: "#-1",
    description: "Ha ocurrido un error interno, intente mas tarde."
  },
  "MISSING_REQUIRED_FIELDS": {
    httpCode: 400,
    code: "#1001",
    description: "Faltan campos que son obligatorios."
  },
  "USER_ALREADY_EXIST": {
    httpCode: 403,
    code: "#1002",
    description: "Ya existe un usuario con estos datos."
  },
  "CI_TOO_SHORT": {
    httpCode: 400,
    code: "#1003",
    description: "La cédula debe tener al menos " + this.MIN_RUT_LENGTH + " caracteres."
  },
  "PASSWORD_TOO_SHORT": {
    httpCode: 400,
    code: "#1004",
    description: "La contraseña deber tener al menos " + this.MIN_PASSWORD_LENGTH + " caracteres."
  },
  "USER_NOT_EXIST": {
    httpCode: 404,
    code: "#1005",
    description: "El usuario no existe en nuestros registros."
  },
  "BAD_CREDENTIALS": {
    httpCode: 403,
    code: "#1006",
    description: "Credenciales incorrectas."
  },
  "UNSUPPORTED_EXTENSIONS": {
    httpCode: 400,
    code: "#1007",
    description: "Solo son permitidas las extensiones de tipo JPG, PNG y PDF."
  },
  "FILE_TOO_LARGE": {
    httpCode: 400,
    code: "#1007",
    description: "Los archivos deben pesar menos de " + (this.MAX_FILE_SIZE / 1000000) + " MB."
  },
  "NO_TOKEN_PROVIDED": {
    httpCode: 403,
    code: "#1008",
    description: "Inicie sesion de nuevo."
  },
  "AUTHENTICATE_FAILED": {
    httpCode: 401,
    code: "#1009",
    description: "Ha ocurrido un error de autenticacion, inicie sesion de nuevo."
  },
  "FACEBOOK_FIELDS_AUTHENTICATE": {
    httpCode: 401,
    code: "#1010",
    description: "Esta aplicacion necesita permisos para ver su email y su nombre de facebook."
  },
  "UNAUTHORIZATED": {
    httpCode: 401,
    code: "#1011",
    description: "Necesitas privilegios para acceder a este recurso."
  }
}

exports.DEFAULT_ERROR = {
  httpCode: 500,
  code: "#-2",
  description: "Ha ocurrido un error inesperado, intente mas tarde."
}