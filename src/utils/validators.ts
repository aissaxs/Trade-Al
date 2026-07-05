export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

export function isValidAge(age: number): boolean {
  return age >= 18 && age <= 100;
}

export function validateSignup(data: {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
}): string | null {
  if (!isValidEmail(data.email)) return 'البريد الإلكتروني غير صالح';
  if (!isValidPassword(data.password)) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  if (data.password !== data.confirmPassword) return 'كلمتا المرور غير متطابقتين';
  if (!isValidUsername(data.username)) return 'اسم المستخدم غير صالح';
  if (!data.firstName || !data.lastName) return 'الاسم مطلوب';
  if (!isValidAge(data.age)) return 'العمر يجب أن يكون بين 18 و 100';
  return null;
}
