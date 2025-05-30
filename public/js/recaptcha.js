document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío inmediato

    const recaptchaToken = grecaptcha.getResponse();
    if (!recaptchaToken) {
        alert("Por favor, completa el reCAPTCHA");
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email || !mensaje) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const formData = { nombre, email, mensaje, recaptchaToken };

    console.log("Datos enviados al backend:", formData); // Depuración

    fetch("/enviar-contacto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);
        alert(data.message);
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al enviar el formulario. Inténtalo nuevamente.");
    });
});