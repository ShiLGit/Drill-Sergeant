
(function() //IIFE
{

//URL watchlist
var watchList = new Array();
watchList[0] = "www.youtube.com";
watchList[1] = "www.facebook.com";
watchList[2] = "";
watchList[3] = "";
watchList[4] = "";
var numWatch = 4;

//time tracking
var closeTime = -1; //last time you were on a WL: FOR REFRESH TRACkING
var lastCheck = -1; // last time you checked time left: FOR RECHARGE TRACKING
var newTime;
var newStop = false;

//timer setup
var timer;
var timerOn = false;
var timeOut = 60*45; //DUMMY VARIABLE - SET ALL TIMECOUNT.DURATION TO THIS WHEN MODIFIERS ARE ADDED
var timeCount =
{
  type: "time",
  duration: timeOut,
  refresh: 3600*4,
  countingdown: true
}
var refreshModifier = 10;

function countDown()
{
    timeCount.duration--;
    if(timeCount.duration == 0)
    {
      censorTabs();
    }
}

//censor set up
var censorAll = false; // use in tabUpdated (checkTab: if WL == true then block instead of starting timer) for when user tries to bypass punishment by navigating to WL site from different tab
var censorMax = 10 * 60;
var censorTimerActive = false;
var censorTime = censorMax;
var censorTimer;
var warningNotif =
{
  type: "basic",
  title: "WARNING",
  message: "YOU BETTER WATCH YOURSELF, SON",
  iconUrl: "images/notifHead.png"
}


//check page for watchlist site upone tab update; start timers
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
      checkTabs();
});

chrome.runtime.onMessage.addListener(function(msg)
{
  if(msg.type == "NEED TIME")
  {
    if(timerOn == false)
    {
      timeCount.countingdown = false;
    }
    else
    {
      timeCount.countingdown = true;
    }
    calcTimer();
    chrome.runtime.sendMessage(timeCount);
  }
  else if(msg.type == "NEED WATCHLIST")
  {
    let wl = {
      type: "watchlist",
      wl: watchList
    }
    chrome.runtime.sendMessage(wl);
  }
  else if(msg.type == "new-watchlist")
  {
    for(let i = 0; i < numWatch; i++)
    {
      watchList[i] = msg.wl[i];
    }
  }
});

//check if watchlist site is still open on tab close>>decide whether or not to pause timer
chrome.tabs.onRemoved.addListener(checkTabs);

//check all tabs for watchlist site; start timer if watchlist site is open, sets flag for timer recharge if necessary
function checkTabs() {
  let stop = true;
  chrome.windows.getAll({populate:true},function(windows)
  {
    windows.forEach(function(window)//not async
    {
      window.tabs.forEach(function(tab)
      {
        for(let i = 0; i < numWatch; i++)
        {
          //watchlist site is still open; proceed counting down
          if(tab.url.indexOf(watchList[i]) != -1 && watchList[i] != "")
          {
            if(censorAll == true)
            {
              censorTabs();
              continue;
            }
            calcTimer();
            stop = false;

            if(timerOn == false)//avoid calling >1 timer at once
            {
              timer = setInterval(countDown, 1000);
              timerOn = true;
              chrome.notifications.create(warningNotif);
            }
            newStop = true;
            return;
          }
        }
      });
    });
    //all watchlist sites across all tabs + windows are closed; STOP THA TIMER!
    //put inside windows.getAll because it's async; windows.foreach is not async so it should always execute after
    if(stop == true)
    {
      clearInterval(timer);
      timerOn = false;

      if(newStop == true)//set closeTime; avoids setting closeTime every time a tab gets updated (rather than when naviagating away from WL)
      {
        closeTime = new Date()/1000;
        lastCheck = closeTime;
        newStop = false; //disallows change of closeTime: "the last tab update wasn't a WL closer; keep last closeTime value!!!!!!"
      }
    }

  });
}

//refresh timer duration
function calcTimer()
{
  if(timerOn == false)
  {
    newTime = new Date()/1000;

    if ((newTime - closeTime)/3600 >4 && closeTime != -1)
    {
      timeCount.duration = timeOut;
    }
    else
    {
      if(timeCount.duration + Math.floor((newTime - lastCheck) /refreshModifier) >= timeOut) //prevent timer recharge from being > max duration
      {
        timeCount.duration = timeOut;
      }
      else
      {
        if (timeCount.duration < 0)
        {
          timeCount.duration = 0;
          closeTime = new Date()/1000;
          lastCheck = closeTime;
          censorAll = true;
          censorTabs();
        }
        else
        {
          timeCount.duration += Math.floor((newTime - lastCheck) /refreshModifier);
          lastCheck = newTime;
        }
      }
    }

//    alert(timeCount.duration);
    timeCount.refresh = 3600*4 - (newTime - closeTime);
    if(timeCount.refresh < 0)
    {
      timeCount.refresh = 0;
    }
  }
}

//find all watchlist tabs and tell contentscript to censor them
function censorTabs()
{
  console.log("censorTabs called.");
  chrome.windows.getAll({populate:true},
    function(windows)
    {
      windows.forEach(function(window)
      {
        window.tabs.forEach(function(tab)
        {
          for(let i = 0; i < numWatch; i++)
          {
            //navigate or censor this tab THAT HAS THE SUUUUUUUUUUUUUAAUAUGHGHHGH
            if(tab.url.indexOf(watchList[i]) != -1 && watchList[i] != "")
            {
                let updateTo = "censor.html";
                chrome.tabs.update(tab.id, {url: updateTo});
                censorAll = true;
            }
          }
        });
      });
    });

    //set timer to turn off censor
    if(censorTimerActive == false)
    {
      censorTimerActive = true;
      censorTimer = setInterval(function()
      {
        censorTime--;
        if(censorTime <= 0)
        {
          alert("Censor cleared.");
          censorAll = false;
          censorTimerActive= false;
          censorTime = censorMax;
          clearInterval(censorTimer);
        }
      }, 1000);
  }
}

})();
