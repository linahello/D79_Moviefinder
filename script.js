const movies = document.getElementById('movies')
const searchField = document.getElementById('search-field')
const modalCard = document.getElementById('modal-card')
let searchKey;

const getResults = () => {
  const url = `https://www.omdbapi.com/?apikey=96e12e05&` +
            `s=${searchKey}`
  const req = new Request(url);
  fetch(req)
  .then((response) => {
    response.json().then((data) => {
      data.Search.forEach(movie => {
        addMovie(movie.Poster, movie.Title, movie.Year, movie.imdbID)
      });
      let buttons = document.getElementsByClassName('button-85')
      for (let button of buttons) {
        button.addEventListener('click', displayModal)
      }
      let cards = document.querySelectorAll(".card")
      cards.forEach(card => {
        card.classList.add('hidden')
        observer.observe(card)
      })
    })
  })
  .catch((error) => console.log(error.message))
}

let observer = new IntersectionObserver((observables) => {
  observables.forEach ((observable) => {
    console.log(observable)
    if (observable.intersectionRatio > 0.5 ) {
      observable.target.classList.remove('hidden')
    } else {
      observable.target.classList.add('hidden')
    }
})
}, {
  threshold: [0.5]
})

const displayModal = (e) => {
  let id = e.target.id
  const url = `https://www.omdbapi.com/?apikey=96e12e05&` +
            `i=${id}&` +
            `Plot=full`
  const req = new Request(url);
  fetch(req)
  .then((response) => {
    response.json().then((data) => {
      addModal(data.Title, data.Released, data.Poster, data.Plot, data.Writer, data.Actors)
    });
  })
}

const addMovie = (image, name, date, id) => {
  movies.innerHTML += `
  <div class="card" id="card${id}">
    <div class="img-card">
      <img src="${image}">
    </div>
    <div class = "content-card">
      <h2>${name}</h2>
      <p>${date}</p>
      <button id="${id}" class="button-85">Read more</button>
    </div>
  </div>
  `;
}

const addModal = (title, date, img, description, author, casting) => {
  modalCard.innerHTML = `
      <div class="modal-card">
        <div class="img-modal-card">
          <img src="${img}">
        </div>
        <div class = "content-card">
          <h2>${title}</h2>
          <p><b>Sortie: </b>${date}</p>
          <p><b>Réalisateur: </b>${author}</p>
          <p><b>Acteurs: </b>${casting}</p>
          <p><b>Synopsis: </b>${description}</p>
          <button id="close-button">X</button>
        </div>
      </div>
  `
  modalCard.style.display = "block"
  document.getElementById('close-button').addEventListener('click', hideModal)
}

const hideModal = () => {
    modalCard.style.display = "none";
  }

const findMovies = (e) => {
  e.preventDefault()
  movies.innerHTML = ''
  searchKey = e.target[0].value.split(' ').join('_')
  getResults();
}

searchField.addEventListener('submit', findMovies)
