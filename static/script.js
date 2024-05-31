function updateButtonContent() {
    const cardContainer = document.getElementById('card-container');
    const isGrid = cardContainer.classList.contains('grid');
    const detailsButtons = document.querySelectorAll('.details-button');
    const deleteButtons = document.querySelectorAll('.delete-button');
    const editButtons = document.querySelectorAll('.edit-button');

    detailsButtons.forEach(button => {
        button.innerHTML = isGrid ? '<img src="' + staticPath + 'icons/details.svg" alt="Подробнее" class="button-icon">' : 'ПОДРОБНЕЕ';
    });

    deleteButtons.forEach(button => {
        button.innerHTML = isGrid ? '<img src="' + staticPath + 'icons/trash.svg" alt="Удалить" class="button-icon">' : 'УДАЛИТЬ';
    });

    editButtons.forEach(button => {
        button.innerHTML = isGrid ? '<img src="' + staticPath + 'icons/edit.svg" alt="Изменить" class="button-icon">' : 'ИЗМЕНИТЬ';
    });
}

// Изменяем содержимое кнопок при переключении режима отображения
function toggleView() {
    const cardContainer = document.getElementById('card-container');
    cardContainer.classList.toggle('grid');
    updateButtonContent(); // Обновляем содержимое кнопок
}

function fetchData() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    fetch('/fetch_data')
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            createDietCard(data, true); // Передаем true, чтобы добавить новую карточку в базу данных
        })
        .catch(error => {
            loading.style.display = 'none';
            console.error('Ошибка:', error);
        });
}

function getRandomImage() {
    return fetch('/get_images')
        .then(response => response.json())
        .then(images => {
            const randomIndex = Math.floor(Math.random() * images.length);
            return staticPath + 'media/' + images[randomIndex];
        })
        .catch(error => {
            console.error('Ошибка:', error);
            return staticPath + 'media/default.jpg'; // Возвращаем изображение по умолчанию в случае ошибки
        });
}

function deleteDietCard(card) {
    const dietId = card.dataset.dietId;

    fetch(`/delete_diet/${dietId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            card.remove();
        } else {
            console.error('Ошибка при удалении карточки:', result.message);
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function saveChanges() {
    const editTitleInput = document.getElementById('edit-title-input');
    const newTitle = editTitleInput.value;
    const saveButton = document.getElementById('save-button');
    const cardId = saveButton.dataset.cardId;
    const cardElement = document.querySelector(`[data-diet-id="${cardId}"]`); // Получаем элемент карточки из DOM

    fetch(`/update_diet/${cardId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Обновляем название на карточке
            cardElement.querySelector('h2').textContent = newTitle;
            closeEditModal();
        } else {
            console.error('Ошибка при обновлении карточки:', result.message);
        }
    })
    .catch(error => console.error('Ошибка:', error));
}

function createDietCard(data, addToDatabase = false, id = null, title = null) {
    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('div');
    card.className = 'card';

    getRandomImage().then(imageSrc => {
        const image = document.createElement('img');
        image.src = imageSrc;
        image.className = 'card-image';
        card.appendChild(image);

        const cardTitle = document.createElement('h2');
        if (addToDatabase) {
            cardTitle.textContent = `Диета №${cardContainer.children.length + 1}`;
        } else {
            cardTitle.textContent = title; // Используем название из базы данных
        }
        card.appendChild(cardTitle);

        const detailsButton = document.createElement('button');
        detailsButton.className = 'details-button';
        detailsButton.textContent = 'ПОДРОБНЕЕ';
        detailsButton.onclick = () => openModal(data);
        card.appendChild(detailsButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'УДАЛИТЬ';
        deleteButton.onclick = () => deleteDietCard(card);
        card.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = 'ИЗМЕНИТЬ';
        editButton.onclick = () => openEditModal(card);
        card.appendChild(editButton);


        cardContainer.appendChild(card);

        if (addToDatabase) {
            fetch('/add_diet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: cardTitle.textContent,
                    content: data
                })
            }).then(response => response.json())
              .then(result => {
                  console.log(result);
                  card.dataset.dietId = result.id;
              })
              .catch(error => console.error('Ошибка:', error));
        } else {
            card.dataset.dietId = id; // Устанавливаем id карточки
        }
    });
}

function loadDietCards() {
    fetch('/get_diets')
        .then(response => response.json())
        .then(diets => {
            diets.forEach(diet => {
                createDietCard(diet.content, false, diet.id, diet.title); // Передаем id и title из базы данных
            });
            updateButtonContent(); // Перемещаем вызов сюда
        })
        .catch(error => console.error('Ошибка:', error));
}

function openEditModal(card) {
    const modal = document.getElementById('edit-modal');
    const editTitleInput = document.getElementById('edit-title-input');
    const saveButton = document.getElementById('save-button');

    // Устанавливаем текущее название диеты в поле ввода
    editTitleInput.value = card.querySelector('h2').textContent;

    // Сохраняем текущую карточку в атрибуте data
    saveButton.dataset.cardId = card.dataset.dietId;

    modal.style.display = 'block';
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
}

function openModal(data) {
    const modal = document.getElementById('modal');
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = ''; // Очистка контейнера перед добавлением новых данных

    for (const [day, items] of Object.entries(data)) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        const dayTitle = document.createElement('h2');
        dayTitle.textContent = day;
        dayDiv.appendChild(dayTitle);

        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item';
            li.textContent = item;
            ul.appendChild(li);
        });
        dayDiv.appendChild(ul);
        dataContainer.appendChild(dayDiv);
    }

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    loadDietCards(); // Загрузка карточек из базы данных при загрузке страницы
    // Переместите вызов updateButtonContent после загрузки карточек
    setTimeout(updateButtonContent, 0); // Инициализация содержимого кнопок при загрузке страницы
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
});


