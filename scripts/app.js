"use strict"

document.addEventListener('DOMContentLoaded', function () {
 
    document.querySelector(".burger").addEventListener("click", toggleMenu);
    function toggleMenu() {
        document.querySelector(".nav_list").classList.toggle("show");
    }

    document.querySelector(".modal_button").addEventListener("click", toggleModal);
    function toggleModal() {
        document.querySelector(".modal").classList.toggle("show");
    }
    
    const CAPCHA_CHAR_NUMS = 8
    function capchaGenerator(cant) {
        const sourceCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = "";

        for (let i = 0; i < cant; i++) {
            let index = Math.floor(Math.random() * sourceCharacters.length);
            result += sourceCharacters.charAt(index);
        }
        return result;
    }

    function captchaValidation(randomCaptcha) {
        const userInput = document.querySelector(".captcha_input");
        const modalMessage = document.querySelector(".modal_text");
        let modal = document.querySelector('.modal')
        const value = userInput.value;

        if (value == randomCaptcha) {
            modal.classList.add("show");
            modalMessage.innerHTML = "Capcha was successful"
        } else {
            modal.classList.add("show");
            modalMessage.innerHTML = "Capcha was unsuccessful"
        }
    }
    
    document.querySelector(".form").addEventListener("submit", submit);
    const randomCaptcha = capchaGenerator(CAPCHA_CHAR_NUMS);
    document.querySelector(".captcha_label").innerHTML = randomCaptcha;;

    function submit(e) {
        e.preventDefault();
        captchaValidation(randomCaptcha);
    }
});
