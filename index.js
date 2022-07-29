/*
const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express()

const PORT = 8080 || process.env.PORT

app.use(express.static(__dirname + '/public'));

app.get('/books', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
  
app.listen(PORT, () => {
    console.log('listening on 8080')
});
*/
/*
const e = require("express");

window.addEventListener("DOMContentLoaded", function(e){
    const orderButtons = document.querySelectorAll<button>("button");
    
    orderButtons.foreach(function(button){
        button.addEventListener("click", function(e){
            const order = e.currentTarget;
            const container = button.parentNode;

            order = {
                id: button.getAttribute("data-order"),
                title: container.querySelector(".title").innerText,
                price: container.querySelector(".price").innerText,
                desc: container.querySelector(".desc")
            };
            localStorage.setItem("order", JSON.stringify(order));
            const url = window.location.href.replace("books.html", "The Serrated Six (Submission Ver.).pdf");
            window.location.href = url;
            });
        });
});*/

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 3000); // Change image every 3 seconds
}
