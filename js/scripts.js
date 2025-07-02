const API_URL = 'http://localhost:5000/carros';

/*
  1. Listar todos os carros
*/
async function listarCarros() {
  try {
    const res = await fetch('http://localhost:5000/carros');
    const carros = await res.json();
    renderizarCarros(carros);
  } catch (error) {
    console.error('Erro ao listar carros:', error);
  }
}

/*
  2. Enviar novo carro
*/
async function enviarCarro() {
  const marca = document.getElementById("marca").value;
  const placa = document.getElementById("placa").value;
  const data = document.getElementById("data").value;
  const horaEntrada = document.getElementById("horaEntrada").value;
  const horaSaida = document.getElementById("horaSaida").value;

  if (!marca || !placa || !data || !horaEntrada || !horaSaida) {
    alert("Preencha todos os campos!");
    return;
  }

  const entrada = `${data} ${horaEntrada}:00`;
  const saida = `${data} ${horaSaida}:00`;

  const carro = { marca, placa, entrada, saida };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(carro)
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Carro adicionado com sucesso!");

      // Limpa campos
      document.getElementById("marca").value = "";
      document.getElementById("placa").value = "";
      document.getElementById("data").value = "";
      document.getElementById("horaEntrada").value = "";
      document.getElementById("horaSaida").value = "";

   
    } else {
      alert("❌ Erro ao adicionar carro: " + result.erro);
    }
  } catch (err) {
    alert("❌ Erro ao adicionar carro: " + err.message);
  }
  listarCarros();    // Atualiza a lista
}

/*
  3. Deletar carro pelo ID
*/

async function deletarCarro() {
  const selecionados = document.querySelectorAll('.carro-checkbox:checked');

  if (selecionados.length === 0) {
    alert('Selecione ao menos um carro para apagar.');
    return;
  }

  if (!confirm('Tem certeza que deseja apagar os carros selecionados?')) return;

  for (const checkbox of selecionados) {
    const id = checkbox.value;
    try {
      await fetch(`http://localhost:5000/carros/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error(`Erro ao apagar carro ${id}:`, err);
    }
  }

  listarCarros(); // Atualiza a lista após apagar
}


/*
  4. Renderizar carros na lista
*/
function renderizarCarros(carros) {
  const tbody = document.querySelector("#lista-carros tbody");
  tbody.innerHTML = ""; // limpa a tabela

  carros.forEach(carro => {
    const entradaHora = carro.entrada.split(" ")[1];
    const saidaHora = carro.saida.split(" ")[1];
    const data = carro.entrada.split(" ")[0];

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${carro.marca}</td>
      <td>${carro.placa}</td>
      <td>${data}</td>
      <td>${entradaHora}</td>
      <td>${saidaHora}</td>
      <td><input type="checkbox" class="carro-checkbox" value="${carro.id}"></td>
      <td style="text-align:left;">
       <button onclick="deletarCarro(${carro.id})" style="border:yes; background: yes ; cursor:pointer;" title="Apagar">
          🗑️
        </button>
    `;
    document.addEventListener("DOMContentLoaded", () => {
  listarCarros(); // ou qualquer função que chama renderizarCarros
});
    tbody.appendChild(linha);
  });
}

/*
  5. Limpa  formulário
*/  
function limparCampos() {
  document.getElementById("marca").value = "";
  document.getElementById("placa").value = "";
  document.getElementById("data").value = "";
  document.getElementById("horaEntrada").value = "";
  document.getElementById("horaSaida").value = "";  
  document.getElementById("lista-carros").innerHTML = ""; // Limpa a lista de carros   
  
  
}


