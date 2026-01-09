🚚 Gestão de Coletas (PWA)
Um ecossistema digital completo para motoristas e profissionais de logística, projetado para facilitar o controle de rotas e o monitoramento financeiro em tempo real. Este projeto foi desenvolvido como um Progressive Web App (PWA), permitindo instalação em dispositivos móveis e funcionamento offline através de Service Workers.

🌟 Diferenciais do Projeto
💻 Experiência de Aplicativo Nativo (PWA): Graças ao manifest.json e ao Service Worker, o app pode ser adicionado à tela inicial do smartphone, possui tela de carregamento (splash screen) e funciona de forma independente do navegador.

📊 Inteligência Financeira: Inclui um dashboard com gráficos dinâmicos (utilizando a biblioteca Chart.js) que separa lucros de despesas, calculando automaticamente o saldo líquido mensal.

🗺️ Logística e Rotas Inteligentes: Permite cadastrar múltiplos endereços de coleta e exportar a rota diretamente para o Google Maps, facilitando a navegação GPS.

⛽ Calculadora de Autonomia: Ferramenta integrada para estimar o consumo de combustível baseado na distância da rota e no consumo médio do veículo.

💾 Persistência de Dados: Utiliza o localStorage do navegador para garantir que nenhuma transação ou endereço seja perdido ao fechar a página.

🛠️ Tecnologias Utilizadas
Front-End: HTML5, CSS3 (Grid e Flexbox) e JavaScript Vanilla.

PWA: Service Workers para cache e offline, e Web App Manifest para instalação.

Gráficos: Chart.js para visualização de dados financeiros.

Integração: API de links profundos (Deep Links) para integração com Google Maps.

🚀 Funcionalidades Principais
Controle Financeiro: Adição de lançamentos com descrição e valor (positivo para lucro, negativo para gastos).

Resumo em Gráfico: Visualização rápida da proporção entre o que entra e o que sai da operação.

Gestão de Paradas: Lista de endereços de coleta que pode ser limpa ou editada diariamente.

Estimativa de Combustível: Cálculo automático de quantos litros serão necessários para completar a jornada do dia.
