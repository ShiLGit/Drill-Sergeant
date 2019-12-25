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

chrome.runtime.sendMessage({type: "NEED TIME"});

chrome.runtime.onMessage.addListener(
    function(msg)
    {
      //display time
      if(msg.type == "time")
      {
        timeLeft = msg.duration - 1; // -1 because timer tends to lag behind background.js
        if(msg.duration == 60*45)//MUST BE MODIFIED ONCE PERSONAL SETTINGS IMPLEMENTED
        {
          timeLeft = msg.duration;
        }

        min = Math.floor(timeLeft/60);
        sec = Math.floor(timeLeft%60);
        formatStrings();

      //change timer text
      if(msg.countingdown == true)
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
          document.getElementById("info-reset").innerHTML = "Timer resets in  ~" + Math.floor(msg.refresh/3600)+"h, " + Math.floor(msg.refresh/60)%60 + "min";
        }

        if(min < 0)
        {
          min = 0;
        }
        document.getElementById("info-recharge").innerHTML = "Time recharged: ~" + min + " min";
      }
  }
  //display watchlists
  else if (msg.type = "watchlist")
  {
    document.getElementById("input1").value = msg.wl[0];
    document.getElementById("input2").value = msg.wl[1];
    document.getElementById("input3").value = msg.wl[2];
    document.getElementById("input4").value = msg.wl[3];
    document.getElementById("input5").value = msg.wl[4];
  }
}
);

//make settings screen visible
document.getElementById("settings").onclick = function()
{
  window.location.href="/views/settings.html";

  document.getElementById("all").style.height = "500px";
  document.getElementById("config").style.display = "block";
  document.getElementsByClassName("bodytext")[0].style.bottom = "280px";

  chrome.runtime.sendMessage({type: "NEED WATCHLIST"});
}

//get caumnnhhtsh
document.getElementById("confirm").onclick = function()
{
  document.getElementById("config").style.display = "none";
  document.getElementById("all").style.height = "300px";
  document.getElementsByClassName("bodytext")[0].style.bottom = "80px";

  let newList = new Array();
  newList[0] = document.getElementById("input1").value;
  newList[1] = document.getElementById("input2").value;
  newList[2] = document.getElementById("input3").value;
  newList[3] = document.getElementById("input4").value;
  newList[4] = document.getElementById("input5").value;

  let obj = {
              type: "new-watchlist",
              wl: newList
            }
  chrome.runtime.sendMessage(obj);
}

})();
