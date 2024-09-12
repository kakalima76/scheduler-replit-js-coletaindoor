import axios from "axios";
import { transformPayload, getRoteiro } from "./services.mjs";

(async () => {
  try {
    const result = await axios.get(
      "https://igor-e1982-default-rtdb.firebaseio.com/token.json"
    );

    const { data } = result;
    const { key } = data;

    const config = {
      method: "get",
      url: "https://api.bysat.com.br/getUltimaPosicao?status=a",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios(config);
    const { status } = response;

    if (status === (200 || 201 || 304)) {
      const payload = transformPayload(response.data);
      const telemetriaFiltrada = await getRoteiro(payload);
      const coordenadas = [];
      const url =
        "https://igor-e1982-default-rtdb.firebaseio.com/coordenadas.json";
      try {
        const response = await axios.get(url);
        const { data } = response;
        const lista = Object.keys(data);
        for (let l of lista) {
          coordenadas.push(data[l]);
        }

        for (let c of coordenadas) {
          const index = telemetriaFiltrada.findIndex(
            (x) => x.roteiro === c.roteiro.toUpperCase()
          );

          if (index !== -1) {
            const {
              data,
              latitude,
              longitude,
              prefixo,
              placa,
              dias,
              inicio_timestamp,
              fim_timestamp,
            } = telemetriaFiltrada[index];

            c = {
              ...c,
              atualizacao: data,
              lat_veiculo: latitude,
              lng_veiculo: longitude,
              prefixo: prefixo,
              placa: placa,
              dias,
              inicio_timestamp,
              fim_timestamp,
            };

            const obj = {};
            obj[c.id] = c;

            console.log(obj);

            const config = {
              method: "patch",
              data: obj,
              url: "https://igor-e1982-default-rtdb.firebaseio.com/coordenadas.json",
            };

            try {
              await axios(config);
            } catch (e) {
              console.log(e);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (error) {
    console.error(
      "Erro na requisição:",
      error.response ? error.response.data : error.message
    );
  }
})();
