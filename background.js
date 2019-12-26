
(function() //IIFE
{

let settings = {
  wl: ["youtube.com", "facebook.com", "", "", ""],
  censorMax: 60*60,
  timeOut: 60*45,
  refreshModifier: 10
}

//time tracking
let closeTime = -1; //last time you were on a WL: FOR REFRESH TRACkING
let lastCheck = -1; // last time you checked time left: FOR RECHARGE TRACKING
let newTime;
let newStop = false;

//timer setup
let timer;
let timerOn = false;
let timeCount =
{
  type: "time",
  duration: settings.timeOut,
  refresh: 3600*4,
  countingdown: true
}

function countDown()
{
    timeCount.duration--;
    if(timeCount.duration == 0)
    {
      censorTabs();
    }
}

//censor set up
let censorAll = false; // use in tabUpdated (checkTab: if WL == true then block instead of starting timer) for when user tries to bypass punishment by navigating to WL site from different tab
let censorTimerActive = false;
let censorTime = settings.censorMax;
let censorTimer;
let warningNotif =
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
      wl: settings.wl
    }
    chrome.runtime.sendMessage(wl);
  }
  else if(msg.type == "new-watchlist")
  {
    for(let i = 0; i < settings.wl.length; i++)
    {
      settings.wl[i] = msg.wl[i];
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
        for(let i = 0; i < settings.wl.length; i++)
        {
          //watchlist site is still open; proceed counting down
          if(tab.url.indexOf(settings.wl[i]) != -1 && settings.wl[i] != "")
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
      timeCount.duration = settings.timeOut;
    }
    else
    {
      if(timeCount.duration + Math.floor((newTime - lastCheck) /settings.refreshModifier) >= settings.timeOut) //prevent timer recharge from being > max duration
      {
        timeCount.duration = settings.timeOut;
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
          timeCount.duration += Math.floor((newTime - lastCheck) /settings.refreshModifier);
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
          for(let i = 0; i < settings.wl.length; i++)
          {
            //navigate or censor this tab THAT HAS THE SUUUUUUUUUUUUUAAUAUGHGHHGH
            if(tab.url.indexOf(settings.wl[i]) != -1 && settings.wl[i] != "")
            {
                let updateTo = "views/censor.html";
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
          censorTime = settings.censorMax;
          clearInterval(censorTimer);
        }
      }, 1000);
  }
}

})();
