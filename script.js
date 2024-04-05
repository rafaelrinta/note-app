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

        // Fetch API untuk menambahkan catatan baru
        fetch('https://notes-api.dicoding.dev/v2/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body }),
        })
        .then(response => response.json())
        .then(data => {
            // Memperbarui tampilan daftar catatan setelah menambahkan catatan baru
            notesList.updateList();
        })
        .catch(error => console.error('Error:', error));

        document.getElementById('noteTitle').value = '';
        document.getElementById('noteBody').value = '';
    });

    // Menambahkan event listener untuk tombol hapus catatan
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const noteId = event.target.dataset.id;
            deleteNote(noteId);
        }
    });
});

// Fungsi untuk menghapus catatan menggunakan Fetch API
function deleteNote(noteId) {
    fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete note');
        }
        return response.json();
    })
    .then(data => {
        // Memperbarui tampilan daftar catatan setelah menghapus catatan
        const notesList = document.querySelector('notes-list');
        notesList.updateList();
    })
    .catch(error => console.error('Error:', error));
}

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
        // Fetch API untuk mendapatkan daftar catatan
        fetch('https://notes-api.dicoding.dev/v2/notes')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Data received is not an array');
            }
    
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
    
            data.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note');
    
                const titleElement = document.createElement('h2');
                titleElement.textContent = note.title;
    
                const bodyElement = document.createElement('p');
                bodyElement.textContent = note.body;
    
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.dataset.id = note.id; // Menyimpan ID catatan pada data attribute
    
                noteElement.appendChild(titleElement);
                noteElement.appendChild(bodyElement);
                noteElement.appendChild(deleteButton); // Menambahkan tombol hapus pada catatan
    
                notesDataElement.appendChild(noteElement);
            });
    
            this.shadowRoot.appendChild(notesDataElement);
        })
        .catch(error => console.error('Error:', error));
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
