const paginators = document.querySelectorAll("li a[href='#visit-heading']");

let limit = 5;
let page = 1;
let maxPage = 1;
let total;
let magicTowns;

document.addEventListener("DOMContentLoaded", async () => {
  await getTotalPages();

  //Initialize the map once you have all the records
  window.initMap = initMap(magicTowns);
  //Get the shortest magic town
  getUserPosition();

  paginators[0].style.display = "none";

  paginators.forEach((paginator) => {
    paginator.addEventListener("click", async () => {
      page = paginator.dataset.page;
      updatePaginator(page);

      const magicTowns = await getMagicTowns();
      fillGrid(magicTowns);
    });
  });

  //Remove the map's popup
  setTimeout(() => {
    document.querySelector("#map").children[1].remove();
    document.querySelector("#map").children[1].remove();
  }, 1000);
});

//Functions

function fillGrid(magicTowns) {
  clearHTML();
  const grid = document.querySelector(".items .row");

  magicTowns.forEach((magicTown) => {
    const div = document.createElement("div");

    div.classList.add("col-lg-12");

    div.innerHTML += `
    <div class="col-lg-12">
      <div class="item">
        <div class="row">
          <div class="col-lg-4 col-sm-5">
            <div class="image" style='height: 100%'>
              <img src='${magicTown.images[0]}' alt='${
      magicTown.magicTown
    }' style='height: 100%; object-fit: cover;'>
            </div>
          </div>
          <div class="col-lg-8 col-sm-7">
            <div class="right-content">
              <h4>${magicTown.magicTown.split(",")[0]}</h4>
              <span>${magicTown.state}, México</span>
              <div class="main-button">
                <a href="${magicTown.wiki}" target="_blank" rel="noreferrer">Conocer más</a>
              </div>
              <p>${magicTown.description}</p>
              <ul class="info">
                <li><i class="fa fa-user"></i> ${
                  magicTown.population
                } habitantes</li>
                <li><i class="fa fa-globe"></i> La: ${magicTown.latitude}</li>
                <li><i class="fa fa-globe"></i> Lo: ${magicTown.longitude}</li>
              </ul>
              <div class="text-button">
                <a href="about.html">¿Sabes cómo llegar?<i class="fa fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    grid.appendChild(div);
  });
}

function updatePaginator(currentPage) {
  if (currentPage == 1) {
    paginators[0].style.display = "none";
  } else if (currentPage == maxPage - 1) {
    paginators[3].style.display = "none";
    paginators[2].style.display = "inline-block";
    paginators[4].style.display = "inline-block";
  } else if (currentPage == maxPage) {
    paginators[2].style.display = "none";
    paginators[3].style.display = "none";
    paginators[4].style.display = "none";
  } else {
    paginators[0].style.display = "inline-block";
    paginators[2].style.display = "inline-block";
    paginators[3].style.display = "inline-block";
    paginators[4].style.display = "inline-block";
  }

  paginators[0].dataset.page = +currentPage - 1;
  paginators[1].dataset.page = +currentPage;
  paginators[1].textContent = +currentPage;
  paginators[2].dataset.page = +currentPage + 1;
  paginators[2].textContent = +currentPage + 1;
  paginators[3].dataset.page = +currentPage + 2;
  paginators[3].textContent = +currentPage + 2;
  paginators[4].dataset.page = +currentPage + 1;
}

function clearHTML() {
  const grid = document.querySelector(".items .row");
  while (grid.firstChild) {
    grid.firstChild.remove();
  }
}

//Requests
async function getAllMagicTowns() {
  const res = await fetch(`${window.location.origin}/v1/magicTowns`);
  return await res.json();
}

async function getMagicTowns() {
  const res = await fetch(
    `${window.location.origin}/v1/magicTowns?limit=${limit}&page=${page}`
  );
  return await res.json();
}

async function getTotalPages() {
  magicTowns = await getAllMagicTowns();
  maxPage = Math.ceil(magicTowns.length / limit);
}

//Map
function initMap(magicTowns) {
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: {
      lat: 23.6345,
      lng: -102.5528,
    },
  });

  magicTowns.forEach((magicTown) => {
    new google.maps.Marker({
      position: {
        lat: magicTown.latitude,
        lng: magicTown.longitude,
      },
      map: map,
    });
  });
}

//Check if browser supports geolocation
function getUserPosition() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(getShortestMagicTown, showError);
  } else {
    console.log("Errorr");
  }
}

//Set's user's position
function getShortestMagicTown(position) {
  const coords = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  let shortestDistance = 99999999999;
  let largestDistance = 0;
  let shortestMagicTown;
  let largestMagicTown;

  magicTowns.forEach((magicTown) => {
    const distance = Math.sqrt(
      Math.pow(coords.lat - magicTown.latitude, 2) +
        Math.pow(coords.lng - magicTown.longitude, 2)
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      shortestMagicTown = magicTown;
    }
    if (distance > largestDistance) {
      largestDistance = distance;
      largestMagicTown = magicTown;
    }
  });

  showMagicTown(shortestMagicTown, largestMagicTown);
}

//Show error where there is a problem with geolocation service
function showError(error) {
  console.error(error);
}

function showMagicTown(shortest, largest) {
  const shortestTown = shortest.magicTown;
  const largestTown = largest.magicTown;

  const divContainer = document.querySelector(".side-bar-map .row .col-lg-12");

  const newDiv = document.createElement("div");
  
  newDiv.innerHTML = 
  `
  <br>
  <p>El pueblo mágico más cercano a ti es: <span class='d-block fw-bold'> - ${shortestTown}</span></p>
  <br>
  <p>El pueblo mágico más lejano a ti es: <span class='d-block fw-bold'> - ${largestTown}</span></p>
  `;

  divContainer.appendChild(newDiv);
}
