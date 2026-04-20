export interface Voice {
  id: string;
  label: string;
}

export const VOICES: Voice[] = [
  { id: "vucic",          label: "Aleksandar Vučić" },
  { id: "zmaj",           label: "Zmaj od Šipova" },
  { id: "brnabic",        label: "Brnabić" },
  { id: "desingerica",    label: "Desingerica" },
  { id: "aca_lukas",      label: "Aca Lukas" },
  { id: "jovanka_jolic",  label: "Jovanka Jolić" },
  { id: "jovana_jeremic", label: "Jovana Jeremić" },
];
