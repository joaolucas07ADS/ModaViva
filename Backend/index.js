// 1. Capturar o botão de login
const btnLogin = document.getElementById('btn-login');

// 2. Criar o evento de clique no botão
btnLogin.addEventListener('click', function(event) {
    // Impede que o formulário recarregue a página (comportamento padrão)
    event.preventDefault(); 

    // 3. Pegar os valores que o utilizador digitou nos campos
    const emailDigitado = document.getElementById('email').value;
    const senhaDigitada = document.getElementById('senha').value;

    // 4. Definir qual é o email e a senha corretos (Pode alterar para os que você quiser)
    const emailCorreto = "modaviva@gmail.com";
    const senhaCorreta = "123456";

    // 5. A Lógica IF/ELSE
    if (emailDigitado === emailCorreto && senhaDigitada === senhaCorreta) {
        // Se as duas coisas estiverem certas, redireciona para o Estoque
        window.location.href = "/Frontend/Estoque.html";
    } else {
        // Se alguma coisa estiver errada, mostra o alerta e não deixa passar
        alert("Não autenticado! Email ou senha estão incorretos.");
    }
});