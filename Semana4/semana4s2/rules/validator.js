export const validateName = (name) => {
  if (!name.trim()) return "El nombre es obligatorio.";
  if (name.length < 3) return "Debe tener al menos 3 caracteres.";
  return "";
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "El correo es obligatorio.";
  if (!emailRegex.test(email)) return "Formato de correo inválido.";
  return "";
};

export const getPasswordStrength = (password) => {
  if (password.length < 6) return "Débil";
  if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8) return "Fuerte";
  return "Media";
};

export const validatePassword = (password) => {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 6) return "Mínimo 6 caracteres.";
  return "";
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{9}$/;
  if (!phone.trim()) return "El teléfono es obligatorio.";
  if (!phoneRegex.test(phone)) return "El teléfono debe tener 9 dígitos.";
  return "";
};