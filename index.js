// const signalR = require("@aspnet/signalr");

//import {signalR} from "@aspnet/signalr/dist/browser/signalr";
//import {signalR} from "node_modules/@aspnet/signalr/dist/esm/index.js";

//console.log(signalR);

const _url_base = "http://localhost:60694";
const url_base = "https://lx-hub-delivery-api-hmg.azurewebsites.net";

const { HubConnection } = signalR;

function axiosPost(endpoint, data) {
  return axios({
    method: "POST",
    url: endpoint,
    data: data,
  });
}

async function loginServer(user, password) {
  //const loginToken =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTZWNyZXRLZXkiOiJtRDFtTlI5ekZlUnNvdlo4MnZlaEZRPT0iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6InRydWUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNjM3Y2U0ZC02ZmYwLTRlYjctOGViMy1kYjBhMmZlOThiNmUiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIxOC8wNS8yMDIxIDE4OjU4OjQxIiwibmJmIjoxNjIxMzcxNTIxLCJleHAiOjE2MjEzNzUxMjEsImlhdCI6MTYyMTM3MTUyMSwiaXNzIjoiSHViLURlbGl2ZXJ5IiwiYXVkIjoiNTQ1MTc2MjgwMDAxOTgifQ.qbgWUUgRAd1w0c0j0vFNywj9u8TGBYGdz1zgem6nO7U";
  const cnpj = document.getElementById("inpUsuario").value;
  const senha = document.getElementById("inpSenha").value;
  const tipoCon = document.querySelector('input[name="rgTypeConn"]:checked').value;

  const api = tipoCon === 'pdvone' ? 'IntegracaoPdvOne' : `CnpjLoja=${cnpj}`;

  const endpoint = `${url_base}/api/v1/usuario/token`;
  const data = {
    usuario: cnpj,
    senha: senha,
  };

  let resp = await axiosPost(endpoint, data);

  //console.log(resp);

  const loginToken = resp.data.access_token;  

  let hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(
      //`http://localhost:60694/pushNotification?CnpjLoja=${cnpj}`,
      //`http://localhost:60694/pushNotification?IntegracaoPdvOne`,
      `${url_base}/pushNotification?${api}`,

      // .withUrl(`https://lx-hub-delivery-api-hmg.azurewebsites.net/pushNotification?CnpjLoja=${cnpj}`,
      {
        accessTokenFactory: () => loginToken,
        //skipNegotiation: true,
        //transport: signalR.HttpTransportType.WebSockets
      }
    )
    .build();

  hubConnection.onclose(() => {
    console.log("connection closed");

    // setTimeout(() => {
    //   console.log("try to re start connection");

    //   hubConnection
    //     .start()
    //     .then(() => {
    //       console.log("connection re started");
    //     })
    //     .catch((err) => console.log(err));
    // }, 5000);
  });

  hubConnection.on("ConnectionSuccess", (data) => {
    console.log(`ConnectionSuccess - client Id: ${data}`);
    // hubConnection.invoke('autenticar', data, `{cnpj_Parceiro: "54517628000198", token: "${loginToken}"}`).catch(err => console.log(err));
  });

  hubConnection.on("ConnectionRejected", (data) => {
    console.log(`ConnectionRejected - client Id: ${data}`);
    // hubConnection.invoke('autenticar', data, `{cnpj_Parceiro: "54517628000198", token: "${loginToken}"}`).catch(err => console.log(err));
  });

  hubConnection.on("RaiseError", (data) => {
    console.log(`RaiseError: ${data}`);
  });

  hubConnection.on("Notificacao", (data) => {
    console.log(`Notificacao: ${data}`);
  });

  hubConnection
    .start()
    .then(() => {
      console.log("connection started");
    })
    .catch((err) => console.log(err));
}
