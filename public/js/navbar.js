menu = document.getElementById("hamburger-1");
menu.addEventListener("click", () => {
  console.log(menu.classList);
  menu.classList.toggle("active");
  console.log(menu.classList);
});
