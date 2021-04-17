

//////////////////////////
// Define our Variables
//////////////////////////

// hamburger menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector(".navbar-menu");
//Carousel
let image = 1;
const $img = $("#carousel-images");
const $back = $("#back");
const $forward = $("#forward");


// Event listener for hamburger menu
burgerIcon.addEventListener("click", () => {
  console.log(burgerIcon);
  navbarMenu.classList.toggle("is-active");
});

// Carousel Images Array

const images = [
  "https://bs.plantnet.org/image/o/019173a51a75465d4d29eb15c627cc262da57865",
  "https://bs.plantnet.org/image/o/e386787ccfc1992cdd20c0c3b5cdfb60a7155b1e",
  "https://d2seqvvyy3b8p2.cloudfront.net/a6c77e9053e16faac8a98aebb4b12a68.jpg",
  "https://bs.plantnet.org/image/o/b9e1596b4b7c6b479ec3c9398c641bc50f4d5880",
  "https://d2seqvvyy3b8p2.cloudfront.net/79b5638ac34f5dc4f16fa67a35ec296a.jpg",
  "https://d2seqvvyy3b8p2.cloudfront.net/0bf43348fbf75f7b12ede84b1913c8a9.jpg",
  "https://storage.googleapis.com/powop-assets/neotropikey/homalium_guianense2_dsasaki_fullsize.jpg",
  "https://bs.plantnet.org/image/o/461f389919d8846b4060d896e404d4c06674aaf4",
];

// Handler for forward button

const forwardClick = (event) => {
  console.log("logo");
  if (image === images.length) {
    image = 0;
    $img.attr("src", images[image]);
  } else {
    $img.attr("src", images[image]);
    image++;
  }
};

const backClick = (event) => {
  console.log("image");
  if (image === images.length) {
    image = 8;
    $img.attr("src", images[image]);
  } else {
    $img.attr("src", images[image]);
    image--;
  }
};


// Event Listeners for forward/back buttons

$forward.on("click", forwardClick);
$back.on("click", backClick);


/////////////
