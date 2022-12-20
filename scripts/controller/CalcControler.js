class CalcController {

    constructor(){
        
        this._audio = new Audio('click.mp3') // Váriavel que contém o áudio
        this._audioOnOff = true; // Controla se o áudio esta ligado ou desligado


        this._lastOperator = '';
        this._lastNumber = '';

        this._locale = 'pt-BR' // Definir o local do usuário

        // Elementos do HTML puxados pelo DOM
        this._displayCalcEl = document.querySelector('#display')
        this._dateEl = document.querySelector('#data')
        this._timeEl = document.querySelector('#hora')

        this._operation = [];

        this._displayCalc = '0'; // Atributo que guarda o valor do display
        this.displayCalc = 0;
        this._currentDate; // Data do dia atual

        this.initialize(); 
        this.initButtonsEvents()
        this.initKeyboard();
    }

    // Método que inicializa as funções do documento
    initialize(){
        this.setDisplayDateTime()
        // Defini um intervalo para ficar atualizando a data e a hora
        setInterval(()=>{

            this.setDisplayDateTime()

        }, 1000);
        
        document.querySelectorAll('.btn-ac').forEach(btn =>{

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });

        });

    }

    playAudio(){

        if (this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }

    }

    // Método que controla o áudio
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    // Eventos de teclados
    initKeyboard(){

        document.addEventListener('keyup', e=>{
           
            this.playAudio();
            switch(e.key){
        
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                    break;
            }

        });

    }

    // Método que add os eventos em seu elemento
    addEventListenerAll(element, events, fn){
        // Os eventos são transformados em arrays e é executado tudo para cada evento
        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn)

        });
    }

    // Método que limpa toda a informação das operações
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.displayCalc = 0;
    }

    // Método que limpa a última operação
    clearEntry(){
        this._operation.pop();
        this.displayCalc = 0;
    }
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
    setLastOperation(value){
        this._operation[this._operation.length-1] = value
    }

    // Método que diz se o elemento é um operador válido
    isOperator(value){
        if (['+', '-', '*', '/', '%'].indexOf(value) > -1){
            return true;
        } else{
            return false;
        }
    }

    // adiciona um novo valor a lista de operações e realiza as operações em pares
    pushOperation(value){
        this._operation.push(value);

        if (this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        try{
            return eval(this._operation.join(''));
        } catch{
            setTimeout(e=>{
                this.setError();
            }, 1);
        }
        
    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length - 1;i >= 0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    // Método que executa o calculo quando o array tem mais de 3 elementos
    calc(){
        
        let last = ''

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }
  

        if (this._operation.length > 3){
            last = this._operation.pop();

            this._lastNumber = this.getResult();
            
        } else if (this._operation.length == 3){
        
            this._lastNumber = this.getLastItem(false);

        }
        let result = this.getResult();

        if (last == '%'){
            result /= 100;
            this._operation = [result];
        } else{
            
            this._operation = [result];
            if (last) this._operation.push(last);
        }

        

        this.displayCalc = result;
    }


    // Executa a operação de concatenar os valores digitados e cria a lista de operações
    addOperation(value){
        if (isNaN(this.getLastOperation())){
            if(this.isOperator(value)){

                this.setLastOperation(value);
                
            } else{
                this.pushOperation(value);
                this.displayCalc = value;
            }
        } else if(this.isOperator(value)){
            this.pushOperation(value);
        } else{
            let newValue = String(this._operation[this._operation.length-1]) + value.toString();
            this.setLastOperation(newValue);
            this.displayCalc = newValue;
        }
    }

    // Método que retorna um sinal de erro no display da calculadora
    setError(){
        this.displayCalc = 'Error';
    }

    // Método que coloca o ponto
    addDot(){
        
        let lastOperation = this.getLastOperation();
        if (typeof(lastOperation) == 'string' || lastOperation.toString().split('').indexOf('.') > -1) {
            console.log('oi')
            return;
        }

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.')
        } else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.displayCalc = this._operation[this._operation.length-1];
    }

    execBtn(value){
        this.playAudio();
        switch(value){
            
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break;
            default:
                this.setError();
                break;
        }
    }

    // Inicia os eventos dos botões
    initButtonsEvents(){
        // Todos as tags g que estão dentro do id 'buttons' e 'parts'
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        // Executa para cada elemento do array
        buttons.forEach((btn, index) => {
            
            this.addEventListenerAll(btn, 'click drag', e=>{

                let textBtn = btn.className.baseVal.replace('btn-', '');

                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{

                btn.style.cursor = 'pointer'

            });

        });
    }

    // Método que define a data e a hora de acordo com o local
    setDisplayDateTime(){
        this.displayDate = this._currentDate.toLocaleDateString(this._locale,{
            day:'2-digit',
            month:'2-digit',
            year:'numeric'
        });
        this.displayTime = this._currentDate.toLocaleTimeString(this._locale);
    }

    // Definindo os métodos de entrada e saida do display da hora
    get displayTime(){

        return this._timeEl.innerHTML;

    }
    set displayTime(value){

        this._timeEl.innerHTML = value;

    }

    // Definindo os métodos de entrada e saida do display da data
    get displayDate(){

        return this._dateEl.innerHTML;
        
    }
    set displayDate(value){

        this._dateEl.innerHTML = value;

    }

    // Definindo os métodos de entrada e saida do display do calculo
    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    }
    set displayCalc(value){

        if (value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;

    }

    // Definindo os métodos de entrada e saida da data atual
    get _currentDate(){

        return new Date();

    }
    set _currentDate(value){

        this._currentDate = value;
        
    }
}
