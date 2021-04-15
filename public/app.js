//////////////////////////
// Define our Variables
//////////////////////////

// hamburger menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector(".navbar-menu");
//Carousel
let image = 1;
const $img = $('img');
const $back = $("#back");
const $forward = $("#forward");

// Event listener for hamburger menu
burgerIcon.addEventListener("click", () => {
  console.log(burgerIcon);
  navbarMenu.classList.toggle("is-active");
});

// Carousel Images Array
const images = [
  "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/hc-5-1589572155.jpg",
  "http://www.apieceofrainbow.com/wp-content/uploads/2018/01/best-indoor-plants-flowering-house-plants-easy-low-light-houseplants-apieceofrainbow-1.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq7z_sz9amPW-sZsNZe1b2d4OHdxM3j7RtFg&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrhqkvTRHrGsRROzcM9vc4BTgdtuVDrxtFXw&usqp=CAU",
  "https://static.onecms.io/wp-content/uploads/sites/39/2020/12/08/MWL-Table-Top-Garden-20208833.jpg"
]


// Handler for forward button

const forwardClick = (event => {
  console.log('logo')
  if (image === images.length) {
    image = 0;
    $img.attr("src", images[image]);
  } else {
    $img.attr("src", images[image]);
    image++;
  }
});

const backClick = (event) => {
  console.log("image");
  if (image === images.length) {
    image = 5;
    $img.attr("src", images[image]);
  } else {
    $img.attr("src", images[image]);
    image--;
  }
};

// Event Listeners for forward/back buttons

$forward.on("click", forwardClick);
$back.on("click", backClick)
