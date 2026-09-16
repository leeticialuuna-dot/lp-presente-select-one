# LP "Presente" — SELECT ONE / Fabrício Barin

Landing page para novos seguidores do Instagram: oferece um material gratuito
("presente") em troca do preenchimento de um pequeno quiz. Os dados enviados
caem numa planilha do Google Sheets.

Site 100% estático (HTML/CSS/JS puro, sem build step), no mesmo sistema
visual da [LP de diagnóstico](https://diagnostico-fabriciobarin.netlify.app)
já usada pelo cliente.

## Estrutura de arquivos

```
index.html            → página única (hero → quiz → download)
css/style.css         → sistema visual (cores, tipografia, componentes)
js/questions.js       → perguntas do quiz — edite aqui para trocar/add/remover
js/app.js             → lógica: renderiza o quiz, valida e envia os dados
assets/gift/          → arquivo do presente (troque o placeholder pelo real)
apps-script/Code.gs   → script para colar no Google Apps Script da planilha
```

## 1. Testar localmente

Qualquer servidor estático simples funciona. Exemplos:

```bash
npx serve .
```

ou

```bash
python -m http.server
```

Depois abra o endereço indicado no navegador.

## 2. Editar as perguntas do quiz

Abra `js/questions.js`. Cada pergunta é um item da lista `QUESTIONS`, com:

- `id`: nome do campo (também é o nome da coluna na planilha)
- `label`: texto exibido acima do campo
- `type`: `"text"`, `"tel"`, `"email"` ou `"select"`
- `placeholder`: texto de exemplo (não usado em `"select"`)
- `options`: lista de opções (somente para `"select"`)
- `errorMsg`: mensagem de erro exibida quando o campo é inválido

Adicionar, remover ou reordenar perguntas não exige mexer no `index.html`.

**Importante:** se você mudar os `id` das perguntas, atualize também a lista
`headers` dentro de `apps-script/Code.gs` para que as colunas da planilha
continuem batendo com os dados enviados.

## 3. Trocar o arquivo do presente

O presente atual já é o e-book real enviado pelo Fabrício:
`assets/gift/Ciclo Comercial - SELECT ONE.pdf`. Para trocar por outro material no futuro:

1. Coloque o novo arquivo (PDF, e-book, planilha etc.) dentro de `assets/gift/`.
2. Abra `js/app.js` e edite as constantes no topo:
   ```js
   const GIFT_FILE = "assets/gift/nome-do-arquivo-real.pdf";
   const GIFT_FILENAME = "nome-para-download.pdf";
   ```

⚠️ **Atenção:** como o site é puramente estático, o arquivo do presente fica
tecnicamente acessível por URL direta mesmo sem preencher o quiz (não existe
um backend real para bloquear o acesso). Isso é aceitável para uma LP de
teste, mas avise o cliente antes de considerar isso "produção definitiva" —
se quiser um bloqueio real, é necessário um backend (ex: Google Apps Script
servindo o arquivo, ou um serviço de e-mail automático).

## 4. Configurar o Google Sheets (Apps Script)

1. Crie (ou abra) a planilha do Google Sheets onde os leads devem cair.
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o conteúdo padrão do editor e cole o conteúdo de `apps-script/Code.gs`.
4. Clique em **Implantar → Nova implantação**.
5. Em "Tipo", escolha **App da Web**.
6. Configure:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** Qualquer pessoa
7. Clique em **Implantar**, autorize as permissões pedidas pelo Google, e
   copie a URL gerada (termina em `/exec`).
8. Abra `js/app.js` e cole essa URL na constante do topo:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```
9. Salve, teste o formulário e confira se uma nova linha aparece na planilha.

Enquanto `SCRIPT_URL` estiver com o valor de placeholder, o formulário
funciona normalmente (mostra a tela de download), mas os dados não são
gravados em nenhuma planilha — só aparece um aviso no console do navegador.

## 5. Publicar (GitHub Pages, opcional)

Este teste local não exige publicação online, mas se um dia quiser publicar
gratuitamente:

```bash
git init
git add .
git commit -m "LP presente - versão inicial"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO_GITHUB>
git push -u origin main
```

Depois, no GitHub: **Settings → Pages → Build and deployment → Source:
Deploy from a branch → Branch: main / (root)**. A URL pública aparece em
alguns minutos na mesma tela. (Não é necessário ter Git instalado só para
usar a página localmente ou testar no navegador.)

## 6. Fora do escopo deste projeto

- Automação da mensagem de boas-vindas para novos seguidores no Instagram
  (já resolvida pelo cliente fora daqui — esta LP é só o destino do link).
- Arquivo real do presente e perguntas reais do quiz (troque os placeholders
  conforme os itens 2 e 3 acima assim que o cliente enviar o conteúdo final).
