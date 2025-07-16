export async function validateToken(slug: string, token: string): Promise<{ isValid: boolean, reason?: string }> {
  try {
    const response = await fetch(`http://localhost:8000/api/${slug}/verify-token/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const isValid = response.status === 200;
    let reason: string | undefined = undefined;

    try {
      const data = await response.json();
      reason = data.reason;
    }catch (e: unknown) {
      console.warn("Réponse JSON vide ou invalide (token valide ?)", e);
    }


    return { isValid, reason };
  } catch (error) {
    console.error("Erreur réseau lors de la vérification du token :", error);
    return { isValid: false, reason: 'network_error' };
  }
}
