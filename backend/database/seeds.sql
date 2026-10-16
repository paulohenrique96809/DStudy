-- ============================================
-- MATÉRIAS
-- ============================================
INSERT INTO materias (nome, descricao) VALUES
('Modelagem e Desenvolvimento de Banco de Dados', 'Ensina a projetar, criar e gerenciar bancos de dados de forma eficiente e segura.'),
('Inteligência Artificial', 'Introduz conceitos de IA, aprendizado de máquina e aplicações em sistemas inteligentes.'),
('Programação Back-End', 'Desenvolve a lógica do servidor, APIs e integração com bancos de dados.'),
('Programação Front-End', 'Cria interfaces web interativas, responsivas e focadas na experiência do usuário.'),
('Programação Mobile', 'Ensina o desenvolvimento de aplicativos para dispositivos móveis.'),
('Projeto Multidisciplinar em Desenvolvimento de Sistemas', 'Integra conhecimentos do curso na criação de um projeto prático de software.'),
('Versionamento de Código e Sistemas de Mensageria', 'Aborda controle de versões com Git e comunicação entre sistemas por mensageria.'),
('Lógica de Programação', 'Ensina os fundamentos da programação por meio de algoritmos e raciocínio lógico.'),
('Processos de Desenvolvimento de Software', 'Aborda metodologias, etapas e boas práticas na criação de sistemas.'),
('Redes e Segurança', 'Introduz conceitos de redes de computadores, segurança da informação e proteção de sistemas.');


