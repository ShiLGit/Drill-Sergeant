(function(){
    const plusButtons = document.getElementsByClassName('plus')
    const minusButtons = document.getElementsByClassName('minus')
    const Censor_H = document.getElementById('Censor_H')
    const Censor_M = document.getElementById('Censor_M')
    const Timeout_H = document.getElementById('Timeout_H')
    const Timeout_M = document.getElementById('Timeout_M')
    const Recharge = document.getElementById('lblRechargeValue')
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
    function parseTime(seconds){
        return {hours: Math.floor(seconds/3600), minutes: (seconds % 3600)/60}
    }
    function parseSeconds(hours, min){
        return hours *3600 + min * 60
    }
    //LOAD CURRENT SETTINGS ONTO UI 
    chrome.runtime.onMessage.addListener(
        msg=>{
            if(msg.type = 'settings'){
                const watchlist = document.getElementsByTagName('input')
                const settings = msg.settings 

                //load watchlist 
                for(let i = 0; i < 5; i++){
                    watchlist[i].value = settings.wl[i]
                }

                //load timeout 
                const timeout = parseTime(settings.timeOut)
                Timeout_H.innerHTML = timeout.hours
                Timeout_M.innerHTML = timeout.minutes

                //load censor 
                const censor = parseTime(settings.censorMax)
                Censor_H.innerHTML = censor.hours 
                Censor_M.innerHTML = censor.minutes
                
                //load recharge rate 
                Recharge.innerHTML = settings.refreshModifier / 10;
            }
        }
    )
    chrome.runtime.sendMessage({type: 'NEED SETTINGS'})
    
    //SAVE CURRENT SETTINGS 
    function saveSettings(){
        const watchListEle = document.getElementsByTagName('input')
        const watchList = []
        for(let i = 0; i < watchListEle.length; i++){
            watchList.push(watchListEle[i].value)
        }
        
        const timeOut = parseSeconds(parseInt(Timeout_H.innerHTML), parseInt(Timeout_M.innerHTML))
        const censorMax = parseSeconds(parseInt(Censor_H.innerHTML), parseInt(Censor_M.innerHTML)) 
        const refreshModifier = parseInt(Recharge.innerHTML) * 10

        const settings = {
            wl: watchList,
            timeOut,
            censorMax,
            refreshModifier
        }
        chrome.runtime.sendMessage({type: 'SETTINGS', settings})
    }


    //DOM STUFF************************************************************
    document.getElementById('confirm').onclick = ()=>{
        window.location.href = '/views/popup.html'
        saveSettings()
        alert("Settings saved.")
    }
    for(let i = 0; i < plusButtons.length; i++){
        plusButtons[i].onclick = ()=>{
            const targetID = plusButtons[i].getAttribute('data-label').toString()
            const target = document.getElementById(targetID)
            
            target.innerHTML = addWrap(parseInt(target.innerHTML), parseInt(target.getAttribute('data-max')), parseInt(target.getAttribute('data-min'))  )
        }
    }
    for(let i = 0; i < minusButtons.length; i++){
        minusButtons[i].onclick = ()=>{
            const targetID  = minusButtons[i].getAttribute('data-label').toString()
            const target = document.getElementById(targetID)

            target.innerHTML = subWrap(parseInt(target.innerHTML), parseInt(target.getAttribute('data-max')), parseInt(target.getAttribute('data-min')))
        }
    }
    /*
    document.getElementById('Timeout_HMinus').onclick = ()=>{
        timeout_h.innerHTML = subWrap(parseInt(timeout_h.innerHTML),2,0)
    }
    */
})()