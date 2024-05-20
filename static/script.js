function toggleView() {
    const cardContainer = document.getElementById('card-container');
    cardContainer.classList.toggle('grid');
}

function fetchData() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    fetch('/fetch_data')
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            createDietCard(data);
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

function createDietCard(data) {
    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('div');
    card.className = 'card';

    getRandomImage().then(imageSrc => {
        const image = document.createElement('img');
        image.src = imageSrc;
        image.className = 'card-image';
        card.appendChild(image);

        const cardTitle = document.createElement('h2');
        cardTitle.textContent = `Диета №${cardContainer.children.length + 1}`;
        card.appendChild(cardTitle);

        const detailsButton = document.createElement('button');
        detailsButton.className = 'details-button';
        detailsButton.textContent = 'ПОДРОБНЕЕ';
        detailsButton.onclick = () => openModal(data);
        card.appendChild(detailsButton);

        cardContainer.appendChild(card);
    });
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
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
