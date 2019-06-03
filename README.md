# DrillSerg_ChromeExtension
Regulates amount of time user spends on unproductive ("watchlist") websites; blocks them if time threshold (currently 45m) is reached 

---------------------------------------------------------------------------------------------------
FEATURES:
Timer
- counts down time until website-blocking is activated
- starts when user navigates to a watchlist site and regenerates when user is not on a watchlist site

Time recharged
-tracks amount of time left on timer
-time left regenerates at rate of realtime/10; timer duration will never exceed the max (45m)

Time reset
-tracks time until timer resets
-timer completely resets to 45m if user has stayed away from a watchlist site for >= 4 hours straight

----------------------------------------------------------------------------------------------------
FUTURE PLANS:
-implement ability for user to set own watchlist sites
-implement options to adjust timer threshold, regen, reset rules
-make censor page have more features/ be possibly interactive?

----------------------------------------------------------------------------------------------------
Made with Javascript, HTML/CSS, Google Chrome APIs (tabs, messaging, notifications)
