const nameTextField = document.getElementById('name');
const surnameTextField = document.getElementById('surname');
const emailTextField = document.getElementById('email');


const form = document.getElementById('form-account');
const accountlist = document.getElementById('accountlist');

const allAccount = [];
let selectedEditAccount = undefined;


form.addEventListener('submit', save);
accountlist.addEventListener('click', accoutEditorDelete);



function save(e){
    e.preventDefault();

    const account = {
        name : nameTextField.value,
        surname: surnameTextField.value,
        email: emailTextField.value
    }

    const result =  checkFormData(account);
    
    
    if(result.response){ 
        if(selectedEditAccount){
            updateAccount(account);
        }else{
            addAccount(account);
        }
        
    }else{
        createInfo(result.message, result.response);
        
    }
}

function checkFormData(checkAccount){

    for(const value in checkAccount){
        if(checkAccount[value]){
        }else{
            return {
                response : false,
                message: "Cannot be left blank"
            }
        }
    }
    deleteTextFieldContentsThenSave();
    return {
        response: true,
        message : "Save Success"
    }

}

function createInfo(message, value){
    const info = document.createElement('div');
    info.textContent = message;
    info.className = 'info';

    // if(value){
    //     info.classList.add('info-success'); 
    // }else{
    //     info.classList.add('info-error');
    // }

    info.classList.add(value ? 'info-success': 'info-error');

    document.querySelector('.container').insertBefore(info, form);

    setTimeout(function(){
        const deleteInfoMessage = document.querySelector('.info');

        if(deleteInfoMessage){
            deleteInfoMessage.remove();
        }
    },2000)
}

function deleteTextFieldContentsThenSave(){
    nameTextField.value = "";
    surnameTextField.value = "";
    emailTextField.value = "";
}

function accoutEditorDelete(e){
    if(e.target.classList.contains("btn--delete") ){
        const accountWith_tr = e.target.parentElement.parentElement;
        const accountEmail = e.target.parentElement.previousElementSibling.textContent;
        deleteAccount(accountWith_tr,accountEmail );
    }else if(e.target.classList.contains("btn--edit")){

       document.querySelector('.save-edit').value = "UPDATE"
       const selected_tr = e.target.parentElement.parentElement;
       const selectedmail = selected_tr.cells[2].textContent;

       nameTextField.value = selected_tr.cells[0].textContent;
       surnameTextField.value = selected_tr.cells[1].textContent;
       emailTextField.value = selected_tr.cells[2].textContent;

       selectedEditAccount = selected_tr;

    }
}


function addAccount(account){
    

    const createElementtr = document.createElement('tr');

    

    createElementtr.innerHTML = `<td>${account.name}</td>
    <td>${account.surname}</td>
    <td>${account.email}</td>
    <td>
        <button class="btn btn--edit"><i class="far fa-edit"></i></i></button>
        <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
        
    </td>`;


    accountlist.appendChild(createElementtr);
    allAccount.push(account);
    createInfo("Save Success" , true)

}

function updateAccount(account){


    for(let i = 0; i< allAccount.length; i++){
        if(allAccount[i].email === selectedEditAccount.cells[2].textContent){
            selectedEditAccount[i] = account;
            break;
        }
    }

    selectedEditAccount.cells[0].textContent = account.name;
    selectedEditAccount.cells[1].textContent = account.surname;
    selectedEditAccount.cells[2].textContent = account.email;

    document.querySelector('.save-edit').value = "SAVE";
    selectedEditAccount = undefined;
}

function deleteAccount(account, mail){
    account.remove();
    allAccount.forEach((value, index) => {
        if(value.email == mail){
            allAccount.splice(index, 1);
        }
    });

    deleteTextFieldContentsThenSave();
    document.querySelector('.save-edit').value = "SAVE";

}