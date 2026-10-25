/* ===== REGRESO - validación en tiempo real del formulario ===== */
(function () {
  "use strict";

  var form = document.getElementById("form-contacto");
  if (!form) { return; }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Reglas por campo: devuelven un mensaje de error o "" si es válido
  var reglas = {
    nombre: function (v) {
      if (v.trim() === "") { return "Escribe tu nombre."; }
      if (v.trim().length < 3) { return "El nombre debe tener al menos 3 caracteres."; }
      return "";
    },
    email: function (v) {
      if (v.trim() === "") { return "Escribe tu correo electrónico."; }
      if (!EMAIL_RE.test(v.trim())) { return "Formato inválido. Ejemplo: nombre@correo.com"; }
      return "";
    },
    servicio: function (v) {
      return v === "" ? "Selecciona un servicio." : "";
    },
    mensaje: function (v) {
      if (v.trim() === "") { return "Escribe tu mensaje."; }
      if (v.trim().length < 20) { return "El mensaje debe tener al menos 20 caracteres."; }
      return "";
    },
    acepto: function (v, campo) {
      return campo.checked ? "" : "Debes aceptar la política de privacidad.";
    }
  };

  function validar(campo) {
    var regla = reglas[campo.name];
    if (!regla) { return true; }
    var error = regla(campo.value, campo);
    var msg = document.getElementById(campo.id + "-error");
    campo.classList.toggle("is-invalid", error !== "");
    campo.classList.toggle("is-valid", error === "");
    campo.setAttribute("aria-invalid", error !== "" ? "true" : "false");
    msg.textContent = error;
    return error === "";
  }

  var campos = Array.prototype.slice.call(form.querySelectorAll("[name]"));

  // Validación mientras el usuario escribe o cambia el valor
  campos.forEach(function (campo) {
    var evento = (campo.type === "checkbox" || campo.tagName === "SELECT") ? "change" : "input";
    campo.addEventListener(evento, function () { validar(campo); });
    campo.addEventListener("blur", function () { validar(campo); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var resultados = campos.map(validar);
    var estado = document.getElementById("form-estado");
    var primerError = campos[resultados.indexOf(false)];

    if (primerError) {
      estado.className = "alert alert-danger";
      estado.textContent = "Hay campos con errores. Revísalos e inténtalo de nuevo.";
      primerError.focus();
      return;
    }
    estado.className = "alert alert-success";
    estado.textContent = "¡Gracias! Tu mensaje fue enviado. Te responderé pronto.";
    form.reset();
    campos.forEach(function (c) { c.classList.remove("is-valid", "is-invalid"); });
  });
})();
