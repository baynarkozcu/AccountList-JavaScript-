class User{
    constructor(name, surname, email){
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
}

class Utils{
    static checkSpaceOnForm(...elements){
        let result = true;
        elements.forEach((value) => {
            if(value.length === 0){
                result = false;
                return false;
            }
        });
        return result;
    }

    static checkEmail(email){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }
}


class Screen{
    constructor(){
        this.name = document.getElementById("name");
        this.surname = document.getElementById("surname");
        this.email = document.getElementById("email");
        this.saveOrEditButton = document.querySelector(".save-edit");
        this.form = document.getElementById("form-account").addEventListener('submit', this.saveOrUpdate.bind(this));
        this.form = document.getElementById("form-account");
        this.accountList = document.getElementById('accountlist');
        this.accountList.addEventListener('click', this.updateOrDeleteButtonEvent.bind(this));
        this.selectedRow = undefined;
        this.db = new Database();
        this.getAccountsOnDB();
    }

    saveOrUpdate(e){
        e.preventDefault();
        const user = new User(this.name.value, this.surname.value, this.email.value);
        const result = Utils.checkSpaceOnForm(user.name, user.surname, user.email);
        const checkEmail = Utils.checkEmail(this.email.value);

        if(result){
            if(!checkEmail){
                this.createInfoMessage("Undefined Email", false);
                return;
            }
            if(this.selectedRow){
                const emailCheck = this.db.updateAccount(user,user.email);
                if(emailCheck){
                this.updateAccountOnScreen(user);
                this.textFieldsClear();
                }else{
                    this.createInfoMessage("ERROR", false);
                }

            }else{
                const result = this.db.addAccount(user);
                if(result){
                    
                    this.createInfoMessage("Success",true)
                    this.accountTemplate(user);
                    this.db.addAccount(user);
                    this.textFieldsClear();
                }else{
                    this.createInfoMessage("Unable  Email!!");
                }

            }

           

            
        }else{
            this.createInfoMessage("No Blank", false);
        }
    }

    updateOrDeleteButtonEvent(e){
        const clickElement = e.target;
        if(clickElement.classList.contains('btn--edit')){
            this.selectedRow = clickElement.parentElement.parentElement;
            this.saveOrEditButton.value = "EDIT";
            /*
            const oldAccount = new User(this.selectedRow.cells[0].textContent, this.selectedRow.cells[1].textContent, this.selectedRow.cells[2].textContent);
            */
           this.name.value = this.selectedRow.cells[0].textContent;
           this.surname.value = this.selectedRow.cells[1].textContent;
           this.email.value = this.selectedRow.cells[2].textContent;

        }else if(clickElement.classList.contains('btn--delete')){
            this.selectedRow = clickElement.parentElement.parentElement;
            this.deleteAccountOnScreen();
        }
    }


    accountTemplate(account){
        const createElement_tr = document.createElement('tr');
        createElement_tr.innerHTML = `<td>${account.name}</td>
        <td>${account.surname}</td>
        <td>${account.email}</td>
        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
            
        </td>`;

        this.accountList.appendChild(createElement_tr);

        

    }

    getAccountsOnDB(){
        this.db.allAccount.forEach((value) => {
            this.accountTemplate(value);
        });
    }

    updateAccountOnScreen(account){

        this.db.updateAccount(account, this.selectedRow.cells[2].textContent);

        this.selectedRow.cells[0].textContent = account.name;
        this.selectedRow.cells[1].textContent = account.surname;
        this.selectedRow.cells[2].textContent = account.email;
        this.saveOrEditButton.value = "Save";
        this.selectedRow = undefined;
        this.createInfoMessage("Success", true);

        

    }

    deleteAccountOnScreen(){
        this.selectedRow.remove();
        const deleteEmail = this.selectedRow.cells[2].textContent;
        this.db.deleteAccount(deleteEmail);
        this.selectedRow = undefined;
        this.createInfoMessage("Success", true);
    }

    createInfoMessage(message, value){
        // const info = document.createElement('div');
        // info.className = 'info';
        const newInfoDiv = document.querySelector('.info');
        newInfoDiv.textContent = message;

    
        // if(value){
        //     info.classList.add('info-success'); 
        // }else{
        //     info.classList.add('info-error');
        // }
    
        newInfoDiv.classList.add(value ? 'info-success': 'info-error');
    
        document.querySelector('.container').insertBefore(newInfoDiv, this.form);
    
        setTimeout(function(){
            newInfoDiv.className = 'info';

        },2000)
    }

    textFieldsClear(){
        this.name.value = "";
        this.surname.value= "";
        this.email.value = "";
    }


}


class Database{
    constructor(){
        this.allAccount = this.getAccounts();
    }

    checkUniqueEmail(email){
        const result = this.allAccount.find(account => {
            return account.email === email;
        });

        if(result){
            return false;
        }else{
            return true;
        }
    }


    getAccounts(){
        let allAccountOnDB = [];
        if(localStorage.getItem('allAccount') === null){
            allAccountOnDB = [];
        }else{
            allAccountOnDB = JSON.parse(localStorage.getItem('allAccount'));
        }

        this.allAccount = allAccountOnDB;
        return allAccountOnDB;
    }

    addAccount(account){
        if(this.checkUniqueEmail(account.email)){
            this.allAccount.push(account);
            localStorage.setItem('allAccount', JSON.stringify(this.allAccount));

            return true;
        }else{
            return false;
        }


    }

    deleteAccount(email){
        this.allAccount.forEach((account, index) => {
            if(account.email === email){
                this.allAccount.splice(index, 1);
            }
        });
        localStorage.setItem('allAccount', JSON.stringify(this.allAccount));
    }

    updateAccount(updateAccount , email){

        if(this.checkUniqueEmail(updateAccount.email)){

            this.allAccount.forEach((account, index)=> {
                if(account.email === email){                
                    this.allAccount[index] = updateAccount;
                    localStorage.setItem('allAccount', JSON.stringify(this.allAccount));
                    return true;

                }
            });



            return true;

        }else{

            return false;
        }






    }
}


document.addEventListener('DOMContentLoaded', function(e){
    const screen = new Screen();
});