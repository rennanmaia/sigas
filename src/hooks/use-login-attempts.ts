import { useCallback } from 'react';

const FAILED_ATTEMPTS_KEY = 'login_failed_attempts';
const BLOCKED_ACCOUNTS_KEY = 'blocked_accounts';
const MAX_ATTEMPTS = 5;
const WARNING_THRESHOLD = 3; // Mostra mensagem a partir da 3ª tentativa falha

interface FailedAttempt {
  identifier: string;
  count: number;
  lastAttempt: number;
}

interface BlockedAccount {
  identifier: string;
  blockedAt: number;
  reason: 'max_attempts_exceeded';
}

export function useLoginAttempts() {
  const getFailedAttempts = useCallback((identifier: string): FailedAttempt | null => {
    try {
      const stored = localStorage.getItem(FAILED_ATTEMPTS_KEY);
      if (!stored) return null;
      const attempts = JSON.parse(stored) as FailedAttempt[];
      return attempts.find((a: FailedAttempt) => a.identifier === identifier) || null;
    } catch {
      return null;
    }
  }, []);

  const getBlockedAccounts = useCallback((): BlockedAccount[] => {
    try {
      const stored = localStorage.getItem(BLOCKED_ACCOUNTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const isAccountBlocked = useCallback((identifier: string): boolean => {
    const blocked = getBlockedAccounts();
    return blocked.some((b) => b.identifier === identifier);
  }, [getBlockedAccounts]);

  const blockAccount = useCallback((identifier: string): void => {
    try {
      const blocked = getBlockedAccounts();
      
      // Verifica se já está bloqueada
      if (!blocked.find((b) => b.identifier === identifier)) {
        blocked.push({
          identifier,
          blockedAt: Date.now(),
          reason: 'max_attempts_exceeded',
        });
        localStorage.setItem(BLOCKED_ACCOUNTS_KEY, JSON.stringify(blocked));

        // Também marca no localStorage de usuários locais por email
        try {
          const storedUsers = localStorage.getItem('local-users');
          if (storedUsers) {
            const users = JSON.parse(storedUsers) as Array<{ email?: string; status?: string }>;
            const userIndex = users.findIndex((u) => String(u.email ?? '').toLowerCase() === identifier.toLowerCase());
            if (userIndex >= 0) {
              users[userIndex].status = 'suspended';
              localStorage.setItem('local-users', JSON.stringify(users));
            }
          }
        } catch {
          // Ignore errors updating local-users
        }
      }
    } catch (error) {
      console.error('Erro ao bloquear conta:', error);
    }
  }, [getBlockedAccounts]);

  const recordFailedAttempt = useCallback((identifier: string): FailedAttempt => {
    try {
      let attempts: FailedAttempt[] = [];
      const stored = localStorage.getItem(FAILED_ATTEMPTS_KEY);
      if (stored) {
        attempts = JSON.parse(stored) as FailedAttempt[];
      }

      const existingIndex = attempts.findIndex((a: FailedAttempt) => a.identifier === identifier);

      if (existingIndex >= 0) {
        attempts[existingIndex].count += 1;
        attempts[existingIndex].lastAttempt = Date.now();
      } else {
        attempts.push({
          identifier,
          count: 1,
          lastAttempt: Date.now(),
        });
      }

      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(attempts));

      const currentIndex = existingIndex >= 0 ? existingIndex : attempts.length - 1;
      if (attempts[currentIndex].count >= MAX_ATTEMPTS) {
        blockAccount(identifier);
      }

      return attempts[currentIndex];
    } catch (error) {
      console.error('Erro ao registrar tentativa falha:', error);
      return { identifier, count: 1, lastAttempt: Date.now() };
    }
  }, [blockAccount]);

  const resetFailedAttempts = useCallback((identifier: string): void => {
    try {
      const stored = localStorage.getItem(FAILED_ATTEMPTS_KEY);
      if (!stored) return;
      
      let attempts = JSON.parse(stored) as FailedAttempt[];
      attempts = attempts.filter((a: FailedAttempt) => a.identifier !== identifier);
      
      if (attempts.length === 0) {
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      } else {
        localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(attempts));
      }
    } catch (error) {
      console.error('Erro ao resetar tentativas falhas:', error);
    }
  }, []);

  const getWarningMessage = useCallback((identifier: string): string | null => {
    const attempt = getFailedAttempts(identifier);
    
    if (!attempt) return null;
    if (attempt.count < WARNING_THRESHOLD) return null;
    
    if (attempt.count === MAX_ATTEMPTS) {
      return 'Sua conta foi desativada. Entre em contato com o administrador.';
    }

    const remaining = MAX_ATTEMPTS - attempt.count;
    if (remaining === 1) {
      return 'Você tem mais uma tentativa antes da sua conta ser suspensa.';
    }
    
    return `Você tem mais ${remaining} tentativas antes da sua conta ser suspensa.`;
  }, [getFailedAttempts]);

  const isWarningVisible = useCallback((identifier: string): boolean => {
    const attempt = getFailedAttempts(identifier);
    return attempt ? attempt.count >= WARNING_THRESHOLD : false;
  }, [getFailedAttempts]);

  return {
    getFailedAttempts,
    getBlockedAccounts,
    isAccountBlocked,
    recordFailedAttempt,
    blockAccount,
    resetFailedAttempts,
    getWarningMessage,
    isWarningVisible,
    MAX_ATTEMPTS,
    WARNING_THRESHOLD,
  };
}
