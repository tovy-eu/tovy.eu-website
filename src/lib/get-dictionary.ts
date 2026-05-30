
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<string, () => Promise<Record<string, any>>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  en: () => import('../dictionaries/en.json').then((m) => m.default as Record<string, any>),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nl: () => import('../dictionaries/nl.json').then((m) => m.default as Record<string, any>),
};

export const getDictionary = async (lang: string) => 
  dictionaries[lang]?.() ?? dictionaries.en();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
