const baseUrl = "https://api-catraca-weld.vercel.app/alunos";
const lista_todos = "https://api-catraca-weld.vercel.app/alunos/lista";

const formularioCriacao = document.getElementById("create-form");
const inputNomeCriacao = document.getElementById("create-name");
const inputCpfCriacao = document.getElementById("create-cpf");
const listaAlunos = document.getElementById("alunos-lista");

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function exibirAlunosNaTela(alunos) {
  listaAlunos.innerHTML = "";

  if (alunos.length === 0) {
    listaAlunos.innerHTML = "<p class='text-gray-400'>Nenhum aluno encontrado.</p>";
    return;
  }

  alunos.forEach(aluno => {
    const div = document.createElement("div");
    div.className = "bg-zinc-700 p-4 rounded-md flex justify-between items-center";

    div.innerHTML = `
      <div>
        <h3 class="font-bold text-white">${aluno.nome}</h3>
        <p class="text-sm text-gray-400">${formatarCPF(aluno.cpf)}</p>
      </div>
      <span class="text-xs bg-purple-600 px-3 py-1 rounded-full text-white">ID: ${aluno.id}</span>
    `;

    listaAlunos.appendChild(div);
  });
}

//listar
async function buscarListarAlunos() {
  console.log("Buscando alunos...");
  try {
    listaAlunos.innerHTML = "<p>Carregando alunos...</p>";

    const cpf = await fetch(lista_todos);
    const alunos = await cpf.json();

    exibirAlunosNaTela(alunos);
  } catch (erro) {
    console.error("Erro ao buscar alunos:", erro);
    listaAlunos.innerHTML = `<p class="text-red-500">Erro ao carregar alunos: ${erro.message}</p>`;
  }
}

//adicionar
async function adicionarAluno(evento) {
  evento.preventDefault();
  console.log("Tentando adicionar um novo aluno...");

  const nome = inputNomeCriacao.value.trim();
  const cpf = inputCpfCriacao.value.trim();

  if (!nome || !cpf) {
    alert("Por favor, preencha o nome e CPF.");
    return;
  }

console.log(nome)
console.log(cpf)

  const novoAluno = {
    nome: nome,
    cpf: cpf 
  };

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(novoAluno)
    });

    // Pega a resposta como texto
    const textoResposta = await response.json();

    // Tenta converter a resposta para JSON
    let resultadoApi;
    try {
      resultadoApi = JSON.parse(textoResposta);
    } catch (erro) {
      console.error("Falha ao adicionar aluno:", erro);
      console.error("Resposta da API:", textoResposta); // Adicione esta linha
      alert(`Erro ao adicionar aluno: ${erro.message}`)
    }

    if (!response.ok) {
      throw new Error(resultadoApi.mensagem || `Erro ao adicionar aluno: ${response.status}`);
    }

    console.log("Aluno adicionado com sucesso!", resultadoApi);
    alert(resultadoApi.mensagem);

    inputNomeCriacao.value = '';
    inputCpfCriacao.value = '';

    buscarListarAlunos();
  } catch (erro) {
    console.error("Falha ao adicionar aluno:", erro);
    alert(`Erro ao adicionar aluno: ${erro.message}`);
  }
}

//editar
async function atualizarAluno(evento) {
  evento.preventDefault();
  console.log("Tentando atualizar aluno...");

  const id = inputAtualizacaoId.value;
  const nome = inputNomeAtualizacao.value;
  const cpf = inputcpfAtualizacao.value;

  const dadosAlunoAtualizada = {
      nome: nome,
      cpf: cpf
  };

  if (!id) {
      console.error("ID da Aluno para atualização não encontrado!");
      alert("Erro interno: ID da Aluno não encontrado para atualizar.");
      return;
  }

  if (!nome || !cpf) {
      alert("Por favor, preencha a nome e a cpf para atualizar.");
      return;
  }

  try {
      const cpfHttp = await fetch(`${baseUrl}/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosAlunoAtualizada)
      });

      const resultadoApi = await cpfHttp.json();

      if (!cpfHttp.ok) {
          throw new Error(resultadoApi.mensagem || `Erro ao atualizar Aluno: ${cpfHttp.status}`);
      }

      console.log("Aluno atualizado com sucesso! ID:", id);
      alert(resultadoApi.mensagem);

      esconderFormularioAtualizacao();
      await buscarListarAlunos();

  } catch (erro) {
      console.error("Falha ao atualizar Aluno:", erro);
      alert(`Erro ao atualizar Aluno: ${erro.message}`);
  }
}

// Eventos
formularioCriacao.addEventListener("submit", adicionarAluno);

// Inicialização
buscarListarAlunos();
