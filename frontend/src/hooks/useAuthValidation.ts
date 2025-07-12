import { useEffect, useState } from 'react';
import { validateSlug } from '../utils/validateSlug';
import { validateToken } from '../utils/validateToken';

type AuthValidationResult = {
  isSlugValid: boolean | null;
  isTokenValid: boolean | null;
  storedSlug: string | null;
  invalidReason: string | null;
};

export function useAuthValidation(slug: string | undefined, token: string | null): AuthValidationResult {
  const [isSlugValid, setIsSlugValid] = useState<boolean | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [invalidReason, setInvalidReason] = useState<string | null>(null);
  const storedSlug = localStorage.getItem('slug_etablissement');

  useEffect(() => {
    if (!slug) {
      setIsSlugValid(false);
      return;
    }

    validateSlug(slug).then((valid) => {
      setIsSlugValid(valid);
    });
  }, [slug]);

  useEffect(() => {
    if (!token || !slug) {
      setIsTokenValid(false);
      setInvalidReason('missing_token_or_slug');
      return;
    }

    validateToken(slug, token).then(({ isValid, reason }) => {
      setIsTokenValid(isValid);
      setInvalidReason(reason || null);
      if (!isValid) localStorage.removeItem('token');
    });
  }, [token, slug]);

  return { isSlugValid, isTokenValid, storedSlug, invalidReason };
}
