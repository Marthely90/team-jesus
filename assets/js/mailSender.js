emailjs.init('user_IbW5twrfSlgvKyeqd8dIv')
$('.carousel').carousel({ interval: 10000 })

function sendMail(){
    const form = document.getElementById('form'),
    btnDiv = '<button type="submit" class="btn btn-success" id="button" >Envoyer</button>',
    btn = document.getElementById('btnDiv'),
    input_name = document.getElementById('name'),
    input_email = document.getElementById('email'),
    input_phone = document.getElementById('phone'),
    input_message = document.getElementById('message')
    // const btnDiv = document.getElementById('btnDiv')
    // .addEventListener('submit', function(event) {
        // event.preventDefault();
        
        btn.innerHTML = '<img src="./assets/img/Ellipsis.gif" height="150em"/>';
        
        const serviceID = 'default_service';
        const templateID = 'template_tzlryqu';
        
        emailjs.sendForm(serviceID, templateID, form)
        .then(() => {
            btn.innerHTML = btnDiv;
            input_name.value = input_email.value = input_phone.value = input_message.value = '';
        }, (err) => {
            btn.innerHTML = btnDiv;
            alert(JSON.stringify(err));
        })
    // })
}