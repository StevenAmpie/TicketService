export function isLegalAge(
  dobString: string,
  legalAge: number = 18,
): boolean | null {
  if (!dobString) {
    return null;
  }
  const today = new Date();
  const birthDate = new Date(dobString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= legalAge;
}
