/* ============================================================================
   >> CONFIGURAÇÃO <<
   ----------------------------------------------------------------------------
   1) SCRIPT_URL: cole aqui a URL /exec do Google Apps Script (veja README.md).
      Enquanto estiver com o valor de placeholder abaixo, o formulário funciona
      normalmente para testes, mas os dados NÃO são gravados em planilha
      nenhuma (só aparece um aviso no console do navegador).
   2) GIFT_FILE: caminho do arquivo do presente que será liberado para download
      depois que a pessoa responder o quiz. Troque pelo arquivo real quando o
      cliente enviar (mantenha o arquivo dentro de assets/gift/).
   ============================================================================ */
const SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
const GIFT_FILE = "assets/gift/presente-placeholder.txt";
const GIFT_FILENAME = "presente-the-one.txt";

/* -------------------------------- Elementos -------------------------------- */
const quizForm = document.getElementById("quizForm");
const fieldsWrap = document.getElementById("quizFields");
const formMsg = document.getElementById("formMsg");
const submitBtn = document.getElementById("submitBtn");
const card = document.getElementById("card");
const successEl = document.getElementById("success");
const downloadBtn = document.getElementById("downloadBtn");
document.getElementById("ano").textContent = new Date().getFullYear();

/* --------------------------- Máscara de telefone --------------------------- */
function onlyDigits(v) { return (v || "").replace(/\D/g, ""); }
function maskPhone(v) {
  const d = onlyDigits(v).slice(0, 11);
  if (!d) return "";
  if (d.length < 3) return "(" + d;
  if (d.length < 7) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  if (d.length < 11) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
}
function validPhone(v) {
  const d = onlyDigits(v);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = parseInt(d.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  return true;
}
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim().toLowerCase()); }

/* ------------------------ Renderiza o quiz a partir de questions.js ------------------------ */
function renderFields() {
  const html = QUESTIONS.map(q => {
    const errId = "err-" + q.id;
    if (q.type === "select") {
      const opts = q.options.map(o => `<option>${o}</option>`).join("");
      return `
        <div class="field" data-for="${q.id}">
          <label for="${q.id}">${q.label}</label>
          <select id="${q.id}" name="${q.id}">
            <option value="" disabled selected>Selecione...</option>
            ${opts}
          </select>
          <div class="err" id="${errId}">${q.errorMsg}</div>
        </div>`;
    }
    return `
      <div class="field" data-for="${q.id}">
        <label for="${q.id}">${q.label}</label>
        <input id="${q.id}" name="${q.id}" type="${q.type}"
          ${q.autocomplete ? `autocomplete="${q.autocomplete}"` : ""}
          placeholder="${q.placeholder || ""}" />
        <div class="err" id="${errId}">${q.errorMsg}</div>
      </div>`;
  }).join("");

  fieldsWrap.innerHTML = html;

  const phone = document.getElementById("whatsapp");
  if (phone) phone.addEventListener("input", () => { phone.value = maskPhone(phone.value); });

  QUESTIONS.forEach(q => {
    const el = document.getElementById(q.id);
    if (el) el.addEventListener("blur", () => validate());
  });
}

function setInvalid(id, bad) {
  const wrap = document.querySelector('.field[data-for="' + id + '"]');
  if (wrap) wrap.classList.toggle("invalid", bad);
}

function validateField(q, value) {
  switch (q.type) {
    case "tel": return validPhone(value);
    case "email": return validEmail(value);
    case "select": return !!value;
    default: return (value || "").trim().length >= 2;
  }
}

function validate() {
  const data = {};
  let ok = true;
  QUESTIONS.forEach(q => {
    const el = document.getElementById(q.id);
    const value = el ? el.value : "";
    data[q.id] = value;
    const fieldOk = validateField(q, value);
    setInvalid(q.id, !fieldOk);
    if (!fieldOk) ok = false;
  });
  return ok ? data : null;
}

/* -------------------------------- Envio -------------------------------- */
quizForm.addEventListener("submit", async e => {
  e.preventDefault();
  formMsg.classList.remove("show");

  // Honeypot: se preenchido, é bot -> finge sucesso e não envia.
  if (document.getElementById("website").value) { showSuccess(); return; }

  const data = validate();
  if (!data) {
    formMsg.textContent = "Confira os campos destacados e tente novamente.";
    formMsg.classList.add("show");
    return;
  }

  // Telefone normalizado
  const d = onlyDigits(data.whatsapp);
  data.whatsapp = d.length === 11
    ? "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7)
    : "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    if (SCRIPT_URL && !SCRIPT_URL.startsWith("COLE_AQUI")) {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams(data)
      });
    } else {
      console.warn("[LP Presente] SCRIPT_URL ainda não configurado — os dados não foram gravados na planilha. Veja README.md.");
    }
    showSuccess();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Quero receber meu presente";
    formMsg.textContent = "Não foi possível enviar. Tente novamente.";
    formMsg.classList.add("show");
  }
});

function showSuccess() {
  quizForm.style.display = "none";
  successEl.classList.add("show");
  downloadBtn.href = GIFT_FILE;
  downloadBtn.setAttribute("download", GIFT_FILENAME);
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}

renderFields();
