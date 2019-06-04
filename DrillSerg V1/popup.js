(function()
{
  var timer;

  var timerEle = document.getElementById("timer");
  var min, sec, timeLeft;
  var minStr, secStr;

  //countdown timer for popup interface
  function countDown()
  {
    timeLeft--;
    min = Math.floor(timeLeft/60);
    sec = Math.floor(timeLeft%60);

    if(timeLeft <= 0)
    {
      clearInterval(timer);
      timeLeft = 0;
    }
    formatStrings();
    timerEle.innerHTML = minStr + ":" + secStr;
  }

  function formatStrings()
  {
    if(Math.abs(min) < 10)
    {
      minStr = "0" + min;
    }
    else
    {
      minStr = min;
    }
    if(Math.abs(sec) < 10)
    {
      secStr = "0" + sec;
    }
    else
    {
      secStr = sec;
    }
  }

  chrome.runtime.sendMessage("GIVE ME INFORMATION");

  chrome.runtime.onMessage.addListener(
    function(request)
    {
      timeLeft = request.duration - 1; // -1 because timer tends to lag behind background.js
      if(request.duration == 60*45)//MUST BE MODIFIED ONCE PERSONAL SETTINGS IMPLEMENTED
      {
        timeLeft = request.duration;
      }

      min = Math.floor(timeLeft/60);
      sec = Math.floor(timeLeft%60);
      formatStrings();

    //change timer text
    if(request.countingdown == true)
    {
        timerEle.style.position = "relative";
        timerEle.style.left = "40px";
        timerEle.style.bottom = "10px";
        timer = setInterval(countDown, 1000);
    }
    else //change info text
    {

      if(timeLeft == 60*45)//MODIFIED WHEN PSETTINGS IMPLEMENTED
      {
        document.getElementById("info-reset").innerHTML = "Timer has been reset";
      }
      else
      {
        document.getElementById("info-reset").innerHTML = "Timer resets in  ~" + Math.floor(request.refresh/3600)+"h, " + Math.floor(request.refresh/60)%60 + "min";
      }

      document.getElementById("info-recharge").innerHTML = "Time recharged: ~" + min + " min";
    }
  }
);

})();
