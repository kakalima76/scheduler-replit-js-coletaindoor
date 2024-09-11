import { getCurrentDateTime, getRoteiro, loadJSON } from "./services.mjs";

const data = [
  {
    id_integracao: 27154043417,
    id_prefixo: 79251,
    placa: "4106787",
    prefixo: "T102",
    data: "09/09/2024 06:47:30",
    latitude: "-22.981351",
    longitude: "-43.213695",
  },
  {
    id_integracao: 27154043367,
    id_prefixo: 79426,
    placa: "4106790",
    prefixo: "X207",
    data: "09/09/2024 06:47:30",
    latitude: "-22.814248",
    longitude: "-43.289748",
  },
  {
    id_integracao: 27154040569,
    id_prefixo: 79342,
    placa: "4106803",
    prefixo: "X206",
    data: "09/09/2024 06:46:55",
    latitude: "-23.017485",
    longitude: "-43.463766",
  },
  {
    id_integracao: 27154043458,
    id_prefixo: 79401,
    placa: "4106909",
    prefixo: "T103",
    data: "09/09/2024 06:47:30",
    latitude: "-22.981248",
    longitude: "-43.213833",
  },
  {
    id_integracao: 27154044115,
    id_prefixo: 79409,
    placa: "4106942",
    prefixo: "T101",
    data: "09/09/2024 06:47:18",
    latitude: "-22.952611",
    longitude: "-43.184303",
  },
];

//getRoteiro(data);

(async function () {
  const roteiros = await loadJSON();
  const date = getCurrentDateTime();
})();
