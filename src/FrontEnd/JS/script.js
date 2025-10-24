const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const cpfInput = document.getElementById('cpf');
const matriculaInput = document.getElementById('matricula');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

cpfInput.addEventListener('input', () => {
   
    let value = cpfInput.value.replace(/\D/g, '');

    value = value.slice(0, 11);

    if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
    }

    if (value.length > 6) {
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    cpfInput.value = value;
});

matriculaInput.addEventListener('input', () => {

    let value = matriculaInput.value.replace(/\D/g, '');

    value = value.slice(0, 6);

    matriculaInput.value = value;
});