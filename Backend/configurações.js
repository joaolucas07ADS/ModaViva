const SUPABASE_URL = 'https://dlmpmdcheqgvbcnpwjna.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OLelVWrA1IYBw3ySwz0qoA_L4W0CccQ';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. MENU LATERAL
document.getElementById("opem_btn").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("open-sidebar");
});

// Elementos da tela
const inputLimite = document.getElementById('limite_estoque');
const listaPerigosos = document.getElementById('lista_perigosos');
const selectProduto = document.getElementById('select_produto');
const inputQtdMovimento = document.getElementById('qtd_movimento');

// --- LÓGICA DE ALERTA ---
const limiteSalvo = localStorage.getItem('limiteEstoque') || 5;
inputLimite.value = limiteSalvo;

async function atualizarListaPerigosos() {
    const limiteAtual = Number(inputLimite.value);
    try {
        const { data, error } = await _supabase.from('Estoque').select('Produto, quantidade_total');
        if (error) throw error;
        const produtosAfetados = data.filter(item => item.quantidade_total > 0 && item.quantidade_total <= limiteAtual);
        listaPerigosos.innerHTML = "";
        if (produtosAfetados.length === 0) {
            listaPerigosos.innerHTML = "<li style='color: #10b981;'>Nenhum produto em nível perigoso!</li>";
        } else {
            produtosAfetados.forEach(item => {
                listaPerigosos.innerHTML += `<li>• <b>${item.Produto}</b> (${item.quantidade_total})</li>`;
            });
        }
    } catch (err) { console.error(err); }
}

document.getElementById('btn-salvar-limite').addEventListener('click', () => {
    localStorage.setItem('limiteEstoque', inputLimite.value);
    alert("Limite salvo!");
    atualizarListaPerigosos();
});

inputLimite.addEventListener('input', atualizarListaPerigosos);

// --- LÓGICA DE MOVIMENTAÇÃO ---

// 1. Preencher o select com os produtos do banco
async function carregarProdutosNoSelect() {
    try {
        const { data, error } = await _supabase.from('Estoque').select('Estoque_id, Produto, quantidade_total');
        if (error) throw error;

        selectProduto.innerHTML = '<option value="">Selecione um produto...</option>';
        data.forEach(item => {
            // Guardamos a quantidade atual num atributo "data-qtd" para facilitar o cálculo depois
            selectProduto.innerHTML += `<option value="${item.Estoque_id}" data-qtd="${item.quantidade_total}">${item.Produto} (Atual: ${item.quantidade_total})</option>`;
        });
    } catch (err) { console.error("Erro ao carregar select:", err); }
}

// 2. Função para processar a Entrada ou Saída
async function processarMovimento(tipo) {
    const id = selectProduto.value;
    const valorMovimento = Number(inputQtdMovimento.value);
    const optionSelecionada = selectProduto.options[selectProduto.selectedIndex];
    
    if (!id || valorMovimento <= 0) {
        alert("Selecione um produto e digite uma quantidade válida!");
        return;
    }

    const qtdAtual = Number(optionSelecionada.getAttribute('data-qtd'));
    let novaQtd = (tipo === 'entrada') ? (qtdAtual + valorMovimento) : (qtdAtual - valorMovimento);

    if (novaQtd < 0) {
        alert("Erro: A saída não pode ser maior que o estoque atual!");
        return;
    }

    try {
        const { error } = await _supabase
            .from('Estoque')
            .update({ quantidade_total: novaQtd })
            .eq('Estoque_id', id);

        if (error) throw error;

        alert(`Sucesso! Nova quantidade: ${novaQtd}`);
        inputQtdMovimento.value = "";
        
        // Atualiza tudo na tela sem precisar dar F5
        await carregarProdutosNoSelect();
        await atualizarListaPerigosos();

    } catch (err) {
        alert("Erro ao atualizar banco de dados.");
        console.error(err);
    }
}

// Eventos dos botões de movimento
document.getElementById('btn-entrada').addEventListener('click', () => processarMovimento('entrada'));
document.getElementById('btn-saida').addEventListener('click', () => processarMovimento('saida'));

// Inicialização
carregarProdutosNoSelect();
atualizarListaPerigosos();