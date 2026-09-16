/* ============================================================================
   PERGUNTAS DO QUIZ
   ----------------------------------------------------------------------------
   Edite este array para trocar, adicionar ou remover perguntas do formulário.
   A página é montada automaticamente a partir daqui — não é preciso mexer
   no index.html nem no app.js para ajustar as perguntas.

   Campos de cada pergunta:
     id           -> nome do campo (usado no envio para a planilha)
     label        -> texto exibido acima do campo
     type         -> "text" | "tel" | "email" | "select"
     placeholder  -> texto de exemplo dentro do campo (não usado em "select")
     options      -> lista de opções (somente para type "select")
     autocomplete -> ajuda o navegador a preencher automaticamente (opcional)
     errorMsg     -> mensagem exibida quando o campo é inválido
   ============================================================================ */
const QUESTIONS = [
  {
    id: "nome",
    label: "Nome completo",
    type: "text",
    placeholder: "Seu nome",
    autocomplete: "name",
    errorMsg: "Informe seu nome completo."
  },
  {
    id: "whatsapp",
    label: "WhatsApp com DDD",
    type: "tel",
    placeholder: "(11) 99999-9999",
    autocomplete: "tel",
    errorMsg: "WhatsApp inválido. Use (XX) XXXXX-XXXX."
  },
  {
    id: "email",
    label: "E-mail",
    type: "email",
    placeholder: "voce@email.com",
    autocomplete: "email",
    errorMsg: "E-mail inválido."
  },
  {
    id: "negocio",
    label: "Qual a sua especialidade ou tipo de clínica?",
    type: "text",
    placeholder: "Ex: dermatologia, odontologia, clínica geral...",
    errorMsg: "Conte qual é a sua especialidade ou clínica."
  },
  {
    id: "desafio",
    label: "Qual o seu maior desafio hoje?",
    type: "select",
    options: [
      "Atrair mais pacientes",
      "Aumentar o faturamento por paciente",
      "Organizar a parte comercial da clínica",
      "Crescer com previsibilidade",
      "Outro"
    ],
    errorMsg: "Selecione seu maior desafio."
  }
];
