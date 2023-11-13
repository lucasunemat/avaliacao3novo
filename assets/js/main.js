/**
 * Validar os RegEx; --> bug da senha de 8 digitos
 * Trabalhar Responsividade;
 * Verificar se arquivo avaliacao 3.3 foi devidamente replicado aqui.
 */


const url = 'https://evas-c2bec-default-rtdb.firebaseio.com/';

const tbody = document.querySelector('#cadastrosTabela');
const conteudoPagina = document.querySelector('#conteudoPagina');
const form = document.querySelector('.form');
var idEVA = document.querySelector('#idEVA');
const nomeUnidadeEVA = document.querySelector('#nomeUnidadeEVA');
const nomePiloto = document.querySelector('#nomePiloto');
const emailPiloto = document.querySelector('#emailPiloto');
const dataManutencao = document.querySelector('#dataManutencao');
const senhaSincronizacaoMental = document.querySelector('#senhaSincronizacaoMental');
const button = document.querySelector('#botaoCadastrar');

var evas = [];

/* funções de navegação básicas */

function nav(link) {
    fetch('assets/pages/' + link + '.html')
        .then(response => response.text())
        .then(response => conteudoPagina.innerHTML = response)
        .catch(error => console.log(error));
}

function voltar(link) {
    fetch('./' + link + '.html')
        .then(response => response.text())
        .then(response => {
            const divTemporaria = document.createElement('div');
            divTemporaria.innerHTML = response;

            const conteudoMain = divTemporaria.querySelector('main');
            if (conteudoMain) {
                conteudoPagina.innerHTML = conteudoMain.innerHTML;
                location.reload();
            } else {
                console.error('Elemento <main> não encontrado na página.');
            }
        })
        .catch(error => console.log(error));
}

const mostrarNaTela = () => {
    tbody.innerHTML = '';
    evas.forEach(eva => {
        const tr = document.createElement('tr');
        const tdIdEVA = document.createElement('td');
        const tdNomeUnidadeEVA = document.createElement('td');
        const tdNomePiloto = document.createElement('td');
        const tdEmailPiloto = document.createElement('td');
        const tdDataManutencao = document.createElement('td');
        const tdSenhaSincronizacaoMental = document.createElement('td');
        const tdAcoes = document.createElement('td'); //cria tdAcoes

        tdIdEVA.innerHTML = eva.idEVA;
        tdNomeUnidadeEVA.innerHTML = eva.nomeUnidadeEVA;
        tdNomePiloto.innerHTML = eva.nomePiloto;
        tdEmailPiloto.innerHTML = eva.emailPiloto;
        tdDataManutencao.innerHTML = eva.dataManutencao;
        tdSenhaSincronizacaoMental.innerHTML = eva.senhaSincronizacaoMental;

        //cria icones de ação
        const iconeEditar = document.createElement('i');
        const iconeRemover = document.createElement('i');

        //adiciona classes aos icones
        iconeEditar.className = 'mdi mdi-pencil';
        iconeRemover.className = 'mdi mdi-delete';

        //adiciona os icones ao tdAcoes
        tdAcoes.appendChild(iconeEditar);
        tdAcoes.appendChild(iconeRemover);

        tr.appendChild(tdIdEVA);
        tr.appendChild(tdNomeUnidadeEVA);
        tr.appendChild(tdNomePiloto);
        tr.appendChild(tdEmailPiloto);
        tr.appendChild(tdDataManutencao);
        tr.appendChild(tdSenhaSincronizacaoMental);
        //adiciona tdAcoes na tr
        tr.appendChild(tdAcoes);

        iconeRemover.addEventListener('click', () => Delete(eva.idEVA));
        iconeEditar.addEventListener('click', () => loadEdit(eva.idEVA));

        //adiciona tr no tbody
        tbody.appendChild(tr);
    });
}

const Create = () => {
    const evas = {
        nomeUnidadeEVA: nomeUnidadeEVA.value,
        nomePiloto: nomePiloto.value,
        emailPiloto: emailPiloto.value,
        dataManutencao: dataManutencao.value,
        senhaSincronizacaoMental: senhaSincronizacaoMental.value
    }
    if (validaCampos() == false || validaSenha() == false) {
        loadEdit(eva.idEVA);
    }
    fetch(url + 'evas.json', {
        method: 'POST', //post, get, put (update), delete
        body: JSON.stringify(evas)
    })
        .then(response => {
            limparCampos();
        })
        .catch(error => console.log(error));
}

