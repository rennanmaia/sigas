export function normalizeAndValidateCPF(input: string | number): string | null {
  const cpf = String(input).replace(/\D/g, "");

  if (cpf.length !== 11) return null;

  if (/^(\d)\1+$/.test(cpf)) return null;

  const calcCheckDigit = (cpfPart: string, factor: number): number => {
    let total = 0;

    for (let i = 0; i < cpfPart.length; i++) {
      total += parseInt(cpfPart[i]) * factor--;
    }

    const remainder = total % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calcCheckDigit(cpf.slice(0, 9), 10);
  const digit2 = calcCheckDigit(cpf.slice(0, 10), 11);

  if (digit1 !== parseInt(cpf[9]) || digit2 !== parseInt(cpf[10])) return null;

  return cpf;
}
