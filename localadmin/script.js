document.addEventListener('DOMContentLoaded', function () {
  const cpfInput = document.getElementById('cpf');

  cpfInput.addEventListener('input', function () {
    let value = cpfInput.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    cpfInput.value = value;
  });
});
