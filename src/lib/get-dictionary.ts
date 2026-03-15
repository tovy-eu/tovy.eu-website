
const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import('../dictionaries/en.json').then((m) => m.default),
  nl: () => import('../dictionaries/nl.json').then((m) => m.default),
};

export const getDictionary = async (lang: string) => 
  dictionaries[lang]?.() ?? dictionaries.en();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
