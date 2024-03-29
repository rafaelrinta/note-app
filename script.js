const form = document.querySelector('form');
const titleInput = form.elements.noteTitle;
const bodyInput = form.elements.noteBody;

form.addEventListener('submit', (event) => event.preventDefault());

const customValidationHandler = (event) => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity('Wajib diisi.');
        return;
    }
};

titleInput.addEventListener('change', customValidationHandler);
titleInput.addEventListener('invalid', customValidationHandler);

bodyInput.addEventListener('change', customValidationHandler);
bodyInput.addEventListener('invalid', customValidationHandler);

titleInput.addEventListener('blur', handleValidation);
bodyInput.addEventListener('blur', handleValidation);

function handleValidation(event) {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute('aria-describedby');
    const connectedValidationEl = connectedValidationId
        ? document.getElementById(connectedValidationId)
        : null;

    if (connectedValidationEl) {
        if (errorMessage && !isValid) {
            connectedValidationEl.innerText = errorMessage;
        } else {
            connectedValidationEl.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    customElements.define('custom-heading', CustomHeading);
    customElements.define('notes-list', NotesList);
    customElements.define('footer-custom', FooterCustom);

    const noteForm = document.getElementById('noteForm');
    const notesList = document.querySelector('notes-list');

    noteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('noteTitle').value;
        const body = document.getElementById('noteBody').value;

        const noteElement = document.createElement('div');
        noteElement.classList.add('note');

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;

        const bodyElement = document.createElement('p');
        bodyElement.textContent = body;

        noteElement.appendChild(titleElement);
        noteElement.appendChild(bodyElement);

        notesData.unshift({ title, body });
        notesList.updateList();

        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';
    });
});

class CustomHeading extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const title = this.getAttribute('title') || 'Custom Heading';
        this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    margin: 0;
                    color: #fff;
                }
            </style>
            <h1>${title}</h1>
        `;
    }
}

class NotesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.updateList();
    }

    updateList() {
        this.shadowRoot.innerHTML = `
            <style>
                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 40px 60px;
                    justify-items: center;
                    padding: 20px;
                    border: 4px solid #008DDA;
                    border-radius: 20px;
                }

                .note {
                    border: 5px solid #008DDA;
                    border-radius: 20px;
                    padding: 20px;
                    background-color: #008DDA;
                    color: #ccc;
                }
                
                .note h2 {
                    margin-top: 0;
                }
            </style>
        `;
        const notesDataElement = document.createElement('div');
        notesDataElement.classList.add("notes-grid");

        notesData.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');

            const titleElement = document.createElement('h2');
            titleElement.textContent = note.title;

            const bodyElement = document.createElement('p');
            bodyElement.textContent = note.body;

            noteElement.appendChild(titleElement);
            noteElement.appendChild(bodyElement);

            notesDataElement.appendChild(noteElement);
        });

        this.shadowRoot.appendChild(notesDataElement);
    }
}

class FooterCustom extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const text = this.getAttribute('text') || 'Custom Footer';
        this.shadowRoot.innerHTML = `
            <footer>${text}</footer>
        `;
    }
}