function Read() {
    fetch(url + '/evas.json', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {
            evas = [];
            for (const id in response) {
                response[id].idEVA = id;
                evas.push(response[id])
            }
            mostrarNaTela();
        })
        .catch(error => console.log(error));
}

function Update(idEVA) {
    const eva = {
        nomeUnidadeEVA: nomeUnidadeEVA.value,
        nomePiloto: nomePiloto.value,
        emailPiloto: emailPiloto.value,
        dataManutencao: dataManutencao.value,
        senhaSincronizacaoMental: senhaSincronizacaoMental.value
    }
    if (validaCampos() == false || validaSenha() == false) {
        loadEdit(eva.idEVA);
    }
    fetch(url + '/evas/' + idEVA.value + '.json', {
        method: 'PUT',
        body: JSON.stringify(eva)
    })
        .then(() => Read())
        .catch(erro => console.log(erro));
}

function loadEdit(key) {
    const evaEdit = evas.find(eva => eva.idEVA === key);
    idEVA.value = evaEdit.idEVA;
    nomeUnidadeEVA.value = evaEdit.nomeUnidadeEVA;
    nomePiloto.value = evaEdit.nomePiloto;
    emailPiloto.value = evaEdit.emailPiloto;
    dataManutencao.value = evaEdit.dataManutencao;
    senhaSincronizacaoMental.value = evaEdit.senhaSincronizacaoMental;
}

function Delete(idEVA) {
    fetch(url + '/evas/' + idEVA + '.json', {
        method: 'DELETE'
    })
        .then(() => Read())
        .catch(erro => console.log(erro))
}

document.addEventListener('onload', Read());
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (idEVA.value !== '') {
        Update(idEVA);
        Read();
        limparCampos();
    } else {
        Create();
        Read();
        limparCampos();
    }
    Read();
});

function limparCampos() {
    idEVA.value = '';
    nomeUnidadeEVA.value = '';
    nomePiloto.value = '';
    emailPiloto.value = '';
    dataManutencao.value = '';
    senhaSincronizacaoMental.value = '';
}

function validaCampos() {
    dataPattern = new RegExp('^[0-9]{2}/[0-9]{2}/[0-9]{4}$');
    emailPattern = new RegExp(/^[\w\.]+@\w+(\.\w+)+$/);
    if (dataPattern.test(dataManutencao.value) == false) {
        alert("Data de manutenção inválida!");
        return false;
    }
    if (emailPattern.test(emailPiloto.value) == false) {
        alert("Email inválido!");
        return false;
    }
    if (nomeUnidadeEVA.value == '') {
        alert("Nome da unidade EVA inválido!");
        return false;
    }
    if (nomePiloto.value == '') {
        alert("Nome do piloto inválido!");
        return false;
    }
}

function validaSenha(){
    numberPattern = new RegExp(/[0-9]/);
    minimalUpperCasePattern = new RegExp(/[A-Z]/);
    minimalLowerCasePattern = new RegExp(/[a-z]/);
    minimalSpecialCharacterPattern = new RegExp(/[!@#$%\^&*~)\[\]{}?\.(+=\._-]/);
    if (senhaSincronizacaoMental.value.length < 8) {
        alert("A senha deve conter no mínimo 8 caracteres!");
        return false;
    }
    if (minimalUpperCasePattern.test(senhaSincronizacaoMental.value) == false) {
        alert("A senha deve conter no mínimo 1 letra maiúscula!");
        return false;
    }
    if (minimalLowerCasePattern.test(senhaSincronizacaoMental.value) == false) {
        alert("A senha deve conter no mínimo 1 letra minúscula!");
        return false;
    }
    if (minimalSpecialCharacterPattern.test(senhaSincronizacaoMental.value) == false) {
        alert("A senha deve conter no mínimo 1 caractere especial!");
        return false;
    }
}


