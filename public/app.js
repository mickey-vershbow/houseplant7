// mobile menu (nav bar hamburger menu)
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector(".navbar-menu");

burgerIcon.addEventListener("click", () => {
  console.log(burgerIcon);
  navbarMenu.classList.toggle("is-active");
});
