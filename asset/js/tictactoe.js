let case1 = document.querySelector(".case1");
const datacase = case1.dataset.case;
const case2 = document.querySelector(".case2");
const case3 = document.querySelector(".case3");
const case4 = document.querySelector(".case4");
const case5 = document.querySelector(".case5");
const case6 = document.querySelector(".case6");
const case7 = document.querySelector(".case7");
const case8 = document.querySelector(".case8");
let case9 = document.querySelector(".case9");

function addImg(caseSelect, img) {
  const caseNumber = parseInt(caseSelect, 10);
  switch (caseNumber) {
    case 0:
      console.log(img);
      case1.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="cercle" />`;
      console.log(case1);
      break;
    default:
      console.log("erreur");
  }
}

case1.addEventListener("click", () => {
  console.log(case1);
  console.log(datacase);

  addImg(case1.dataset.case, "crois.png"); // ou selon ton besoin
});
