# FlorIs — Floricultura Moderna

Projeto acadêmico desenvolvido para o **Trabalho N3**. O site representa uma floricultura moderna e elegante, com identidade visual em tons pastéis, navegação por múltiplas páginas, interações em JavaScript e validações de formulário sem uso de banco de dados.

## 1. Escopo fechado

### Objetivo do site

O objetivo do site é apresentar uma floricultura fictícia de porte médio, chamada **FlorIs**, permitindo que o usuário conheça a marca, visualize coleções florais, simule um orçamento, realize um login falso e interaja com elementos visuais da interface.

### Público-alvo

O público-alvo é formado por pessoas que desejam comprar flores para presentes, decoração, eventos intimistas ou assinatura floral. O site foi pensado para usuários leigos, com linguagem clara, navegação simples e feedback visual nas interações.

### Paleta de cores

A composição visual utiliza tons pastéis para comunicar delicadeza, elegância e tranquilidade:

- Creme: usado como base para suavizar a leitura.
- Rosa blush: remete a afeto, romantismo e flores delicadas.
- Verde sálvia: transmite naturalidade, frescor e equilíbrio.
- Lavanda: reforça sofisticação e calma.
- Pêssego: adiciona calor visual sem quebrar a suavidade da interface.
- Grafite escuro: usado em textos e botões para garantir contraste e legibilidade.

### Tipografia

Foram escolhidas duas famílias tipográficas:

- **Playfair Display** para títulos, por transmitir elegância e personalidade editorial.
- **Inter** para textos, menus e formulários, por oferecer boa legibilidade em telas pequenas e grandes.

Caso a fonte externa não carregue, o projeto possui fontes alternativas no CSS.

### Frameworks

Não foi utilizado framework. O projeto foi desenvolvido com:

- HTML5 puro;
- CSS3 puro;
- JavaScript puro;
- Biblioteca Three.js via CDN apenas para renderizar a animação WebGL de flores inspirada no CodePen.

## 2. Detalhamento do site

### Home — `index.html`

A página inicial apresenta o conceito da floricultura, chamada para ação, diferenciais, serviços principais, coleções e formulário de newsletter simulado.

Interações presentes:

- Animação interativa de flores no fundo do hero;
- Clique no canvas para adicionar flores;
- Formulário de newsletter com validação de e-mail;
- Menu responsivo mobile.

### Sobre — `sobre.html`

Apresenta a história da floricultura, valores, processo de produção dos pedidos e explicação de escolhas de UI/UX aplicadas.

Conteúdos principais:

- História e posicionamento da marca;
- Valores da empresa;
- Processo em etapas;
- Aplicação de princípios de experiência do usuário.

### Catálogo — `catalogo.html`

Apresenta produtos fictícios divididos por categorias.

Interações presentes:

- Filtro de produtos por categoria;
- Botão de adicionar ao orçamento simulado;
- Contador de itens no orçamento;
- Modal de detalhes dos produtos;
- Mensagem temporária de confirmação.

### Contato — `contato.html`

Permite simular uma solicitação de orçamento floral.

Interações presentes:

- Validação de nome, e-mail, telefone, ocasião e mensagem;
- Mensagens claras de erro e sucesso;
- FAQ com accordion;
- Mapa ilustrativo sem localização real.

### Login falso — `login.html`

Demonstra uma tela de login sem autenticação real.

Interações presentes:

- Validação de e-mail com Regex;
- Validação de senha com no mínimo 6 caracteres;
- Botão de mostrar/ocultar senha;
- Mensagem de sucesso quando os dados respeitam o formato solicitado.

## 3. Acessibilidade e semântica

O projeto utiliza recursos de HTML semântico e acessibilidade, como:

- `header`, `nav`, `main`, `section`, `article`, `aside` e `footer`;
- textos alternativos/labels em elementos interativos;
- `aria-live` para mensagens de feedback;
- link de pular para o conteúdo principal;
- foco visível em campos e botões;
- contraste adequado entre texto e fundo;
- navegação responsiva com estado `aria-expanded`.

## 4. Responsividade

O CSS foi estruturado com abordagem Mobile First. O layout se adapta para:

- smartphones;
- tablets;
- desktops.

O site evita rolagem horizontal e utiliza grids flexíveis, unidades relativas, `clamp()` e largura máxima com `.container`.

## 5. Heurísticas de Nielsen aplicadas

### Visibilidade do status do sistema

Mensagens de sucesso e erro aparecem diretamente na interface após ações do usuário.

### Prevenção de erros

Formulários impedem envio inválido e exibem mensagens específicas para cada campo.

### Consistência e padrões

Botões, cards, espaçamentos, cores e estados visuais seguem o mesmo padrão em todas as páginas.

### Controle e liberdade do usuário

O usuário pode filtrar produtos, fechar modais, abrir/fechar o menu, pausar a animação e mostrar/ocultar senha.

## 6. Como rodar o projeto

Como o projeto usa HTML, CSS e JavaScript puro, basta abrir o arquivo `index.html` no navegador.

Também é possível usar a extensão **Live Server** no VS Code:

1. Abrir a pasta do projeto no VS Code;
2. Clicar com o botão direito em `index.html`;
3. Selecionar **Open with Live Server**.

## 7. Estrutura de pastas

```txt
floricultura-petala-serena/
├── index.html
├── sobre.html
├── catalogo.html
├── contato.html
├── login.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js
        └── flowers.js
```

## 8. Integrantes e divisão de tarefas

| Integrante | Responsabilidade |
|---|---|
| Joana Jensen Schifter | Desenvolvimento completo |

## 10. Observação sobre banco de dados

O projeto não utiliza banco de dados. Todas as interações são simuladas no navegador, conforme solicitado no enunciado.
