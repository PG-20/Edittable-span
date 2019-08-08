const template = document.createElement('template')

// window.addEventListener('load', () => {localStorage.clear()} );

template.innerHTML = `
    <style>
        input {
            display: inline;
            border-width: 0;
            border-bottom: 1px dashed;
            font-size: large;
        }
        input:focus {
            outline: none;
            border-bottom: 1px dashed;
        } 
        input:disabled {
            background-color: transparent;
            border: none;
            font-weight: bold;
        }
        button {
            outline: none;
            border: none;
            background-color: transparent;
        }
        button:active {
          transform: translateY(2px);
        }   
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <div id="input-container" style="margin: 5px">
        <input type="text" placeholder="Company Name">
        <button type="button" id="cancel"><i class="material-icons" style="color: red;font-size: 30px;">clear</i></button>
        <button type="button" id="done"><i class="material-icons" style="color: lawngreen;font-size: 30px;">check</i></button>
        <button type="button" id="edit"><i class="material-icons" style="color: mediumblue;font-size: 30px;">edit</i></button>
    </div>
`;

customElements.define('editable-span', class EditableSpan extends HTMLElement {

    static classCount = 0;

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }


    constructor() {
        super();
        const root = this.attachShadow({mode: 'open'});
        root.appendChild(template.content.cloneNode(true));
        EditableSpan.classCount++;

        this.localID = "inputValue"+EditableSpan.classCount.toString();

        this.showText = this.showText.bind(this);
        this.editText = this.editText.bind(this);
        this.keyAction = this.keyAction.bind(this);
        this.cancelAction = this.cancelAction.bind(this);
    }

    connectedCallback() {
        this.$('#done').addEventListener('click', this.showText);
        this.$('#edit').addEventListener('click', this.editText);
        this.$('#cancel').addEventListener('mousedown', this.cancelAction);
        this.$('input').addEventListener('keyup', this.keyAction );
        this.$('input').addEventListener('blur', this.showText );

        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem(this.localID)){
                let inputElem = this.$('input');
                inputElem.value = String(localStorage.getItem(this.localID));
                inputElem.disabled = true ;
                this.$('#cancel').style.display = 'none';
                this.$('#done').style.display = 'none';
                this.$('#edit').style.display = '';
            }
            else{
                this.$('#cancel').style.display = 'none';
                this.$('#done').style.display = '';
                this.$('#edit').style.display = 'none';
            }
        } else {
            window.alert("Sorry, your browser does not support Web Storage...");
        }
    }

    disconnectedCallback(){
        localStorage.clear();
        this.$('#done').removeEventListener('click', this.showText);
        this.$('#edit').removeEventListener('click', this.editText);
        this.$('#cancel').removeEventListener('mousedown', this.cancelAction);
        this.$('input').removeEventListener('keyup', this.keyAction );
        this.$('input').removeEventListener('blur', this.showText );
    }

    keyAction(event){
        event.preventDefault();
        if (event.key === "Enter"){
            this.showText();
        } else if (event.key === "Escape"){
            this.cancelAction()
        }
    }

    cancelAction(){
        if (typeof(Storage) !== "undefined") {
            let inputElem = this.$('input');
            inputElem.value = localStorage.getItem(this.localID);
            inputElem.disabled = true;
            this.$('#done').style.display = 'none';
            this.$('#cancel').style.display = 'none';
            this.$('#edit').style.display = '';
        } else {
            alert("Sorry, your browser does not support Web Storage...");
        }
    }

    editText(){
        let inputElem = this.$('input');
        inputElem.disabled = false;
        inputElem.select();
        this.$('#done').style.display = '';
        this.$('#edit').style.display = 'none';
        this.$('#cancel').style.display = '';
    }

    showText(){
        let inputElem = this.$('input');
        if (inputElem.value) {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem(this.localID, inputElem.value);
                inputElem.selected = false;
                inputElem.disabled = true;
                this.$('#done').style.display = 'none';
                this.$('#cancel').style.display = 'none';
                this.$('#edit').style.display = '';
            } else {
                alert("Sorry, your browser does not support Web Storage...");
            }
        }
        else {
            alert("Empty Input Value");
        }
    }

});