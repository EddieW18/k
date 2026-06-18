 let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Carregar produtos do JSON
async function carregarProdutos() {
  try {
    const response = await fetch('produtos.json');
    if (!response.ok) throw new Error('Arquivo JSON não encontrado');
    produtos = await response.json();
  } catch (error) {
    console.warn('Usando dados locais (fallback)');
    produtos = [
      { id: 1, nome: "Notebook Eco Pro", preco: 2899.90, categoria: "Notebooks", imagem: "https://picsum.photos/id/201/300/180" },
      { id: 2, nome: "Mouse Sem Fio", preco: 89.90, categoria: "Acessórios", imagem: "https://picsum.photos/id/160/300/180" },
      { id: 3, nome: "Teclado Mecânico RGB", preco: 249.90, categoria: "Acessórios", imagem: "https://picsum.photos/id/180/300/180" }
    ];
  }
  renderizarProdutos(produtos);
}

function renderizarProdutos(lista) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  lista.forEach(produto => {
    const div = document.createElement('div');
    div.className = 'card bg-white rounded-3xl overflow-hidden shadow-md';
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 class="font-bold text-lg">${produto.nome}</h3>
        <p class="text-sm text-slate-500">${produto.categoria}</p>
        <p class="text-xl font-semibold text-blue-600 mt-2">R$ ${produto.preco.toFixed(2)}</p>
        <button onclick="adicionarAoCarrinho(${produto.id})" class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full text-sm font-medium">
          Adicionar ao carrinho
        </button>
      </div>
    `;
    grid.appendChild(div);
  });
}

function filtrarProdutos() {
  const termo = document.getElementById('busca').value.toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  renderizarProdutos(filtrados);
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  carrinho.push(produto);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
}

function atualizarContador() {
  document.getElementById('contador-carrinho').textContent = carrinho.length;
}

function mostrarCarrinho() {
  const modal = document.getElementById('modal-carrinho');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  renderizarCarrinho();
}

function fecharCarrinho() {
  const modal = document.getElementById('modal-carrinho');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

function renderizarCarrinho() {
  const container = document.getElementById('carrinho-items');
  const totalSpan = document.getElementById('carrinho-total');

  if (carrinho.length === 0) {
    container.innerHTML = '<p class="text-center text-slate-500">Seu carrinho está vazio.</p>';
    totalSpan.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  container.innerHTML = '';
  carrinho.forEach((item, index) => {
    total += item.preco;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center border-b pb-2';
    div.innerHTML = `
      <div>
        <p class="font-medium">${item.nome}</p>
        <p class="text-sm text-slate-500">R$ ${item.preco.toFixed(2)}</p>
      </div>
      <button onclick="removerItemCarrinho(${index})" class="text-red-500 hover:text-red-700 text-sm">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    container.appendChild(div);
  });

  totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

function removerItemCarrinho(index) {
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
  renderizarCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) return;
  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
  const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  pedidos.push({
    id: Date.now(),
    data: new Date().toISOString(),
    itens: [...carrinho],
    total: total
  });
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  alert(`Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}\nPedido salvo localmente.`);
  carrinho = [];
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
  fecharCarrinho();
}

// Inicialização
atualizarContador();
carregarProdutos();
