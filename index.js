document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('fetch-button').addEventListener('click', fetchDataCats);
	document.getElementById('fetch-user-button').addEventListener('click', fetchRandomUser);

	async function fetchDataCats() {
		renderLoadingCats();
		try {
			const response = await fetch('https://catfact.ninja/fact'); // Deliberadamente incorrecto para probar el manejo de errores
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			renderDataCats(data);
		} catch (error) {
			renderErrorCats();
		}
	}

	async function fetchRandomUser() {
		renderLoadingState('data-user-container');
		try {
			const response = await fetch('https://randomuser.me/api/');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			renderUserData(data.results[0]);
		} catch (error) {
			renderErrorState('data-user-container'); // Cambia a la ID del contenedor del usuario
		}
	}

	function renderLoadingCats() {
		const container = document.getElementById('data-container');
		container.innerHTML = '';
		container.innerHTML = '<p class="loading">Loading...</p>';
		console.log('Loading...');
	}

	function renderLoadingState() {
		const container = document.getElementById('data-user-container');
		container.innerHTML = '<p class="loading">Loading...</p>';
		console.log('Loading...');
	}

	function renderErrorCats() {
		const container = document.getElementById('data-container');
		container.innerHTML = '';
		container.innerHTML = '<p class="error">Ups, error...</p>';
		console.log('Failed to load data');
	}

	function renderErrorState() {
		const container = document.getElementById('data-user-container');
		container.innerHTML = '<p>Ups, Error</p>';
	}

	function renderDataCats(data) {
		const container = document.getElementById('data-container');
		if (container) {
			container.innerHTML = '';
			const div = document.createElement('div');
			div.className = 'item';
			div.innerHTML = `
            <h2>Random Facts about Cats</h2>
            <p>Fact: ${data.fact}</p>
        `;
			container.appendChild(div);
		} else {
			console.error('Elemento "data-container" no encontrado');
		}
	}
});

function renderUserData(user) {
	const container = document.getElementById('data-user-container');
	container.innerHTML = `
			<div class="item">
					<img src="${user.picture.large}" alt="User Picture" />
					<div>
							<h2>${user.name.first} ${user.name.last}</h2>
							<p>Email: ${user.email}</p>
							<p>Teléfono: ${user.phone}</p>
							<p>Ubicación: ${user.location.city}, ${user.location.country}</p>
					</div>
			</div>
	`;
}

const form = document.getElementById('anime-form');
const buttonClear = document.getElementById('clear-results');
const containerResults = document.getElementById('results');
const spinner = document.getElementById('spinner');

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	showSpinner();
	const formData = new FormData(form);
	const type = formData.get('type');
	const query = formData.get('query');
	const limit = formData.get('limit') ? Number(formData.get('limit')) : undefined;
	if (!query && !type && (limit === undefined || limit <= 0)) {
		alert('Por favor llena un campo');
		hideSpinner();
		return;
	}
	const url = getUrlSearch(type, query, limit);

	const data = await getData(url);
	addContent(data);
	hideSpinner();
});

function getUrlSearch(type, query, limit) {
	const queryParams = [];
	if (query) queryParams.push(`q=${encodeURIComponent(query)}`);
	if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
	if (limit !== undefined && limit > 0) queryParams.push(`limit=${encodeURIComponent(limit)}`);
	const baseUrl = 'https://api.jikan.moe/v4/anime';
	const url = queryParams.length ? `${baseUrl}?${queryParams.join('&')}` : baseUrl;
	return url;
}

async function getData(url) {
	renderLoadingAnime();
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		renderErrorAnime();
		hideSpinner();
	}
}

function addContent(data) {
	containerResults.innerHTML = '';
	if (data && data.data && data.data.length > 0) {
		data.data.forEach((item) => {
			const title = item.title || 'No se encuentra el título';
			const type = item.type || 'No se encuentra el tipo';
			const img = item.images.jpg.image_url || 'No se encuentra la imagen';
			console.log(item.images);
			const itemElement = document.createElement('div');
			itemElement.innerHTML = `
          <p>${title}</p>
          <p>${type}</p>
          <img src = "${img}">
        `;
			containerResults.appendChild(itemElement);
		});
	} else {
		const noData = document.createElement('p');
		noData.textContent = 'No se encontraron datos';
		containerResults.appendChild(noData);
	}
}

function renderLoadingAnime() {
	const container = document.getElementById('results');
	container.innerHTML = '<p class="loading">Loading...</p>';
	console.log('Loading...');
}

function renderErrorAnime() {
	const container = document.getElementById('results');
	container.innerHTML = '';
	container.innerHTML = '<p class="error">Ups, error...</p>';
	console.log('Failed to load data');
}

buttonClear.addEventListener('click', (event) => {
	event.preventDefault();
	clearResults();
});

function clearResults() {
	containerResults.innerHTML = '';
}

function showSpinner() {
	spinner.style.display = 'block';
}

function hideSpinner() {
	spinner.style.display = 'none';
}
