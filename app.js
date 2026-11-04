//settings page
function getSettings(){
    let settings=JSON.parse(localStorage.getItem("mySet")) || {
        currency:"XOF",
        theme:"Light"
    };
    return settings;
}
function saveSettings(settings){
    localStorage.setItem("mySet", JSON.stringify(settings));
    applyTheme();
}
const settings=getSettings();


const myCurrency=document.querySelector('#currency');
const myPref=document.querySelector('#pref');
const myReset=document.querySelector('#reset-type');
const mySubmit=document.querySelector('#submit-type');

if(myCurrency&&myPref){
    myCurrency.value=settings.currency;
    myPref.value=settings.theme;
}
if(mySubmit){
    mySubmit.addEventListener("click",()=>{
        settings.currency=myCurrency.value;
        settings.theme=myPref.value;
        saveSettings(settings);
    });
}
if(myReset){
    myReset.addEventListener("click",()=>{
        settings.currency="XOF";
        settings.theme="Light";
        saveSettings(settings);
        myCurrency.value=settings.currency;
        myPref.value=settings.theme;
    });
}

function applyTheme(){
    if(settings.theme==="Dark"){
        document.body.classList.add("dark-mode");
    }
    else{
        document.body.classList.remove("dark-mode");
    }
}
applyTheme();

function convertCurrency(amount){
    if(settings.currency==="XOF"){
        return amount;
    }
    else if(settings.currency==="EUR"){
        return amount/655;
    }
    else if(settings.currency==="USD"){
        return amount/586;
    }
}
function convertToXOF(amount){
    if(settings.currency==="XOF"){
        return amount;
    }
    else if(settings.currency==="EUR"){
        return amount*655;
    }
    else if(settings.currency==="USD"){
        return amount*586;
    }
}
function getLabel(){
    if(settings.currency==="XOF"){
        return "XOF";
    }
    else if(settings.currency==="EUR"){
        return "EUR";
    }
    else if(settings.currency==="USD"){
        return "USD";
    }
}

// task page
function getTasks(){ //retrieves saved tasks
    let tasks=JSON.parse(localStorage.getItem("myTasks")) || [];
    return tasks;
}
function saveTasks(tasks){ //saves the aray
    localStorage.setItem("myTasks", JSON.stringify(tasks)) ;
}

const tasks = getTasks(); //loads existing tasks

const form1 = document.querySelector('#action-form')
const input1 = document.querySelector('#action')
const list1 = document.querySelector('#list1')

function displayTasks(){
    list1.innerHTML="";

    tasks.forEach((task) => {
        const li=document.createElement('li');
        const checkbox= document.createElement('input');
        checkbox.type="checkbox";
        checkbox.checked=task.completed;
        li.append(checkbox);
        li.append(task.text);
        list1.append(li);

        checkbox.addEventListener("change",()=>{
        task.completed=checkbox.checked;
        saveTasks(tasks);
        updateProgress();
    });
    });
}

if(list1){
    displayTasks();
    updateProgress()
}

if(form1 && input1){
    form1.addEventListener("submit", (event)=> {
        event.preventDefault();

        const text= input1.value.trim();
        if(text==="")return;

        const newTask={
            text: text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        displayTasks();
        updateProgress()
        input1.value="";
    });
}

function updateProgress(){
    const progress=document.querySelector('#progress');
    if(!progress)return;

    const completedTasks= tasks.filter(task=>task.completed).length;
    const percentage= tasks.length===0 ? 0 : Math.round((completedTasks/tasks.length)*100);
    progress.textContent=percentage+"%";
    const progressFill=document.querySelector("#progress-fill");
    progressFill.style.width=percentage+"%";
}

//budget page
function getBudget(){ 
    let budget=JSON.parse(localStorage.getItem("myBudget")) || {
        income:0,
        expenses:0,
        savings:0,
        transactions:[]
    };
    return budget;
}
function saveBudget(budget){
    localStorage.setItem("myBudget", JSON.stringify(budget));
}
const budget=getBudget();

const myIncome=document.querySelector('#income-form');
const incomeInput=document.querySelector('#income');
const myExpense=document.querySelector('#expense-form');
const expenseInput=document.querySelector('#expense');
const amountInput=document.querySelector('#amount')
const mySavings=document.querySelector('#savings-form');
const savingsInput=document.querySelector('#savings');
const list2=document.querySelector('#list2');

if(myIncome&&incomeInput){
    myIncome.addEventListener("submit",(event)=>{
    event.preventDefault();
    let text= incomeInput.value.trim();
    if(text==="")return;
    text=Number(text);
    if(!Number.isFinite(text)|| text<=0)return;
    budget.income+=convertToXOF(text);

    const newBudg={
            type:"income",
            amount:convertToXOF(text)
        };
    budget.transactions.push(newBudg);
    saveBudget(budget);
    displayTransaction();
    incomeInput.value="";
});
}

if(myExpense&&expenseInput&&amountInput){
    myExpense.addEventListener("submit",(event)=>{
    event.preventDefault();
    let text1=expenseInput.value.trim();
    let text2=amountInput.value.trim();
    if(text1==="")return;
    if(text2==="")return;
    text2=Number(text2);
    if(!Number.isFinite(text2)||text2<=0)return;
    budget.expenses+=convertToXOF(text2);

    const newExp={
        type:"expense",
        category:text1,
        amount:convertToXOF(text2)
    };
    budget.transactions.push(newExp);
    saveBudget(budget);
    displayTransaction();
    expenseInput.value="";
    amountInput.value="";
});
}

if(mySavings&&savingsInput){
    mySavings.addEventListener("submit",(event)=>{
    event.preventDefault();
    let text=savingsInput.value.trim();
    if(text==="")return;
    text=Number(text);
    if(!Number.isFinite(text)|| text<=0)return;
    budget.savings+=convertToXOF(text);

    const newSav={
        type:"savings",
        amount:convertToXOF(text)
    };
    budget.transactions.push(newSav);
    saveBudget(budget);
    displayTransaction();
    savingsInput.value="";
});
}

function displayTransaction(){
    list2.innerHTML="";
    budget.transactions.forEach((transaction) => {
        const li=document.createElement('li');
        if(transaction.type==="income"){
            li.textContent= "Income:" +" +"+convertCurrency(transaction.amount).toFixed(2)+" "+ getLabel();
            li.classList.add("income");
        }
        else if(transaction.type==="expense"){
            li.textContent= transaction.category +": -"+convertCurrency(transaction.amount).toFixed(2)+" "+ getLabel();
            li.classList.add("expense");
        }
        else{
            li.textContent= "Savings:" +" +"+convertCurrency(transaction.amount).toFixed(2)+" "+ getLabel();
            li.classList.add("savings");
        }
        list2.append(li);
    });
}
if(list2){
    displayTransaction();
}

const inc=document.querySelector('#total-income');
const exp=document.querySelector('#total-expenses');
const sav = document.querySelector('#total-savings');
const bal=document.querySelector('#total-balance');
function displayFinance(){
    inc.textContent=convertCurrency(budget.income).toFixed(2)+" "+ getLabel();
    exp.textContent=convertCurrency(budget.expenses).toFixed(2)+" "+ getLabel();
    sav.textContent=convertCurrency(budget.savings).toFixed(2)+" "+ getLabel();
    bal.textContent=convertCurrency(budget.income-budget.expenses-budget.savings).toFixed(2)+" "+ getLabel();
}
if(inc&&exp&&sav&&bal){
    displayFinance();
}

