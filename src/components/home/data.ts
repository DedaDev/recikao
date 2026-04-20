export const VOICES = [
  "Zmaj od Šipova", "Vučić", "Sin Dragan", "Srećko Šojić",
  "Sunđer Bob", "Jovana Jeremić","Jovanka Jolić",
];

export const TICKER = [...VOICES, ...VOICES, ...VOICES];

export const EXAMPLES = [
  {
    id: "prank3",
    tag: "Prenkuj prijatelje",
    voice: "Jovanka Jolić",
    img: "/jovanka.png",
    text: "Ja se iskreno nadam da će ekipa iz bloka 65 uspeti da vrate Egipat koji nam je otet.",
    src: "/examples/ekipaizbloka.wav",
  },
  {
    id: "prank1",
    tag: "Čestitaj rođendan",
    voice: "Aleksandar Vučić",
    img: "/vucic.png",
    text: "Pero Periću, želim ti srećan rođendan, tvoj predsednik Aleksandar Vučić.",
    src: "/examples/pero.wav",
  },
  {
    id: "sojic",
    tag: "Pozdravi ekipu iz firme",
    voice: "Srećko Šojić",
    img: "/sojic.png",
    text: "U ovom svečanom trenutku kada obeležavamo 30 godina firme ReciKao mogu samo da poručim: ne cveta cveće ni u naše preduzeće!",
    src: "/examples/necvetacvece.wav",
  },
  // {
  //   id: "prank2",
  //   tag: "Prenkuj prijatelja",
  //   voice: "Jovana Jeremić",
  //   img: "/jovana.png",
  //   text: "Ja sam jaka žena i treba mi jak muškarac, kao što je Marko Marković iz Beograda.",
  //   src: "/examples/jakazena.wav",
  // },
  {
    id: "sundjerbob",
    tag: "Strimer si? Želiš da super chat poruke zvuče prirodnije?",
    voice: "Sunđer Bob",
    img: "/spongebob.png",
    text: "Pero je donirao 200 dinara i kaže: kako si druže?",
    src: "/examples/donacija.wav",
  },
  {
    id: "zmajodsipova",
    tag: "Registruj se",
    voice: "Zmaj od Šipova",
    img: "/zmaj.png",
    text: "Prvih 10 generisnja dnevno je besplatno, registruj se!",
    src: "/examples/registrujse.wav",
  },
];
