// utils/validateSlug.ts
const slugCache: Record<string, boolean> = {};

export async function validateSlug(slug: string): Promise<boolean> {
  //  Si le slug a déjà été validé, retourne directement
  if (slugCache[slug] !== undefined) {
    return slugCache[slug];
  }

  try {
    const response = await fetch(`http://localhost:8000/api/${slug}/verify`);
    const isValid = response.status === 200;
    slugCache[slug] = isValid; //  Stocke en mémoire
    return isValid;
  } catch {
    slugCache[slug] = false;
    return false;
  }
}
