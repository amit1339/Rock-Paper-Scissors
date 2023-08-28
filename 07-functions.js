 function subscribed() {
    if (document.querySelector('.subButtom').innerHTML === 'Subscribed') {
        document.querySelector('.subButtom').innerHTML = 'Subscribe'
    }
    else{
        document.querySelector('.subButtom').innerHTML = 'Subscribed';
    }
 }