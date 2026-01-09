// --- REGISTRO DO SERVICE WORKER (PWA) ---
// Isso deve vir antes de tudo
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registrado.', reg))
            .catch(err => console.log('Falha ao registrar Service Worker: ', err));
    });
}


// --- CÓDIGO DO APP (DENTRO DO DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {

    // --- SEÇÃO FINANCEIRA ---
    const formTransacao = document.getElementById('form-transacao');
    const listaTransacoes = document.getElementById('lista-transacoes');
    const totalLucrosEl = document.getElementById('total-lucros');
    const totalGastosEl = document.getElementById('total-gastos');
    const saldoLiquidoEl = document.getElementById('saldo-liquido');

    // --- Variáveis do Gráfico ---
    const ctx = document.getElementById('grafico-financeiro').getContext('2d');
    let meuGrafico; // Variável global para guardar a instância do gráfico

    // Carrega transações salvas ou inicia um array vazio
    let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

    // Função para salvar no localStorage
    function salvarTransacoes() {
        localStorage.setItem('transacoes', JSON.stringify(transacoes));
    }

    // --- NOVA FUNÇÃO: ATUALIZAR GRÁFICO ---
    function atualizarGrafico(lucros, gastos) {
        // Se o gráfico já existe, destrói ele antes de criar um novo
        // Isso evita que os gráficos se sobreponham
        if (meuGrafico) {
            meuGrafico.destroy();
        }

        meuGrafico = new Chart(ctx, {
            type: 'doughnut', // Tipo "pizza"
            data: {
                labels: ['Lucros', 'Gastos'],
                datasets: [{
                    label: 'Resumo Financeiro',
                    data: [lucros, gastos],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)', // Verde (lucro)
                        'rgba(220, 53, 69, 0.8)'  // Vermelho (gasto)
                    ],
                    borderColor: [
                        '#ffffff',
                        '#ffffff'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permite que o CSS controle o tamanho
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Função para atualizar o DOM (a tela)
    function atualizarDOMFinanceiro() {
        listaTransacoes.innerHTML = '';
        let lucros = 0;
        let gastos = 0;

        listaTransacoes.addEventListener('click', (e) => {
    // Verifica se o clique foi em um botão com a classe 'btn-delete'
         if (e.target.classList.contains('btn-delete')) {
            // Pega o ID que colocamos no botão
            const idParaDeletar = parseInt(e.target.dataset.id); 

            // Filtra o array, mantendo apenas os itens com ID *diferente*
            transacoes = transacoes.filter(t => t.id !== idParaDeletar);

            // Salva e atualiza a tela
            salvarTransacoes();
            atualizarDOMFinanceiro();
             }
        });

        transacoes.forEach(transacao => {
            const valor = transacao.valor;
            const tipo = valor > 0 ? 'lucro' : 'gasto';
            const cssClass = valor > 0 ? 'lucro' : 'gasto';

            if (tipo === 'lucro') {
                lucros += valor;
            } else {
                gastos += Math.abs(valor); // Math.abs para somar gastos como positivos
            }

            // Cria o item da lista
            const li = document.createElement('li');
            li.innerHTML = `
                ${transacao.descricao} 
                <span class="${cssClass}">R$ ${valor.toFixed(2)}</span>
                <button class="btn-delete" data-id="${transacao.id}">X</button>
            `;
            listaTransacoes.appendChild(li);
        });

        // Atualiza o resumo
        totalLucrosEl.textContent = `R$ ${lucros.toFixed(2)}`;
        totalGastosEl.textContent = `R$ ${gastos.toFixed(2)}`;
        const saldo = lucros - gastos;
        saldoLiquidoEl.textContent = `R$ ${saldo.toFixed(2)}`;
        
        // Muda a cor do saldo
        saldoLiquidoEl.style.color = saldo >= 0 ? 'green' : 'red';

        // --- ATUALIZA O GRÁFICO ---
        atualizarGrafico(lucros, gastos);
    }

    // Evento de submit do formulário financeiro
    formTransacao.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const descricao = document.getElementById('descricao').value;
        const valor = parseFloat(document.getElementById('valor').value);

        if (descricao.trim() === '' || isNaN(valor)) {
            alert('Por favor, preencha a descrição e o valor.');
            return;
        }

        const transacao = {
            id: Date.now(), // ID único baseado no tempo
            descricao: descricao,
            valor: valor
        };

        // Adiciona ao array
        transacoes.push(transacao);

        // Salva e atualiza
        salvarTransacoes();
        atualizarDOMFinanceiro();

        // Limpa o formulário
        formTransacao.reset();
    });


    // --- SEÇÃO DE ROTAS (Versão Simples) ---
    const formRota = document.getElementById('form-rota');
    const listaParadas = document.getElementById('lista-paradas');
    const btnOtimizar = document.getElementById('btn-otimizar-google');
    const btnLimparRota = document.getElementById('btn-limpar-rota');

    let paradas = JSON.parse(localStorage.getItem('paradas')) || [];

    function salvarParadas() {
        localStorage.setItem('paradas', JSON.stringify(paradas));
    }

    function atualizarDOMRotas() {
        listaParadas.innerHTML = '';
       paradas.forEach((parada, index) => {
            const li = document.createElement('li');
            // Adicionamos o botão de deletar, usando o 'index' como data-id
            li.innerHTML = `
                <span>${parada}</span>
                <button class="btn-delete" data-id="${index}">X</button>
            `;
            listaParadas.appendChild(li);

            btnLimparRota.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja apagar todas as paradas?')) {
                paradas = [];
                salvarParadas();
                atualizarDOMRotas();
                }
            });


        });
    }

    formRota.addEventListener('submit', (e) => {
        e.preventDefault();
        const endereco = document.getElementById('endereco').value;

        if (endereco.trim() === '') return;

        paradas.push(endereco);
        salvarParadas();
        atualizarDOMRotas();
        formRota.reset();

        listaParadas.addEventListener('click', (e) => {
    // Verifica se o clique foi no botão de deletar
    if (e.target.classList.contains('btn-delete')) {
        
        // Pega o 'data-id' (que neste caso é o índice do array)
        const indexParaDeletar = parseInt(e.target.dataset.id);

        // Não precisa de confirmação aqui, ou se preferir pode adicionar
        // if (confirm('Remover esta parada?')) { ... }

        // 1. Remove o item do array usando seu índice
        //    O splice altera o array original, removendo '1' item na posição 'indexParaDeletar'
        paradas.splice(indexParaDeletar, 1);
        
        // 2. Salva o novo array modificado
        salvarParadas();
        
        // 3. Atualiza a tela
        atualizarDOMRotas();
    }

    const btnOtimizar = document.getElementById('btn-otimizar-google');

    // --- INÍCIO DO NOVO CÓDIGO ---
    
    // 1. Pegar os novos elementos
    const inputConsumo = document.getElementById('consumo-medio');
    const inputDistancia = document.getElementById('distancia-total');
    const resultadoLitrosEl = document.getElementById('resultado-litros');

    // 2. Criar a função de cálculo
    function calcularLitros() {
        const consumo = parseFloat(inputConsumo.value);
        const distancia = parseFloat(inputDistancia.value);

        // Se ambos os valores forem números válidos e positivos
        if (consumo > 0 && distancia > 0) {
            const litros = distancia / consumo;
            resultadoLitrosEl.textContent = litros.toFixed(2); // ex: 42.86 L
        } else {
            resultadoLitrosEl.textContent = "0.00";
        }
    }

        // 3. Adicionar eventos para calcular automaticamente
        inputConsumo.addEventListener('input', calcularLitros);
        inputDistancia.addEventListener('input', calcularLitros);

        // 4. (BÔNUS) Salvar e carregar o consumo médio no localStorage
        // Para que ele não precise digitar toda vez
        
        // Ao carregar a página
        if (localStorage.getItem('consumoMedio')) {
            inputConsumo.value = localStorage.getItem('consumoMedio');
        }

        // Ao digitar o consumo
        inputConsumo.addEventListener('input', () => {
            localStorage.setItem('consumoMedio', inputConsumo.value);
            calcularLitros(); // Recalcula
        });

        // Ao digitar a distância (não salvamos, pois muda todo dia)
        inputDistancia.addEventListener('input', calcularLitros);
        
        // --- FIM DO NOVO CÓDIGO ---


        let paradas = JSON.parse(localStorage.getItem('paradas')) || [];
    // ... (o resto do seu código de rotas continua) ...
});
// --- FIM DO BLOCO NOVO ---


// --- O "Pulo do Gato" para Rotas sem API ---
// (O restante do seu código continua aqui, começando pelo btnOtimizar...)
    });

    // O "Pulo do Gato" para Rotas sem API
    btnOtimizar.addEventListener('click', () => {
        if (paradas.length < 2) {
            alert('Adicione pelo menos dois endereços para criar uma rota.');
            return;
        }

        // Isso não otimiza, mas abre o Google Maps com os pontos
        // O Google Maps no celular vai otimizar para ele!
        
        // Pega o primeiro como origem
        const origem = encodeURIComponent(paradas[0]);
        // Pega o último como destino
        const destino = encodeURIComponent(paradas[paradas.length - 1]);
        
        // Pega os pontos do meio (waypoints)
        const waypoints = paradas.slice(1, -1).map(p => encodeURIComponent(p)).join('|');

        let url = `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}`;
        
        if (waypoints) {
            url += `&waypoints=${waypoints}`;
        }
        
        // Abre em uma nova aba
        window.open(url, '_blank');
    });

    // --- INICIALIZAÇÃO ---
    // Carrega os dados salvos ao abrir a página
    atualizarDOMFinanceiro();
    atualizarDOMRotas();
});