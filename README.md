# Drill-Sergeant
Chrome extension that regulates amount of time user spends on unproductive websites; blocks them if time threshold is reached

FEATURES:

Timer
- counts down time until website-blocking is activated
- starts when user navigates to a watchlist site and regenerates when user is not on a watchlist site

Time recharged
- tracks amount of time left on timer
- time left regenerates at rate of realtime/10; timer duration will never exceed the max (45m)

Time reset
- tracks time until timer resets
- timer completely resets to 45m if user has stayed away from a watchlist site for >= 4 hours straight

Configuration
- allows user to set own watchlist sites

----------------------------------------------------------------------------------------------------
FUTURE PLANS:
- implement ability for user to set own watchlist sites (DONE)
- make censor page more aesthetically appealing, possibly interactive

----------------------------------------------------------------------------------------------------
Made with Javascript, HTML/CSS, Google Chrome API
