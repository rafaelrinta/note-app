const form = document.querySelector('form');
const titleInput = form.elements.noteTitle;
const bodyInput = form.elements.noteBody; // Menambahkan ini untuk mengambil input tubuh catatan

form.addEventListener('submit', (event) => event.preventDefault());

const customValidationHandler = (event) => {
  event.target.setCustomValidity('');

  if (event.target.validity.valueMissing) {
    event.target.setCustomValidity('Wajib diisi.');
    return;
  }
};

// Menambahkan event listener dan handler untuk judul catatan
titleInput.addEventListener('change', customValidationHandler);
titleInput.addEventListener('invalid', customValidationHandler);

// Menambahkan event listener dan handler untuk tubuh catatan
bodyInput.addEventListener('change', customValidationHandler);
bodyInput.addEventListener('invalid', customValidationHandler);

// Menambahkan event listener untuk menangani blur event
titleInput.addEventListener('blur', handleValidation);
bodyInput.addEventListener('blur', handleValidation);

function handleValidation(event) {
  const isValid = event.target.validity.valid;
  const errorMessage = event.target.validationMessage;

  const connectedValidationId = event.target.getAttribute('aria-describedby');
  const connectedValidationEl = connectedValidationId
    ? document.getElementById(connectedValidationId)
    : null;

  if (connectedValidationEl && errorMessage && !isValid) {
    connectedValidationEl.innerText = errorMessage;
  } else {
    connectedValidationEl.innerText = '';
  }
}





document.addEventListener('DOMContentLoaded', function() {
    customElements.define('custom-heading', CustomHeading);
    customElements.define('notes-list', NotesList);
    customElements.define('footer-custom', FooterCustom);

    const noteForm = document.getElementById('noteForm');
    const notesList = document.querySelector('notes-list');

    noteForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form dari melakukan submit default

        // Ambil nilai dari input judul dan isi catatan
        const title = document.getElementById('noteTitle').value;
        const body = document.getElementById('noteBody').value;

        // Buat elemen baru untuk catatan
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;

        const bodyElement = document.createElement('p');
        bodyElement.textContent = body;

        noteElement.appendChild(titleElement);
        noteElement.appendChild(bodyElement);

        // Sisipkan catatan baru di awal daftar catatan
        notesData.unshift({ title, body }); // Tambahkan catatan baru ke awal array
        notesList.updateList(); // Perbarui tampilan notes-list setelah menambahkan catatan baru

        // Bersihkan nilai input setelah catatan ditambahkan
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';

        // Perbarui tampilan notes-list setelah menambahkan catatan baru
    
    });

    // // Menampilkan data dummy yang telah diberikan sebelumnya
    // notesData.forEach(function(note) {
    //     const noteElement = document.createElement('div');
    //     noteElement.classList.add('note');

    //     const titleElement = document.createElement('h2');
    //     titleElement.textContent = note.title;

    //     const bodyElement = document.createElement('p');
    //     bodyElement.textContent = note.body;

    //     noteElement.appendChild(titleElement);
    //     noteElement.appendChild(bodyElement);

    //     notesList.appendChild(noteElement);
    // });
});

class CustomHeading extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Attach shadow DOM
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
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    justify-items: center;
                    padding: 20px;
                    border: 4px solid #008DDA;
                    border-radius: 20px;
                    width: 100%
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
        this.attachShadow({ mode: 'open' }); // Attach shadow DOM
        const text = this.getAttribute('text') || 'Custom Footer'; // Ambil nilai custom attribute 'text'
        this.shadowRoot.innerHTML = `
            <footer>${text}</footer>
        `;
    }
}