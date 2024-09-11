import axios from "axios";
import FormData from "form-data";


const form = new FormData();
form.append("usuario", "comlurb.coletacidadao");
form.append("senha", "8yzUHC5t*@az<RM");


(async () => {
  try {

    const response = await axios.post("https://api.bysat.com.br/login", form, {
      headers: {
        ...form.getHeaders(),
      },
    });


    const token = response.data?.token;
    if (token) {
      const now = new Date();
      const dataAtual = now.toISOString();

      const data = {
        key: token,
        data: dataAtual, 
      };


      const config = {
        method: "patch",
        url: "https://igor-e1982-default-rtdb.firebaseio.com/token.json", 
        data,
        headers: {
          "Content-Type": "application/json",
        },
      };

       try {
        const patchResponse = await axios(config);
  
      } catch (patchError) {
        console.error(
          "Erro ao salvar o token:",
          patchError.response ? patchError.response.data : patchError.message
        );
      }
    } else {
      console.error("Token não encontrado na resposta.");
    }
  } catch (error) {
    console.error(
      "Erro:",
      error.response ? error.response.data : error.message
    );
  }
})();
