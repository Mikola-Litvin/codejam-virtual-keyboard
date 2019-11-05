const kbrd = {

  parent: document.body,
  fragment: document.createDocumentFragment(),
  input: document.createElement('div'),
  keyboardWrapper: document.createElement('div'),
  event: document.createEvent('UIEvents'),
  buttons: keyboard,
  textCase: 'lower',
  regexp: /Key.+/,
  regexp2: /Digit.+/,
  lang: null,
  button: null,
  keys: new Array(),
  code: null,

  setLanguage: function() {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'en');
    }
    this.lang = localStorage.getItem('lang');
  },
  
  set: function() {
    let digits = Array.from(document.querySelectorAll('[data-code^="Digit"]'));
    let backAndBracketKeys = Array.from(document.querySelectorAll('[data-code^="B"]'));
    let letters = Array.from(document.querySelectorAll('[data-code^="Key"]'));
    letters.push(document.querySelector('[data-code="Minus"]'));
    letters.push(document.querySelector('[data-code="Equal"]'));
    letters.push(document.querySelector('[data-code="Semicolon"]'));
    letters.push(document.querySelector('[data-code="Quote"]'));
    letters.push(document.querySelector('[data-code="Comma"]'));
    letters.push(document.querySelector('[data-code="Period"]'));
    letters.push(document.querySelector('[data-code="Slash"]'));
    this.keys = this.keys.concat(letters, digits, backAndBracketKeys);
  },

  addInputElement: function() {
    this.input.className = 'input';
    this.input.contentEditable = true;
    this.input.tabIndex = '-1';
    this.parent.appendChild(this.input);
  },

  addKeyboardWrapper: function() {
    this.keyboardWrapper.className = 'keyboard';
    this.parent.appendChild(kbrd.keyboardWrapper);
  },

  addButtons: function() {
    this.buttons.forEach ((item) => {
      this.button = document.createElement('div');
      this.button.className = 'key';
      this.button.innerText = item.key.lower[this.lang];
      this.button.setAttribute('data-code', item.code)
      if (this.regexp.exec(this.button.dataset.code) == null && this.regexp2.exec(this.button.dataset.code) == null) {
        this.button.classList.add(this.button.dataset.code.toLowerCase());
      }
      this.fragment.appendChild(this.button);
    });
    this.keyboardWrapper.appendChild(this.fragment);
  },

  create: function()  {
    this.setLanguage();
    this.addInputElement();
    this.addKeyboardWrapper();
    this.addButtons();
    this.set();
    return this;
  },

  changeSymbols: function(textcase = this.textCase) {
    this.keys.forEach((item) => {
      this.buttons.forEach((item2) => {
        if (item2.code == item.dataset.code) {
          item.innerText = item2.key[textcase][this.lang];
        }
      });
    });
  },

  upperCase: function() {
    this.changeSymbols('upper');
  },

  lowerCase: function() {
    this.changeSymbols('lower');
  },

  switchLang: function() {
    this.changeSymbols();
  },

  keyDown: function() {
    this.parent.addEventListener('keydown', (e) => {
      this.code = '[data-code="'+e.code+'"]';
      try {
        document.querySelector(this.code).classList.add("press-button");
      }
      catch {
        return;
      }
      if (e.code == 'ShiftLeft' || e.code == 'ShiftRight') {
        if (this.textCase == 'upper') {
          this.lowerCase();
        }
        else {

          this.upperCase();
        }
      }
      else if (e.code== 'ControlLeft' || e.code == 'AltLeft' || e.code== 'ControlRight' || e.code == 'AltRight') {
        if (e.ctrlKey && e.altKey) {
          (localStorage.getItem('lang') == 'en') ? localStorage.setItem('lang', 'ru') : localStorage.setItem('lang', 'en');
          this.setLanguage();
          this.switchLang();
        }
      }
      else if (e.code == 'Backspace' || e.code == 'Delete') {
        let str = this.input.innerText;
        this.input.innerText = str.slice(0, str.length - 1);
      }
      else if (e.code == 'Tab') {
        this.input.innerText += "\u00A0\u00A0\u00A0\u00A0";
      }
      else if (e.code == 'CapsLock') {
        if (this.textCase == 'upper') {
          this.textCase = 'lower';
          this.lowerCase();
          console.log(this.textCase);
        }
        else {
          this.textCase = 'upper';
          this.upperCase();
          console.log(this.textCase);
        }
      }
      else if (e.code == 'Enter') {
        this.input.innerText += "\u000A";
      }
      else if (e.code == 'Space') {
        this.input.innerText += "\u00A0";
      }
      else {
        try {
          this.input.innerText += document.querySelector(this.code).innerText;
        }
        catch {
          return;
        }
      }
      e.preventDefault();
    });
  },

  keyUp: function() {
    this.parent.addEventListener('keyup', (e) => {
      this.code = '[data-code="'+e.code+'"]';
      try {
        document.querySelector(this.code).classList.remove('press-button');
      }
      catch {
        return;
      }
      if (e.code == 'ShiftLeft' || e.code == 'ShiftRight') {
        if (this.textCase == 'lower') {
          this.lowerCase();
        }
        else {
          this.upperCase();
        }
      }
    });
  },

  mouseEvent: function(e, event) {
    this.event.initUIEvent(event, true, true, window, 1);
    this.event.code = e.target.dataset.code;
    this.parent.dispatchEvent(this.event);
  },

  mouseDown: function() {
    this.keyboardWrapper.addEventListener('mousedown', (e) => {
      this.mouseEvent(e, 'keydown');
    });
  },

  mouseUp: function() {
    this.keyboardWrapper.addEventListener('mouseup', (e) => {
      this.mouseEvent(e, 'keyup');
    });
  },

  mouseOut: function() {
    this.keyboardWrapper.addEventListener('mouseout', (e) => {
      if (e.target.dataset.code == "ShiftLeft") return;
      this.mouseEvent(e, 'keyup');
    });
  },

  addEventListeners: function() {
    this.keyDown();
    this.keyUp();
    this.mouseDown();
    this.mouseUp();
    this.mouseOut();
  }
};

kbrd.create().addEventListeners();