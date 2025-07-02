const API_URL = 'http://localhost:5000/carros';


 // 1. Listar todos os carros ou filtrar por marca, placa ou data

async function pesquisarCarros() {
  const marca = document.getElementById("marca").value.trim();
  const placa = document.getElementById("placa").value.trim();
  const data = document.getElementById("data").value;

  const params = {};

  if (marca) params.marca = marca;
  if (placa) params.placa = placa;
  if (data) {
    params.entrada_de = data;
    params.entrada_ate = data;
  }

  try {
    const query = new URLSearchParams(params).toString();
    const url = Object.keys(params).length > 0
      ? `http://localhost:5000/carros/filtrar?${query}`
      : `http://localhost:5000/carros`;

    const res = await fetch(url);
    const carros = await res.json();

    renderizarCarros(carros);
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
  }
}

 //3. inserir um  novo carro

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
  pesquisarCarros();    // Atualiza a lista
}

  // 4. Deletar carro pelo ID

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

  pesquisarCarros(); // Atualiza a lista após apagar
}

 // 5. Renderizar carros na lista

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
  pesquisarCarros(); 
});
    tbody.appendChild(linha);
  });
}

 // 6. Limpa  formulário

function limparCampos() {
  document.getElementById("marca").value = "";
  document.getElementById("placa").value = "";
  document.getElementById("data").value = "";
  document.getElementById("horaEntrada").value = "";
  document.getElementById("horaSaida").value = "";  
  document.querySelector("#lista-carros tbody").innerHTML = ""; 
    
}


