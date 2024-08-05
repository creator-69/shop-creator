let prevScrollpos = window.Headers;
window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector("header").style.top = "0";
  } else {
    document.querySelector("header").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
}


document.getElementById("myImage").onclick = function() {
    document.getElementById("myDiv").scrollIntoView({ behavior: 'smooth' });
};



let slideIndex = 0;
showSlides(slideIndex);

function showSlides(n) {
    const slides = document.getElementsByClassName("slides");
    slideIndex += n;

    if (slideIndex >= slides.length) { slideIndex = 0; }
    if (slideIndex < 0) { slideIndex = slides.length - 1; }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    slides[slideIndex].classList.add("active");
}

// تغییر عکس‌ها به صورت خودکار
setInterval(() => {
    showSlides(1);
}, 3000); // تغییر عکس هر 3 ثانیه



function viewProduct() {
    window.location.href = 'https://iranfso.com';
}
function viewProduc() {
    window.location.href = 'product2.html';
}
function viewProdu() {
    window.location.href = 'product3.html';
}
function viewProd() {
    window.location.href = 'product4.html';
}
function viewProdz() {
    window.location.href = 'product4.html';
}
function viewProdzx() {
    window.location.href = 'product4.html';
}
function viewProdzxc() {
    window.location.href = 'product4.html';
}
function viewProdzxcv() {
    window.location.href = 'product4.html';
}
function viewProdzxcvb() {
    window.location.href = 'product4.html';
}
function viewProda() {
    window.location.href = 'product4.html';
}

let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const slider = document.querySelector('.slider');
    const totalSlides = slides.length;
    const maxIndex = Math.floor((totalSlides - 1) / 2) * 2; // Calculate the maximum index for two-slide increments

    if (index > maxIndex) {
        currentIndex = maxIndex;
    } else if (index < 0) {
        currentIndex = 0;
    } else {
        currentIndex = index;
    }

    slider.style.transform = `translateX(-${currentIndex * 12 / 2}%)`;
}

function nextSlide() {
    showSlide(currentIndex + 2);
}

function prevSlide() {
    showSlide(currentIndex - 2);
}

// Add event listeners for buttons
document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);