-- ============================================
-- FLASHCARDS - Modelagem e Desenvolvimento de Banco de Dados (materia_id = 1)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(1, 'Uma loja precisa guardar nome, telefone e e-mail de milhares de clientes de forma organizada. Qual solução é a mais adequada?', 'Um banco de dados', 'Um editor de imagens', 'Um antivírus', 'Um navegador de internet', 'a', 1),
(1, 'A sigla SGBD se refere a qual tipo de software?', 'Sistema Gerenciador de Banco de Dados', 'Sistema Geral de Backup Digital', 'Serviço Global de Backup de Dados', 'Sistema de Gestão de Bases Digitais', 'a', 1),
(1, 'Em uma tabela de clientes, cada linha representa:', 'Um registro (um cliente)', 'Um atributo', 'Uma chave estrangeira', 'Um tipo de dado', 'a', 1),
(1, 'Em uma tabela de clientes, "nome", "telefone" e "e-mail" são exemplos de:', 'Atributos (colunas)', 'Registros', 'Relacionamentos', 'Consultas', 'a', 1),
(1, 'Qual das opções abaixo é um SGBD?', 'PostgreSQL', 'Photoshop', 'Google Chrome', 'Word', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(1, 'Para garantir que dois clientes nunca tenham o mesmo identificador na tabela, usamos:', 'Chave primária', 'Chave estrangeira', 'Índice de texto', 'Visão (view)', 'a', 2),
(1, 'Qual comando traz os dados de uma tabela para visualização?', 'SELECT', 'INSERT', 'UPDATE', 'DROP', 'a', 2),
(1, 'Você precisa cadastrar um novo cliente na tabela. Qual comando usar?', 'INSERT INTO', 'SELECT FROM', 'ALTER TABLE', 'DROP TABLE', 'a', 2),
(1, 'Qual comando cria uma tabela nova no banco?', 'CREATE TABLE', 'INSERT TABLE', 'SELECT TABLE', 'UPDATE TABLE', 'a', 2),
(1, 'Na tabela "pedidos", a coluna "id_cliente" aponta para a tabela "clientes". Essa coluna funciona como:', 'Chave estrangeira', 'Chave primária', 'Índice único', 'Atributo calculado', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(1, 'Antes de criar as tabelas, o projetista desenha um diagrama com entidades e relacionamentos. Esse diagrama pertence ao:', 'Modelo Entidade-Relacionamento (MER)', 'Modelo de rede de computadores', 'Modelo de testes de software', 'Modelo de backup incremental', 'a', 3),
(1, 'Para listar apenas os clientes da cidade de São Paulo, qual cláusula deve ser usada?', 'WHERE', 'ORDER BY', 'GROUP BY', 'LIMIT', 'a', 3),
(1, 'Um cliente mudou de telefone. Qual comando altera o dado já cadastrado?', 'UPDATE', 'INSERT', 'CREATE', 'SELECT', 'a', 3),
(1, 'Qual comando remove registros específicos de uma tabela?', 'DELETE', 'REMOVE TABLE', 'CLEAR', 'TRUNCATE COLUMN', 'a', 3),
(1, 'A normalização tem como principal objetivo:', 'Organizar as tabelas para reduzir redundância de dados', 'Aumentar a quantidade de tabelas sem critério', 'Criptografar todos os dados do banco', 'Acelerar a conexão com a internet', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(1, 'Para exibir o nome do cliente junto com os dados do pedido dele, que estão em tabelas diferentes, usamos:', 'JOIN', 'DROP', 'TRUNCATE', 'COMMIT', 'a', 4),
(1, 'Uma tabela está na 1ª Forma Normal quando:', 'Cada campo guarda apenas um valor, sem listas dentro da célula', 'Possui no mínimo três chaves primárias', 'Não tem nenhuma coluna de texto', 'Todos os campos aceitam valor nulo', 'a', 4),
(1, 'Um autor pode escrever vários livros, mas cada livro tem apenas um autor. Esse relacionamento é do tipo:', 'Um para muitos (1:N)', 'Um para um (1:1)', 'Muitos para muitos (N:N)', 'Autorrelacionamento', 'a', 4),
(1, 'A integridade referencial impede, por exemplo:', 'Cadastrar um pedido para um cliente que não existe', 'Criar mais de uma tabela no mesmo banco', 'Usar letras maiúsculas nos nomes das colunas', 'Fazer consultas com mais de uma condição', 'a', 4),
(1, 'No diagrama entidade-relacionamento, o losango geralmente representa:', 'Um relacionamento', 'Uma entidade', 'Um atributo', 'Uma chave primária', 'a', 4);


-- ============================================
-- FLASHCARDS - Inteligência Artificial (materia_id = 2)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(2, 'IA é a sigla de:', 'Inteligência Artificial', 'Integração Automática', 'Interface Analítica', 'Informática Aplicada', 'a', 1),
(2, 'Qual das situações abaixo mostra uma IA em ação?', 'Um app que reconhece o rosto do usuário para desbloquear o celular', 'Uma calculadora somando dois números', 'Um relógio mostrando as horas', 'Um editor de texto salvando um arquivo', 'a', 1),
(2, 'De forma simples, a IA busca fazer com que máquinas:', 'Realizem tarefas que normalmente exigiriam inteligência humana', 'Substituam todos os componentes físicos do computador', 'Funcionem sem energia elétrica', 'Armazenem arquivos sem limite de espaço', 'a', 1),
(2, 'No Machine Learning, o sistema melhora seu desempenho a partir de:', 'Dados e experiência', 'Atualizações manuais de hardware', 'Cabos de rede mais rápidos', 'Telas com maior resolução', 'a', 1),
(2, 'Um programa que responde perguntas de clientes em um site, simulando uma conversa, é um:', 'Chatbot', 'Compilador', 'Firewall', 'Banco de dados', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(2, 'Para ensinar um modelo a reconhecer gatos em fotos, o que precisamos fornecer a ele?', 'Muitas imagens de exemplo (dados de treinamento)', 'Apenas o nome do modelo', 'Um cabo de rede mais potente', 'Uma senha de acesso', 'a', 2),
(2, 'As redes neurais artificiais se inspiram:', 'No funcionamento do cérebro humano', 'No funcionamento de impressoras', 'Na estrutura de cabos de fibra óptica', 'No sistema de arquivos do Windows', 'a', 2),
(2, 'Na IA, um algoritmo pode ser descrito como:', 'Uma sequência de passos para resolver um problema', 'Um componente físico da placa-mãe', 'Um tipo de arquivo de imagem', 'Um aplicativo de edição de vídeo', 'a', 2),
(2, 'Qual área da IA permite que um sistema interprete o que aparece em fotos e vídeos?', 'Visão Computacional', 'Computação em nuvem', 'Redes cabeadas', 'Banco de dados relacional', 'a', 2),
(2, 'Quando um assistente virtual entende a frase que você falou e responde de forma coerente, ele está usando:', 'Processamento de Linguagem Natural (PLN)', 'Compressão de arquivos', 'Montagem de hardware', 'Roteamento de redes', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(2, 'Qual afirmação descreve corretamente a relação entre IA e Machine Learning?', 'Machine Learning é uma subárea da IA', 'IA é uma subárea do Machine Learning', 'São exatamente a mesma coisa', 'Não têm nenhuma relação', 'a', 3),
(2, 'O Deep Learning se diferencia por utilizar:', 'Redes neurais com muitas camadas', 'Apenas regras escritas manualmente', 'Um único cálculo matemático simples', 'Somente planilhas eletrônicas', 'a', 3),
(2, 'Um modelo acerta quase 100% nos dados de treino, mas erra muito em dados novos. Esse problema se chama:', 'Overfitting', 'Backup', 'Compilação', 'Criptografia', 'a', 3),
(2, 'Um modelo de linguagem, como os usados em assistentes de texto, é treinado principalmente para:', 'Prever e gerar texto de forma coerente', 'Corrigir falhas físicas do computador', 'Aumentar a velocidade da internet', 'Armazenar fotos em nuvem', 'a', 3),
(2, 'No aprendizado supervisionado, os dados de treino possuem:', 'Rótulos com a resposta correta', 'Apenas senhas de acesso', 'Nenhuma informação', 'Somente arquivos de áudio', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(2, 'Qual a principal diferença entre aprendizado supervisionado e não supervisionado?', 'No não supervisionado, os dados não possuem rótulos', 'No supervisionado, não se usa nenhum dado', 'O não supervisionado só funciona com imagens', 'Os dois são idênticos', 'a', 4),
(2, 'Um sistema de seleção de currículos favorece um grupo de pessoas porque foi treinado com dados desbalanceados. Esse problema é chamado de:', 'Viés algorítmico', 'Overclock', 'Latência de rede', 'Fragmentação de disco', 'a', 4),
(2, 'Um robô aprende a jogar ao receber pontos quando acerta e perder pontos quando erra. Esse método é o:', 'Aprendizado por reforço', 'Aprendizado por cópia de arquivos', 'Aprendizado por backup', 'Aprendizado por compressão', 'a', 4),
(2, 'Nos modelos de linguagem, o texto é dividido em pequenas unidades para processamento. Essas unidades são chamadas de:', 'Tokens', 'Pixels', 'Frames', 'Drivers', 'a', 4),
(2, 'Qual destas ferramentas é um exemplo de IA generativa?', 'Um sistema que cria imagens a partir de uma descrição em texto', 'Um programa que apenas lista arquivos em ordem alfabética', 'Um sistema que só mede a temperatura do processador', 'Um app que somente converte unidades de medida', 'a', 4);


-- ============================================
-- FLASHCARDS - Programação Back-End (materia_id = 3)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(3, 'Quando você faz login em um site, quem verifica sua senha e consulta o banco de dados?', 'O back-end', 'O front-end', 'O monitor do computador', 'O teclado', 'a', 1),
(3, 'No desenvolvimento web, o servidor tem a função de:', 'Receber requisições e devolver respostas aos clientes', 'Desenhar a interface na tela do usuário', 'Fornecer energia ao computador', 'Editar as imagens do site', 'a', 1),
(3, 'Uma API serve para:', 'Permitir que sistemas diferentes se comuniquem entre si', 'Deixar o site com cores mais bonitas', 'Aumentar o tamanho do disco do servidor', 'Bloquear o acesso à internet', 'a', 1),
(3, 'Qual destas linguagens é muito usada no back-end?', 'Java', 'CSS', 'HTML', 'Markdown', 'a', 1),
(3, 'O protocolo HTTP é usado para:', 'Comunicação entre navegador e servidor na web', 'Editar textos no navegador', 'Compactar arquivos de vídeo', 'Instalar programas no computador', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(3, 'Onde uma aplicação back-end costuma guardar dados como usuários, produtos e pedidos?', 'Em um banco de dados', 'Na tela do navegador', 'No teclado do usuário', 'Em um arquivo de imagem', 'a', 2),
(3, 'Em uma aplicação back-end, uma rota (route) serve para:', 'Ligar um endereço (URL) à função que vai tratá-lo', 'Conectar cabos de rede ao servidor', 'Mudar a cor dos botões da página', 'Guardar senhas em texto puro', 'a', 2),
(3, 'Para apenas buscar dados de um servidor, sem alterá-los, usamos o método HTTP:', 'GET', 'POST', 'DELETE', 'PUT', 'a', 2),
(3, 'Frameworks como Express, Django e Spring existem para:', 'Acelerar o desenvolvimento, oferecendo estrutura e ferramentas prontas', 'Substituir o sistema operacional do servidor', 'Criar apenas animações para sites', 'Consertar problemas de hardware', 'a', 2),
(3, 'Um formulário de cadastro envia os dados do novo usuário ao servidor. Qual método HTTP é o mais indicado?', 'POST', 'GET', 'HEAD', 'OPTIONS', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(3, 'Uma API REST organiza o acesso aos dados usando:', 'Recursos acessados por URLs e métodos HTTP', 'Apenas arquivos de texto enviados por e-mail', 'Somente comandos de teclado', 'Cabos físicos exclusivos', 'a', 3),
(3, 'Autenticação é o processo de:', 'Confirmar quem é o usuário (por exemplo, com login e senha)', 'Escolher a cor da interface', 'Compactar os dados do banco', 'Traduzir o sistema para outro idioma', 'a', 3),
(3, 'Uma função que roda entre a chegada da requisição e a rota final, validando o token do usuário, é um:', 'Middleware', 'Compilador', 'Monitor', 'Driver de vídeo', 'a', 3),
(3, 'Um ORM permite que o programador:', 'Acesse o banco de dados usando objetos da própria linguagem', 'Desenhe telas de forma visual', 'Teste a velocidade da internet', 'Crie senhas mais fortes automaticamente', 'a', 3),
(3, 'Um usuário tenta abrir uma página que não existe no servidor. Qual código de status HTTP é retornado?', '404', '200', '301', '100', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(3, 'Qual a diferença entre PUT e PATCH?', 'PUT substitui o recurso inteiro; PATCH altera apenas parte dele', 'PUT só lê dados; PATCH só apaga dados', 'PATCH só funciona em bancos NoSQL', 'Os dois são sempre idênticos', 'a', 4),
(3, 'Por que senhas de banco e chaves secretas ficam em variáveis de ambiente, e não escritas no código?', 'Para não expor informações sensíveis se o código for compartilhado', 'Para deixar o código mais lento', 'Porque o servidor não aceita texto no código', 'Para que o navegador mostre as senhas ao usuário', 'a', 4),
(3, 'Uma aplicação suporta bem o aumento de usuários sem perder desempenho. Essa característica se chama:', 'Escalabilidade', 'Obsolescência', 'Redundância visual', 'Portabilidade de tela', 'a', 4),
(3, 'Um invasor digita comandos SQL em um campo de login mal protegido para acessar o banco. Esse ataque se chama:', 'SQL Injection', 'Phishing', 'Ransomware', 'Spam', 'a', 4),
(3, 'Guardar temporariamente os resultados de consultas muito repetidas para responder mais rápido é função do:', 'Cache', 'Firewall', 'Compilador', 'Roteador', 'a', 4);


-- ============================================
-- FLASHCARDS - Programação Front-End (materia_id = 4)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(4, 'Qual linguagem define a estrutura de uma página web, como títulos, parágrafos e imagens?', 'HTML', 'CSS', 'SQL', 'Python', 'a', 1),
(4, 'Para mudar a cor de fundo e a fonte de um site, usamos:', 'CSS', 'HTML', 'SQL', 'PHP', 'a', 1),
(4, 'Para fazer um botão exibir uma mensagem ao ser clicado, usamos:', 'JavaScript', 'CSS apenas', 'SQL', 'Markdown', 'a', 1),
(4, 'Qual extensão identifica um arquivo de página web?', '.html', '.exe', '.mp3', '.zip', 'a', 1),
(4, 'Chrome, Firefox e Edge são exemplos de:', 'Navegadores', 'Bancos de dados', 'Linguagens de programação', 'Sistemas operacionais', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(4, 'Qual tag HTML cria um link para outra página?', '<a>', '<link>', '<url>', '<go>', 'a', 2),
(4, 'Qual tag HTML exibe uma imagem na página?', '<img>', '<picture>', '<photo>', '<src>', 'a', 2),
(4, 'Qual propriedade CSS muda a cor do texto?', 'color', 'text-style', 'font-paint', 'background-text', 'a', 2),
(4, 'Qual palavra-chave declara uma variável em JavaScript?', 'let', 'dim', 'define', 'string', 'a', 2),
(4, 'Um site que se ajusta bem ao celular, tablet e computador é um site:', 'Responsivo', 'Estático', 'Criptografado', 'Compilado', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(4, 'Em HTML, uma "tag" serve para:', 'Marcar e estruturar um elemento do conteúdo', 'Consultar dados em um banco', 'Declarar uma variável do JavaScript', 'Configurar o servidor da página', 'a', 3),
(4, 'Em CSS, o que um seletor faz?', 'Indica a quais elementos HTML o estilo será aplicado', 'Apaga elementos da página', 'Cria uma variável em JavaScript', 'Conecta a página ao servidor', 'a', 3),
(4, 'Em JavaScript, uma função é:', 'Um bloco de código reutilizável que executa uma tarefa', 'Uma tag HTML especial', 'Uma propriedade de cor do CSS', 'Um tipo de imagem', 'a', 3),
(4, 'O DOM representa:', 'A estrutura da página como uma árvore de elementos que o JavaScript pode alterar', 'Um banco de dados para o back-end', 'Um formato de arquivo de vídeo', 'Uma senha de segurança', 'a', 3),
(4, 'Qual propriedade CSS define o espaço interno entre o conteúdo de um elemento e sua borda?', 'padding', 'margin', 'border-radius', 'overflow', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(4, 'React, Angular e Vue são exemplos de:', 'Frameworks/bibliotecas front-end', 'Bancos de dados', 'Servidores web', 'Sistemas operacionais', 'a', 4),
(4, 'O "box model" do CSS descreve como se calcula o tamanho de um elemento a partir de:', 'Conteúdo, padding, borda e margem', 'Apenas a cor e a fonte', 'O número de linhas de código', 'A velocidade da internet', 'a', 4),
(4, 'Em JavaScript, o método addEventListener é usado para:', 'Executar uma ação quando um evento ocorre, como um clique', 'Criar uma nova página HTML', 'Definir a cor de um elemento', 'Excluir um arquivo do computador', 'a', 4),
(4, 'As media queries do CSS permitem:', 'Aplicar estilos diferentes conforme o tamanho da tela', 'Buscar dados em um banco', 'Carregar vídeos automaticamente', 'Validar senhas de usuários', 'a', 4),
(4, 'Buscar dados de uma API com fetch, sem recarregar a página inteira, é um exemplo de:', 'Requisição assíncrona', 'Compilação de código', 'Animação em CSS', 'Criptografia de dados', 'a', 4);


-- ============================================
-- FLASHCARDS - Programação Mobile (materia_id = 5)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(5, 'Desenvolver apps para celulares e tablets é o foco do desenvolvimento:', 'Mobile', 'De hardware', 'De redes cabeadas', 'De bancos de dados', 'a', 1),
(5, 'Qual destes é um sistema operacional mobile?', 'Android', 'MS-DOS', 'Ubuntu Server', 'Windows Server', 'a', 1),
(5, 'Um app criado especificamente para Android, com as ferramentas oficiais do sistema, é chamado de app:', 'Nativo', 'Web estático', 'Offline', 'Compilado em nuvem', 'a', 1),
(5, 'Qual linguagem é oficialmente recomendada hoje para criar apps Android?', 'Kotlin', 'SQL', 'HTML', 'Assembly', 'a', 1),
(5, 'Qual linguagem é usada para o desenvolvimento nativo em iOS?', 'Swift', 'Visual Basic', 'COBOL', 'MATLAB', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(5, 'Um app que usa um único código-base para rodar em Android e iOS é um app:', 'Híbrido/multiplataforma', 'Exclusivo de tablets', 'Que só funciona offline', 'Que depende de cabo USB', 'a', 2),
(5, 'O Flutter é:', 'Um framework para criar apps multiplataforma', 'Um serviço de armazenamento de fotos', 'Um recurso para economizar bateria', 'Um editor de ícones', 'a', 2),
(5, 'Qual linguagem é utilizada no Flutter?', 'Dart', 'Kotlin', 'Objective-C', 'TypeScript', 'a', 2),
(5, 'Qual é o ambiente de desenvolvimento (IDE) oficial para criar apps Android?', 'Android Studio', 'Photoshop', 'Excel', 'Notepad', 'a', 2),
(5, 'Quem já conhece JavaScript e quer criar apps mobile pode usar o framework:', 'React Native', 'Swift UI', 'Django', 'Laravel', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(5, 'No Android, cada tela com a qual o usuário interage costuma ser representada por uma:', 'Activity', 'Query', 'Tabela', 'Rota de rede', 'a', 3),
(5, 'Um app que se adapta bem a telas pequenas e grandes tem interface:', 'Responsiva', 'Fixa', 'Criptografada', 'Offline', 'a', 3),
(5, 'Um app de previsão do tempo precisa buscar dados atualizados na internet. Ele faz isso se comunicando com:', 'Uma API', 'Um cabo HDMI', 'Uma planilha local', 'Um teclado externo', 'a', 3),
(5, 'Aquela mensagem que aparece no celular mesmo com o app fechado é uma:', 'Notificação push', 'Janela de erro', 'Query SQL', 'Variável global', 'a', 3),
(5, 'Para o app lembrar as preferências do usuário mesmo sem internet, os dados podem ser salvos:', 'No armazenamento local do dispositivo', 'No monitor', 'No carregador', 'Na tela de bloqueio', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(5, 'Qual a principal vantagem de frameworks multiplataforma como Flutter e React Native?', 'Reaproveitar o mesmo código para Android e iOS', 'Eliminar a necessidade de testes', 'Garantir que o app nunca tenha erros', 'Aumentar automaticamente a nota na loja', 'a', 4),
(5, 'O ciclo de vida de uma tela no app descreve:', 'Os estados pelos quais ela passa, como criada, pausada e destruída', 'O tempo de instalação do app', 'A quantidade de downloads', 'A ordem dos itens do menu', 'a', 4),
(5, 'Quando um app envia requisições HTTP a um servidor para buscar ou enviar dados, dizemos que ele está:', 'Consumindo uma API', 'Compactando o código', 'Traduzindo a interface', 'Limpando o cache do aparelho', 'a', 4),
(5, 'Ao abrir o app e ver o pedido "Permitir acesso à câmera?", o usuário está lidando com:', 'Permissões do aplicativo', 'Versionamento do app', 'Ciclo de vida da tela', 'Notificações push', 'a', 4),
(5, 'Identificar o app como "versão 2.1.0", por exemplo, faz parte do:', 'Versionamento do aplicativo', 'Design da interface', 'Armazenamento local', 'Consumo de API', 'a', 4);


-- ============================================
-- FLASHCARDS - Projeto Multidisciplinar em Desenvolvimento de Sistemas (materia_id = 6)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(6, 'Qual destas descrições se encaixa em um projeto de software?', 'Atividades organizadas, com objetivo e prazo, para criar ou melhorar um sistema', 'A compra de computadores para a empresa', 'A manutenção da rede elétrica do prédio', 'A instalação de impressoras', 'a', 1),
(6, '"O sistema deve permitir que o usuário faça login com e-mail e senha" é um exemplo de:', 'Requisito de software', 'Erro de compilação', 'Backup de dados', 'Teste de hardware', 'a', 1),
(6, 'Para que serve a documentação de um sistema?', 'Registrar como ele foi planejado, construído e como deve ser usado', 'Acelerar a internet do servidor', 'Substituir o banco de dados', 'Compactar o código-fonte', 'a', 1),
(6, 'Qual atitude representa bom trabalho em equipe em um projeto?', 'Dividir as tarefas e manter a comunicação entre os membros', 'Cada um programar sem avisar os demais', 'Deixar todas as decisões com uma pessoa só', 'Evitar reuniões e combinados', 'a', 1),
(6, 'As etapas pelas quais um software passa, do planejamento até a manutenção, formam o:', 'Ciclo de vida do software', 'Prazo de licença', 'Número de acessos', 'Plano de backup', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(6, '"O sistema deve responder em menos de 2 segundos" é um requisito:', 'Não funcional', 'Funcional', 'De hardware apenas', 'Do cliente final obrigatoriamente', 'a', 2),
(6, 'O Scrum organiza o trabalho da equipe em:', 'Ciclos curtos chamados sprints', 'Uma única entrega no fim do projeto', 'Tarefas sem prazo', 'Etapas que nunca se repetem', 'a', 2),
(6, 'Qual diagrama UML mostra como os usuários interagem com as funcionalidades do sistema?', 'Diagrama de casos de uso', 'Diagrama de rede', 'Organograma', 'Gráfico de custos', 'a', 2),
(6, 'Desenhar as telas do sistema antes de programar, para validar a ideia com o cliente, é criar um:', 'Protótipo de interface', 'Backup do banco', 'Relatório de erros', 'Manual de instalação', 'a', 2),
(6, 'No Kanban, as tarefas são organizadas em:', 'Colunas, como "a fazer", "em andamento" e "concluído"', 'Linhas de código em ordem alfabética', 'Planilhas de custos', 'Tabelas de banco de dados', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(6, 'Uma sprint no Scrum é:', 'Um período curto e fixo para entregar um conjunto de funcionalidades', 'Uma reunião que só acontece no final do projeto', 'Um documento com os requisitos do cliente', 'Uma ferramenta de teste de velocidade', 'a', 3),
(6, 'Qual é o principal objetivo dos testes de software?', 'Garantir que o sistema funcione como esperado e achar defeitos antes da entrega', 'Aumentar o tamanho do código', 'Dispensar a documentação', 'Reduzir o número de telas', 'a', 3),
(6, 'O diagrama de classes (UML) representa:', 'As classes do sistema, seus atributos, métodos e relacionamentos', 'O fluxo financeiro da empresa', 'A rede de computadores do projeto', 'O cronograma das entregas', 'a', 3),
(6, 'O MVP (Produto Mínimo Viável) é:', 'Uma versão simples, com o essencial, para validar a ideia', 'A versão final com todas as funções', 'O melhor programador da equipe', 'Um teste feito apenas no último dia', 'a', 3),
(6, 'Qual frase está no formato de uma user story (história de usuário)?', '"Como cliente, quero acompanhar meu pedido para saber quando ele chega"', '"O servidor deve ter 16 GB de memória"', '"Erro 404 na página inicial"', '"Banco de dados em manutenção"', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(6, 'No modelo cascata (waterfall), as etapas do projeto:', 'Acontecem em sequência, e cada uma começa após o fim da anterior', 'Acontecem todas ao mesmo tempo', 'Dispensam planejamento', 'São feitas só pelo cliente', 'a', 4),
(6, 'No Scrum, a lista priorizada de tudo que precisa ser feito no produto é o:', 'Backlog do produto', 'Histórico de falhas', 'Relatório final', 'Inventário de computadores', 'a', 4),
(6, 'A reunião diária (daily) do Scrum serve principalmente para:', 'Alinhar o que foi feito, o que será feito e os obstáculos', 'Apresentar o produto pronto ao cliente', 'Definir o preço de venda', 'Revisar todo o código linha por linha', 'a', 4),
(6, 'Depois que o sistema foi entregue, as correções e melhorias contínuas fazem parte da:', 'Manutenção de software', 'Fase de planejamento inicial', 'Troca da equipe', 'Compra de licenças', 'a', 4),
(6, 'Clientes, usuários e investidores, que são interessados ou afetados pelo projeto, são chamados de:', 'Stakeholders', 'Debuggers', 'Compiladores', 'Frameworks', 'a', 4);


-- ============================================
-- FLASHCARDS - Versionamento de Código e Sistemas de Mensageria (materia_id = 7)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(7, 'Qual problema o versionamento de código ajuda a resolver?', 'Acompanhar e recuperar as alterações feitas no código ao longo do tempo', 'Deixar o computador mais rápido', 'Traduzir o código para outro idioma', 'Criar interfaces automaticamente', 'a', 1),
(7, 'Qual destas ferramentas é um sistema de controle de versão?', 'Git', 'Photoshop', 'Excel', 'VLC', 'a', 1),
(7, 'Onde é possível hospedar repositórios Git online e colaborar com outras pessoas?', 'GitHub', 'Spotify', 'WhatsApp', 'Netflix', 'a', 1),
(7, 'O local que guarda o código do projeto e todo o histórico de alterações se chama:', 'Repositório', 'Compilador', 'Firewall', 'Terminal', 'a', 1),
(7, 'Um sistema de mensageria serve para:', 'Organizar a troca de mensagens entre aplicações', 'Editar fotos', 'Compactar arquivos', 'Navegar na internet', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(7, 'Qual comando registra no histórico as alterações preparadas, com uma mensagem?', 'git commit', 'git clone', 'git status', 'git init', 'a', 2),
(7, 'Qual comando coloca os arquivos alterados na "área de preparação" para o próximo commit?', 'git add', 'git push', 'git pull', 'git log', 'a', 2),
(7, 'Para baixar uma cópia completa de um repositório remoto para o seu computador, usamos:', 'git clone', 'git merge', 'git commit', 'git branch', 'a', 2),
(7, 'Em mensageria, a "mensagem" é:', 'O pacote de dados enviado de uma aplicação para outra', 'Um e-mail escrito à mão', 'Um erro exibido no navegador', 'Um arquivo de configuração', 'a', 2),
(7, 'Em mensageria, a fila (queue) serve para:', 'Guardar as mensagens até que sejam processadas', 'Listar os usuários conectados', 'Criar tabelas no banco de dados', 'Mostrar o histórico de acessos', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(7, 'Por que usar branches no Git?', 'Para desenvolver algo novo sem afetar o código principal', 'Para apagar o histórico de commits', 'Para deixar o repositório invisível', 'Para instalar programas no computador', 'a', 3),
(7, 'Qual comando envia seus commits locais para o repositório remoto?', 'git push', 'git pull', 'git add', 'git diff', 'a', 3),
(7, 'Qual comando busca as novidades do repositório remoto e atualiza o código local?', 'git pull', 'git push', 'git init', 'git rm', 'a', 3),
(7, 'Em mensageria, quem envia as mensagens ao sistema é o:', 'Produtor (producer)', 'Consumidor (consumer)', 'Compilador', 'Navegador', 'a', 3),
(7, 'Em mensageria, quem recebe e processa as mensagens é o:', 'Consumidor (consumer)', 'Produtor (producer)', 'Monitor de vídeo', 'Firewall', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(7, 'Ao fazer um merge, o que acontece com as branches?', 'As alterações de uma branch são incorporadas em outra', 'Uma das branches é copiada para outro computador', 'O repositório é apagado', 'Todos os commits viram um só automaticamente', 'a', 4),
(7, 'Duas pessoas alteraram a mesma linha do mesmo arquivo em branches diferentes. Ao fazer o merge, ocorre:', 'Um conflito de merge, que precisa ser resolvido manualmente', 'A exclusão automática do arquivo', 'A desinstalação do Git', 'Um erro de conexão com a internet', 'a', 4),
(7, 'Para que o Git não acompanhe arquivos como senhas e pastas de dependências, usamos o:', '.gitignore', '.gitpush', '.gitmerge', '.gitclone', 'a', 4),
(7, 'Ferramentas como RabbitMQ atuam como broker, ou seja:', 'Recebem, guardam e entregam mensagens entre produtores e consumidores', 'Desenham as telas do sistema', 'Guardam os dados dos clientes', 'Fazem backup do computador', 'a', 4),
(7, 'No modelo publish/subscribe, quando uma mensagem é publicada em um assunto:', 'Todos os assinantes daquele assunto recebem a mensagem', 'Só um consumidor sorteado recebe', 'Ela é apagada imediatamente', 'Ela só pode ser lida por e-mail', 'a', 4);

-- ============================================
-- FLASHCARDS - Lógica de Programação (materia_id = 8)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(8, 'Uma receita de bolo, com passos em ordem para chegar ao resultado, se parece mais com qual conceito da programação?', 'Algoritmo', 'Compilador', 'Banco de dados', 'Sistema operacional', 'a', 1),
(8, 'Qual é a função de uma variável em um programa?', 'Guardar um valor na memória para usá-lo depois', 'Desenhar a interface do programa', 'Conectar o computador à internet', 'Executar o programa mais rápido', 'a', 1),
(8, 'Qual tipo de dado é o mais adequado para guardar a idade de uma pessoa, como 25?', 'Inteiro', 'Texto', 'Lógico (booleano)', 'Data', 'a', 1),
(8, 'Qual dos valores abaixo é um exemplo de dado do tipo texto (string)?', 'Maria', '42', '3.14', 'verdadeiro', 'a', 1),
(8, 'Um programa deve exibir uma mensagem na tela para o usuário. Que tipo de operação é essa?', 'Saída de dados', 'Entrada de dados', 'Processamento de dados', 'Armazenamento em disco', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(8, 'Qual é o resultado da expressão 10 + 5 * 2, seguindo a ordem de precedência dos operadores?', '20', '30', '25', '15', 'a', 2),
(8, 'Qual operador é usado, na maioria das linguagens, para comparar se dois valores são iguais?', '==', '=', '=>', '!=', 'a', 2),
(8, 'Qual operador retorna o resto de uma divisão, como em 10 % 3?', 'Módulo (%)', 'Potência (^)', 'Divisão inteira (//)', 'Incremento (++)', 'a', 2),
(8, 'Um programa pergunta o nome do usuário e depois o exibe na tela. Qual é a ordem correta das etapas?', 'Entrada, processamento e saída', 'Saída, entrada e processamento', 'Processamento, saída e entrada', 'Saída, processamento e entrada', 'a', 2),
(8, 'Qual estrutura permite que o programa tome uma decisão, como "se a nota for maior ou igual a 7, aprovado"?', 'Estrutura condicional (if)', 'Estrutura de repetição (while)', 'Vetor', 'Função', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(8, 'Para repetir um bloco de código 10 vezes, qual estrutura é a mais indicada?', 'Laço de repetição (for)', 'Estrutura condicional simples (if)', 'Declaração de variável', 'Comentário', 'a', 3),
(8, 'Observe o trecho: x = 5; se (x > 3) { escreva("maior") } senão { escreva("menor") }. O que será exibido?', 'maior', 'menor', 'maior e menor', 'Nada será exibido', 'a', 3),
(8, 'Qual é a principal vantagem de usar uma função em um programa?', 'Reaproveitar um bloco de código sem precisar reescrevê-lo', 'Aumentar o número de linhas do programa', 'Impedir que o código seja executado', 'Trocar o tipo das variáveis automaticamente', 'a', 3),
(8, 'Um vetor (array) é útil quando precisamos:', 'Guardar vários valores do mesmo tipo em uma única estrutura', 'Guardar apenas um valor por vez', 'Executar um laço infinito', 'Converter texto em número', 'a', 3),
(8, 'Qual destas expressões é verdadeira quando a idade for 20: idade >= 18 E idade < 30?', 'Verdadeira, porque as duas condições são atendidas', 'Falsa, porque o E exige que só uma condição seja atendida', 'Falsa, porque 20 não é maior que 18', 'Gera erro, pois não é possível usar duas condições', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(8, 'Qual é o valor final de soma após este trecho? soma = 0; para i de 1 até 4 { soma = soma + i }', '10', '4', '6', '24', 'a', 4),
(8, 'Qual é a diferença entre os laços while e for?', 'O while repete enquanto uma condição for verdadeira; o for costuma ser usado quando se sabe quantas repetições serão feitas', 'O while só funciona com números e o for só funciona com texto', 'O for não permite usar variáveis dentro do laço', 'Não existe diferença, os dois nunca podem ser usados no mesmo programa', 'a', 4),
(8, 'Um programa entra em laço infinito. Qual é a causa mais comum?', 'A condição de parada do laço nunca se torna falsa', 'O computador está sem espaço em disco', 'O nome da variável é muito curto', 'O código tem muitos comentários', 'a', 4),
(8, 'Em um fluxograma, qual símbolo geralmente representa uma decisão (sim/não)?', 'Losango', 'Retângulo', 'Círculo', 'Paralelogramo', 'a', 4),
(8, 'Um colega diz que seu programa compila, mas o resultado final sai errado. Esse tipo de problema é mais provavelmente:', 'Um erro de lógica', 'Um erro de digitação detectado pelo compilador', 'Uma falha física do monitor', 'Um problema de conexão com a internet', 'a', 4);

-- ============================================
-- FLASHCARDS - Processos de Desenvolvimento de Software (materia_id = 9)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(9, 'Qual é o principal objetivo de seguir um processo de desenvolvimento de software?', 'Organizar as etapas do trabalho para entregar um software com qualidade', 'Aumentar o número de linhas de código do projeto', 'Evitar que o cliente participe do projeto', 'Dispensar a fase de testes', 'a', 1),
(9, 'Qual destas etapas faz parte do ciclo de vida de um software?', 'Levantamento de requisitos', 'Troca de monitor', 'Instalação de antivírus', 'Compra de mobília', 'a', 1),
(9, 'Na etapa de levantamento de requisitos, a equipe normalmente:', 'Conversa com o cliente para entender o que o sistema precisa fazer', 'Escreve todo o código do sistema', 'Publica o sistema para os usuários', 'Corrige erros encontrados após a entrega', 'a', 1),
(9, 'Em qual etapa o sistema é verificado para encontrar erros antes de chegar ao cliente?', 'Testes', 'Levantamento de requisitos', 'Planejamento inicial', 'Contratação da equipe', 'a', 1),
(9, 'Depois que o sistema entra em uso, as correções e melhorias que continuam sendo feitas fazem parte da:', 'Manutenção', 'Análise inicial', 'Prototipação', 'Modelagem de dados', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(9, 'No modelo cascata, como as etapas do projeto são executadas?', 'Uma após a outra, em sequência', 'Todas ao mesmo tempo', 'Em ordem aleatória, conforme a vontade da equipe', 'Apenas as etapas de teste e implantação', 'a', 2),
(9, 'Qual é a ideia central dos métodos ágeis?', 'Entregar o software em partes pequenas e receber feedback com frequência', 'Entregar tudo de uma só vez, apenas no fim do projeto', 'Definir todos os detalhes antes de escrever a primeira linha de código', 'Eliminar o contato entre equipe e cliente', 'a', 2),
(9, 'Um modelo incremental entrega o sistema:', 'Em partes, sendo que cada entrega adiciona novas funcionalidades', 'Somente depois que todos os testes de aceitação terminarem', 'Sempre sem passar pela fase de requisitos', 'Apenas para a equipe interna, nunca para o cliente', 'a', 2),
(9, 'A prototipação é útil porque permite:', 'Mostrar uma versão inicial ao cliente para validar a ideia cedo', 'Entregar o sistema final sem testes', 'Reduzir a equipe a uma única pessoa', 'Substituir a documentação do projeto', 'a', 2),
(9, 'Quando a equipe de um projeto se reúne ao final de um ciclo para discutir o que deu certo e o que pode melhorar, essa reunião é chamada de:', 'Retrospectiva', 'Backup', 'Deploy', 'Refatoração', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(9, 'Qual é a vantagem de um modelo iterativo em relação ao cascata?', 'Permite revisar e melhorar o software a cada ciclo, adaptando-se a mudanças', 'Impede qualquer mudança nos requisitos depois do início', 'Dispensa o contato com o cliente durante o projeto', 'Garante que o projeto nunca atrase', 'a', 3),
(9, 'O teste unitário tem como foco verificar:', 'Uma pequena parte isolada do código, como uma função', 'O sistema completo funcionando em produção', 'A aparência visual de todas as telas', 'A velocidade da internet do usuário', 'a', 3),
(9, 'O teste de aceitação costuma ser realizado para confirmar que:', 'O sistema atende ao que o cliente pediu', 'O código está com poucas linhas', 'O servidor tem bastante memória', 'A equipe cumpriu o horário de trabalho', 'a', 3),
(9, 'Qual destas práticas pertence ao Extreme Programming (XP)?', 'Programação em pares', 'Congelar todos os requisitos antes de programar', 'Entregar o sistema uma única vez no fim do projeto', 'Evitar completamente os testes automatizados', 'a', 3),
(9, 'O que significa refatorar um código?', 'Melhorar a estrutura do código sem mudar o que ele faz', 'Apagar o código e recomeçar do zero', 'Adicionar novas funcionalidades ao sistema', 'Traduzir o código para outra linguagem', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(9, 'Em qual situação o modelo cascata costuma ser mais adequado?', 'Quando os requisitos são bem definidos e dificilmente vão mudar', 'Quando o cliente ainda não sabe o que quer', 'Quando o projeto precisa de entregas semanais', 'Quando a equipe quer testar ideias rapidamente', 'a', 4),
(9, 'O que é integração contínua (CI)?', 'Prática de integrar o código da equipe com frequência, rodando testes automáticos a cada alteração', 'Reunir o código de todos apenas uma vez por ano', 'Dividir o projeto em equipes que nunca se comunicam', 'Entregar o sistema ao cliente sem nenhuma verificação', 'a', 4),
(9, 'No TDD (Desenvolvimento Guiado por Testes), qual é a ordem seguida?', 'Escrever o teste primeiro e depois o código para passar nele', 'Escrever todo o código e nunca criar testes', 'Escrever o código e testar apenas no último dia', 'Pedir ao cliente que escreva os testes', 'a', 4),
(9, 'O que significa "dívida técnica" em um projeto?', 'O custo futuro de manter ou corrigir soluções rápidas e mal estruturadas', 'O valor que o cliente ainda deve pagar pelo sistema', 'O total de horas extras da equipe', 'O preço das licenças dos programas usados', 'a', 4),
(9, 'Qual é a ideia por trás do DevOps?', 'Aproximar as equipes de desenvolvimento e de operações para entregar software com mais rapidez e segurança', 'Separar totalmente quem desenvolve de quem coloca o sistema no ar', 'Eliminar a necessidade de monitorar o sistema', 'Reduzir o projeto apenas à fase de programação', 'a', 4);

-- ============================================
-- FLASHCARDS - Redes e Segurança (materia_id = 10)
-- ============================================

-- Dificuldade 1
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(10, 'Quando você conecta celular, notebook e TV ao mesmo roteador em casa, o que você formou?', 'Uma rede de computadores', 'Um banco de dados', 'Um sistema operacional', 'Um compilador', 'a', 1),
(10, 'Qual equipamento distribui o sinal de internet para os dispositivos de uma casa?', 'Roteador', 'Monitor', 'Teclado', 'Impressora', 'a', 1),
(10, 'A forma como os dispositivos de uma rede são organizados e conectados entre si é chamada de:', 'Topologia de rede', 'Protocolo de rede', 'Máscara de sub-rede', 'Largura de banda', 'a', 1),
(10, 'Qual destas senhas é a mais segura?', 'T#9vL2!qRm7', '123456', 'senha', 'seunome2000', 'a', 1),
(10, 'Qual é a função de um antivírus?', 'Detectar e remover programas maliciosos do computador', 'Aumentar a velocidade da internet', 'Criar cópias de segurança automáticas na nuvem', 'Organizar os arquivos por data', 'a', 1);

-- Dificuldade 2
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(10, 'Qual é a diferença básica entre uma rede LAN e uma rede WAN?', 'A LAN cobre uma área pequena, como uma casa ou escritório; a WAN cobre grandes distâncias', 'A LAN só funciona com cabo; a WAN só funciona sem fio', 'A LAN é usada apenas em celulares; a WAN apenas em computadores', 'Não há diferença, são nomes diferentes para a mesma coisa', 'a', 2),
(10, 'Em um escritório, todos os computadores estão ligados por cabo a um switch central. Qual topologia é essa?', 'Estrela', 'Barramento', 'Anel', 'Malha', 'a', 2),
(10, 'O que o DNS faz quando você digita o endereço de um site no navegador?', 'Converte o nome do site no endereço IP correspondente', 'Instala o navegador no computador', 'Bloqueia propagandas', 'Criptografa a senha do usuário', 'a', 2),
(10, 'Qual protocolo é usado para acessar páginas web de forma segura, com criptografia?', 'HTTPS', 'FTP', 'SMTP', 'HTTP', 'a', 2),
(10, 'Você recebe um e-mail dizendo que ganhou um prêmio e pedindo seus dados bancários em um link. Esse golpe é conhecido como:', 'Phishing', 'Backup', 'Firewall', 'Roteamento', 'a', 2);

-- Dificuldade 3
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(10, 'Na topologia em barramento, todos os dispositivos compartilham um único cabo principal. Qual é a principal desvantagem disso?', 'Se o cabo principal falhar, toda a rede pode parar', 'Cada dispositivo precisa de um cabo próprio até um ponto central', 'Só é possível conectar dois computadores', 'Os dados nunca chegam ao destino', 'a', 3),
(10, 'Qual é a principal diferença entre um hub e um switch?', 'O switch envia os dados só ao dispositivo de destino; o hub envia a todos os dispositivos conectados', 'O hub é mais moderno e inteligente que o switch', 'O switch funciona apenas com Wi-Fi', 'O hub criptografa os dados automaticamente', 'a', 3),
(10, 'Qual é a função do DHCP em uma rede?', 'Atribuir endereços IP automaticamente aos dispositivos', 'Bloquear sites perigosos', 'Criptografar as conexões', 'Fazer backup dos arquivos da rede', 'a', 3),
(10, 'O que caracteriza a autenticação em dois fatores (2FA)?', 'Exigir duas formas de verificação, como senha e código enviado ao celular', 'Usar duas senhas iguais em contas diferentes', 'Ter dois antivírus instalados no mesmo computador', 'Fazer login de dois dispositivos ao mesmo tempo', 'a', 3),
(10, 'Na topologia em anel, como os dados trafegam entre os dispositivos?', 'Passando de dispositivo em dispositivo, em círculo, até chegar ao destino', 'Saindo de um dispositivo central direto para todos os outros', 'Por um único cabo compartilhado, sem nenhuma ordem', 'Cada dispositivo conectado diretamente a todos os demais', 'a', 3);

-- Dificuldade 4
INSERT INTO flashcards (materia_id, pergunta, alt_a, alt_b, alt_c, alt_d, correta, dificuldade) VALUES
(10, 'Qual é a função da criptografia na segurança da informação?', 'Transformar os dados em um formato ilegível para quem não tem a chave', 'Apagar os dados antigos automaticamente', 'Aumentar a velocidade de transferência de arquivos', 'Impedir que o computador seja ligado', 'a', 4),
(10, 'Em um ataque DDoS, o que o invasor tenta fazer?', 'Sobrecarregar um serviço com muitos acessos para deixá-lo fora do ar', 'Descobrir a senha de um único usuário', 'Instalar um antivírus no servidor', 'Fazer backup dos dados da vítima', 'a', 4),
(10, 'Qual topologia oferece maior redundância, pois cada dispositivo se conecta a vários outros, mas exige mais cabos e tem custo maior?', 'Malha', 'Barramento', 'Anel', 'Estrela', 'a', 4),
(10, 'Uma VPN é usada principalmente para:', 'Criar uma conexão protegida e criptografada pela internet', 'Aumentar o espaço de armazenamento do computador', 'Remover vírus automaticamente', 'Trocar o endereço de e-mail do usuário', 'a', 4),
(10, 'Um funcionário recebe uma ligação de alguém que se passa pelo suporte técnico e pede a senha dele. Esse tipo de golpe, que explora a confiança das pessoas, é chamado de:', 'Engenharia social', 'Força bruta', 'Overclock', 'Fragmentação de disco', 'a', 4);