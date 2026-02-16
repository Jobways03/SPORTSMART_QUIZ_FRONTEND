// utils/passwordStrength.js
export const getPasswordStrength = (password = "") => {
  const pw = String(password);

  if (!pw) return { level: 0, label: "" };

  const length = pw.length;

  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);

  // Match YOUR validation special set (same as your isStrongPassword regex)
  const hasSpecial = /[@$!%*?&]/.test(pw);

  const typesCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(
    Boolean,
  ).length;

  const meetsBaseRule = length >= 8 && typesCount === 4;

  // Levels MUST be 0..3 to match your CSS: pwFill--0..3
  // 0 = Weak, 1 = Medium, 2 = Strong, 3 = Very Strong
  if (!meetsBaseRule) {
    // too short OR missing too many character types
    if (length < 8 || typesCount <= 2) return { level: 0, label: "Weak" };

    // has 3/4 types but not all (eg missing digit)
    return { level: 1, label: "Medium" };
  }

  // Meets base rule (upper+lower+digit+special+>=8)
  if (length >= 10) return { level: 3, label: "Very Strong" };
  return { level: 2, label: "Strong" };
};
