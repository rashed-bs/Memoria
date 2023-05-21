﻿function handleNoteTitleClick(event) {
    var noteId = event.target.id.replace('title-', '');
    fetchNoteUpdationModal()
        .then(function () {
            return fetchNoteById(noteId);
        })
        .then(function (noteData) {
            console.log(noteData);
            let totalSelectedAttachment = 0;
            let totalUploadedAttachment = 0;
            // modal handling code
            var labelSelect = document.getElementById('labelsSelect');
            const todoContainer = document.getElementById('todo-container');
            const todoToggle = document.querySelector('#myCheckbox');
            const todoSection = document.getElementById('todo-section');
            const closeButton = document.querySelector('#myModal .modal-header .btn-close');
            const saveButton = document.getElementById('update-button');
            const attachmentButton = document.getElementById('attachment-button');
            const authorizationButton = document.getElementById('authorization-button');
            const todoInput = document.getElementById('todo-input');


            // Set note title and description
            const noteTitle = document.getElementById('note-title');
            const noteDescription = document.getElementById('note-description');
            noteTitle.value = noteData.title;
            noteDescription.value = noteData.description;

            // data containers 
            const labelsInputs = []; // Array to store the label input elements
            const labelsValuesTemp = [];
            // Populate labels
            const labelsContainer = document.getElementById('labelsContainer');
            labelsContainer.innerHTML = ''; // Clear existing labels
            for (let label of JSON.parse(noteData.labels)) {
                labelsValuesTemp.push(label);
                var labelElement = document.createElement('p');
                labelElement.textContent = label;
                labelsContainer.appendChild(labelElement);
            }

            // Populate todo items
            const addedTodos = document.getElementById('added-todos');
            addedTodos.innerHTML = ''; // Clear existing todo items
            for (let todoItem of JSON.parse(noteData.todos)) {
                if (todoItem.value !== '') {
                    console.log(todoItem.value);
                    var todoItemElement = document.createElement('div');
                    todoItemElement.classList.add('todo-item');
                    var todoTextElement = document.createElement('span');
                    todoTextElement.textContent = todoItem.value;
                    var removeButton = document.createElement('button');
                    removeButton.classList.add('btn', 'remove-todo');
                    removeButton.innerHTML = '<i class="fas fa-times"></i>';

                    todoItemElement.appendChild(removeButton);
                    todoItemElement.appendChild(todoTextElement);
                    addedTodos.appendChild(todoItemElement);
                }
            }

            // Check the toggle button if todos are not empty
            if (addedTodos.children.length > 0) {
                todoToggle.checked = true;
                todoSection.style.display = 'block';
            } else {
                todoToggle.checked = false;
                todoSection.style.display = 'none';
            }



            // Populate remainder
            const remainderButton = document.getElementById('remainder-button');
            const datePicker = document.getElementById('reminder-datepicker');
            if (noteData.isRemainderAdded) {
                remainderButton.checked = true;
                datePicker.style.display = 'block';
                datePicker.value = noteData.remainderDateTime;
            } else {
                remainderButton.checked = false;
                datePicker.style.display = 'none';
            }

            // Populate file review
            fetchAttachmentAllForANote(noteData.id)
                .then(function (attachments) {
                    console.log(attachments);
                    for (let i = 0; i < attachments.length; i++) {
                        var currentAttachment = attachments[i];
                        if (currentAttachment.fileType.startsWith("image/") ) {
                            var img = $("<img>").attr("src", 'data:' + currentAttachment.fileType + ';base64,' + currentAttachment.fileBase64);
                            // Append the image to the file details container
                            var fileDetails = $("<div>")
                                .addClass(["file-details"])
                                .data('attachment-id', currentAttachment.id)
                                .append(img);
                            $("#file-details-container").append(fileDetails);
                        } else {
                            var iframeElement = document.createElement('iframe');
                            iframeElement.src = 'data:' + currentAttachment.fileType + ';base64,' + currentAttachment.fileBase64;
                            iframeElement.classList.add('pdf-preview-in-note');
                            
                            var fileDetails = $("<div>")
                                .addClass(["file-details"])
                                .data('attachment-id', currentAttachment.id)
                                .append(iframeElement);
                            $("#file-details-container").append(fileDetails);
                        }
                    }
                })

            // Function to retrieve all the todo inputs
            function getTodoInputs() {
                const todoItems = document.querySelectorAll('#added-todos .todo-item');
                const todoValues = [];
                todoItems.forEach(function (todoItem) {
                    const todoInput = todoItem.querySelector('span');
                    const todoValue = todoInput.textContent.trim();
                    if (todoValue !== '') {
                        var obj = {
                            value: todoValue,
                            state: false
                        };
                        todoValues.push(obj);
                    }
                });
                return todoValues;
            }

            // Function to retrieve all the label inputs
            function getLabelsInputs() {
                const labelsValues = [];
                for (let i = 0; i < labelsInputs.length; i++) {
                    const labelInput = labelsInputs[i];
                    const labelValue = labelInput.textContent.trim();
                    if (labelValue != null) {
                        labelsValues.push(labelValue);
                    }
                }
                return labelsValues;
            }

            // label selecting code
            function insertANewLabel() {
                var selectedLabel = labelSelect.value;

                var labelElement = document.createElement('p');
                labelElement.textContent = '#'+selectedLabel;

                if (!labelsValuesTemp.includes(labelElement.textContent)) {
                    labelsContainer.appendChild(labelElement);
                    labelsInputs.push(labelElement);
                }
            }

            function modifySaveButton(event) {
                if (event.target.value.trim() == '') {
                    saveButton.disabled = true;
                } else {
                    saveButton.disabled = false;
                }
            }

            // Adding event listeners 
            labelSelect.addEventListener('change', insertANewLabel);
            todoToggle.addEventListener('change', function () {
                if (this.checked) {
                    todoSection.style.display = 'block'; // Show the todo container
                } else {
                    todoSection.style.display = 'none'; // Hide the todo container
                }
            });


            todoInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();

                    var todoText = this.value.trim();
                    if (todoText !== '') {
                        var todoItem = document.createElement('div');
                        todoItem.classList.add('todo-item');
                        var todoTextElement = document.createElement('span');
                        todoTextElement.textContent = todoText;
                        var removeButton = document.createElement('button');
                        removeButton.classList.add('btn', 'remove-todo');
                        removeButton.innerHTML = '<i class="fas fa-times"></i>';

                        todoItem.appendChild(removeButton);
                        todoItem.appendChild(todoTextElement);
                        var addedTodos = document.getElementById('added-todos');
                        addedTodos.appendChild(todoItem);
                        this.value = '';
                        this.focus();
                        this.focus();
                    }
                }
            })


            document.addEventListener('click', function (event) {
                if (event.target.classList.contains('remove-todo')) {
                    var todoItem = event.target.closest('.todo-item');
                    todoItem.remove();
                }
            });


            remainderButton.addEventListener('click', function () { })
            authorizationButton.addEventListener('click', AddAuthorizer);
            noteTitle.addEventListener('input', modifySaveButton);

            // attachment related code
            $("#attachment-button").click(function () {
                $("#file-input").click();
            });
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

            $("#file-input").change(function () {
                totalSelectedAttachment++;
                var file = this.files[0];
                lastSelectedFile = file;
                // Check the file type
                if (file.type.startsWith("image/")) {
                    // Upload the image to the database
                    UploadAttachment(noteData, file)
                        .then(function (attachmentId) {
                            totalUploadedAttachment++;
                            // Preview Image file
                            previewImage(file, attachmentId);
                        });
                } else if (file.type === "application/pdf") {
                    // Upload the file to the database
                    UploadAttachment(noteData, file)
                        .then(function (attachmentId) {
                            totalUploadedAttachment++;
                            // Preview Pdf file
                            previewPDF(file, attachmentId);
                        });
                }

                $(this).val("");
            });

            function previewImage(file, attachmentId) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    // Create an image element
                    var img = $("<img>").attr("src", e.target.result);

                    // Create the close button
                    const closeButton = $('<button>', {
                        class: 'close-button',
                        html: '&times;'
                    });
                    // remove attachment from database
                    closeButton.on('click', function () {
                        var attachmentId = $(this).closest('.file-details').data('attachment-id');
                        $.ajax({
                            url: '/Attachments/Delete/' + attachmentId,
                            method: 'DELETE',
                            data: { attachmentId: attachmentId },
                            success: function (response) {
                                totalSelectedAttachment--;
                                totalUploadedAttachment--;
                                closeButton.parent().remove();
                            },
                            error: function (xhr, status, error) {
                                console.log('Error:', error);
                            }
                        });
                    });

                    // Append the image to the file details container
                    var fileDetails = $("<div>")
                        .addClass(["file-details"])
                        .data('attachment-id', attachmentId)
                        .append(img);
                    fileDetails.append(closeButton);
                    $("#file-details-container").append(fileDetails);
                };
                reader.readAsDataURL(file);
            }

            function previewPDF(file, attachmentId) {
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    var typedarray = new Uint8Array(this.result);

                    // Load the PDF using pdf.js
                    pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
                        // Render the first page of the PDF
                        pdf.getPage(1).then(function (page) {
                            var viewport = page.getViewport({ scale: 1 });
                            var canvas = $("<canvas>").get(0);
                            var context = canvas.getContext("2d");

                            canvas.width = viewport.width;
                            canvas.height = viewport.height;

                            // Render the PDF page to the canvas
                            page.render({
                                canvasContext: context,
                                viewport: viewport
                            }).promise.then(function () {
                                // Create the close button
                                const closeButton = $('<button>', {
                                    class: 'close-button',
                                    html: '&times;'
                                });
                                closeButton.on('click', function () {
                                    var attachmentId = $(this).closest('.file-details').data('attachment-id');
                                    $.ajax({
                                        url: 'Attachments/Delete/' + attachmentId,
                                        method: 'DELETE',
                                        data: { attachmentId: attachmentId },
                                        success: function (response) {
                                            totalSelectedAttachment--;
                                            totalUploadedAttachment--;
                                            closeButton.parent().remove();
                                        },
                                        error: function (xhr, status, error) {
                                            console.log('Error:', error);
                                        }
                                    });
                                });
                                // Append the canvas to the file details container
                                var fileDetails = $("<div>")
                                    .addClass("file-details")
                                    .append(canvas);
                                $("#file-details-container")
                                    .append(fileDetails);
                                fileDetails.append(closeButton);
                            });
                        });
                    }).catch(function (error) {
                        console.error("Error occurred while loading PDF:", error);
                    });
                };
                fileReader.readAsArrayBuffer(file);
            }

            // Handle remainder button click
            remainderButton.addEventListener("click", function () {
                if (datePicker.style.display === "none") {
                    datePicker.style.display = "block";
                    // Set default date and time one hour later
                    var currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() + 1);
                    var defaultDateTime = currentDate.toISOString().slice(0, 16);
                    datePicker.value = defaultDateTime;
                    noteData.IsRemainderAdded = true;

                } else {
                    datePicker.style.display = "none";
                    noteData.IsRemainderAdded = false;
                }

            });

            // Handle date and time selection
            datePicker.addEventListener("changeDate", function (event) {
                var selectedDateTime = event.target.value;
                console.log(selectedDateTime);
            });

            // populate already saved data to the modal

            // Saving the note
            $('#update-button').off('click').on('click', function () {
                if (totalSelectedAttachment === totalUploadedAttachment) {
                    noteData.Id = noteData.id;
                    noteData.AddedBy = noteData.authorId;
                    noteData.Todos = JSON.stringify(getTodoInputs());
                    noteData.Title = noteTitle.value;
                    noteData.Description = noteDescription.value;
                    noteData.Labels = JSON.stringify(getLabelsInputs());
                    noteData.Type = null;
                    noteData.IsDraft = false;
                    // remainder
                    if (noteData.IsRemainderAdded) {
                        noteData.RemainderDateTime = datePicker.value;
                    }
                    saveNote(noteData)
                        .then(function (addedNote) {
                            var previousElement = document.getElementById(addedNote.id);
                            previousElement.remove();
                            $('#myModal').modal('hide');
                            showSingleRawCardTop(addedNote);
                            showLinksPerNoteSingle(addedNote);

                            fetchAttachmentAllForANote(addedNote.id)
                                .then(function (attachments) {
                                    if (attachments.length > 0) {
                                        showAttachmentPreviewToEachCardSingle(attachments[0]);
                                    }
                                })
                       
                            var noteTitle = document.getElementById(`title-${addedNote.id}`);
                            noteTitle.addEventListener('click', handleNoteTitleClick);
                        });
                } else {
                    alert('Please wait.. Files uploading');
                }

            });
        })
    
}