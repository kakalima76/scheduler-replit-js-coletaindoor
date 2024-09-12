import { readFile } from "fs/promises";
import { url } from "inspector";
import moment from "moment-timezone";
import axios from "axios";

export async function loadJSON() {
  try {
    const data = await readFile(
      new URL("./roteiro.json", import.meta.url),
      "utf-8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao carregar o arquivo JSON:", error);
  }
}

export function getCurrentDateTime() {
  const now = moment().tz("America/Sao_Paulo");
  const dataHora = {
    dia: now.format("DD-MM-YYYY"),
    hora: now.format("HH:mm:ss"),
    dia_da_semana: now.day(), // Retorna o dia da semana como número (0 a 6)
    timestamp: now.valueOf(), // Retorna o timestamp atual em milissegundos
  };

  return dataHora;
}

export function transformPayload(payload) {
  const payloadModificado = payload.map((p) => ({
    id_integracao: p.id_integracao,
    id_veiculo: p.id_veiculo,
    placa: p.placa,
    prefixo: p.veiculo,
    data: p.data,
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return payloadModificado;
}

function convertToTimestamp(dateString, turno, hora) {
  const format = "DD-MM-YYYY HH:mm:ss";

  let digito = Number(dateString.substring(11, 13));
  let dia = Number(dateString.substring(0, 2));

  if (turno === 2 && digito < 12 && hora >= 18) {
    dia = dia + 1;
  }

  const str_dia = dia.toString().padStart(2, "0");

  dateString = `${str_dia}${dateString.substring(2)}`;

  let momentDate = moment.tz(dateString, format, "America/Sao_Paulo");

  return momentDate.valueOf(); // Retorna o timestamp em milissegundos
}

export async function getRoteiro(payloadModificado) {
  const roteiros = await loadJSON();
  const result = [];
  const { dia, hora, dia_da_semana, timestamp } = getCurrentDateTime();

  /**
   * Eu aqui, crio um objeto inicio e fim timestamp, que server basicamente para
   * Traduzir um iniico e um fim, para um timestamp dentro do dia corrente.
   */

  for (let pay of payloadModificado) {
    const index = roteiros.findIndex((x) => x.prefixo === pay.prefixo);
    const obj = roteiros[index];
    if (index !== -1) {
      pay.roteiro = obj.roteiro;
      pay.gerencia = obj.gerencia;
      pay.turno = obj.turno;
      pay.dias = obj.dias
        .toString()
        .split(",")
        .map((x) => Number(x));
      pay.inicio = obj.inicio;
      pay.fim = obj.fim;
      pay.inicio_timestamp = convertToTimestamp(
        `${dia} ${obj.inicio}`,
        obj.turno,
        hora
      );
      pay.fim_timestamp = convertToTimestamp(
        `${dia} ${obj.fim}`,
        obj.turno,
        hora
      );
      result.push(pay);
    }
  }

  const filter = result
    .filter((x) => x.dias.includes(dia_da_semana))
    .filter(
      (t) => t.inicio_timestamp <= timestamp && t.fim_timestamp >= timestamp
    );

  for (let f of filter) {
    const data = {};
    data[f.prefixo] = f;

    const config = {
      url: "https://igor-e1982-default-rtdb.firebaseio.com/telemetria.json",
      method: "patch",
      data,
    };
    try {
      await axios(config);
    } catch (e) {
      console.log(e);
    }
  }

  return filter;
}
