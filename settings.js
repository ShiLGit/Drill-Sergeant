(function(){
    const plusButtons = document.getElementsByClassName('plus')
    console.log(plusButtons)
    //HELPER FUNCTIONS*****************************************************
    function addWrap(num, max, min){
        if(num + 1 > max){
            return min
        }
        return num + 1
    }

    function subWrap(num, max, min){
        console.log(num)
        if(num -1 < min){
            return max
        }
        return num -1
    }

    //DOM STUFF************************************************************
    document.getElementById('confirm').onclick = ()=>{
        window.location.href = '/views/popup.html'
        alert("Settings saved.")
    }
    alert(plusButtons.length)
    for(let i = 0; i < plusButtons.length; i++){
        plusButtons[i].onclick = ()=>{
            const targetID = plusButtons[i].getAttribute('data-label').toString()
            const target = document.getElementById(targetID)
            
            target.innerHTML = addWrap(parseInt(target.innerHTML), parseInt(target.getAttribute('data-max')), parseInt(target.getAttribute('data-min'))  )
        }
    }
    /*
    document.getElementById('Timeout_HMinus').onclick = ()=>{
        timeout_h.innerHTML = subWrap(parseInt(timeout_h.innerHTML),2,0)
    }
    */
})()