input.onButtonPressed(Button.A, function () {
    led.stopAnimation()
    basic.clearScreen()
    if (!(DoRun)) {
        DoRun = false
        if (IxInteval > 0) {
            IxInteval += -1
        }
    }
})
input.onGesture(Gesture.ScreenUp, function () {
    if (DoRun) {
        StopAlert()
    }
})
function StopAlert () {
    music.stopAllSounds()
    for (let index = 0; index < 4; index++) {
        basic.showIcon(IconNames.Heart)
        basic.pause(200)
        basic.clearScreen()
    }
    StartTime = control.millis()
    InDrinkMode = false
}
input.onGesture(Gesture.ScreenDown, function () {
    if (DoRun) {
        StopAlert()
    }
})
input.onButtonPressed(Button.AB, function () {
    led.stopAnimation()
    if (DoRun) {
        basic.showIcon(IconNames.No)
    } else {
        StopAlert()
    }
    DoRun = !(DoRun)
})
input.onButtonPressed(Button.B, function () {
    led.stopAnimation()
    basic.clearScreen()
    if (!(DoRun)) {
        DoRun = false
        if (IxInteval < 5) {
            IxInteval += 1
        }
    }
})
let MillisecondsSinceLastDrink = 0
let IxInteval = 0
let InDrinkMode = false
let StartTime = 0
let DoRun = false
led.setBrightness(10)
DoRun = false
basic.showIcon(IconNames.No)
music.setVolume(31)
StartTime = control.millis()
InDrinkMode = false
let ReferenceTemp = input.temperature()
let list = [
60000,
300000,
600000,
1200000,
1800000,
3600000
]
let text_list = [
"1",
"Kaffe",
"10",
"20",
"30",
"60"
]
IxInteval = 0
let MillisecondsBetweenDrink = list[IxInteval]
loops.everyInterval(1000, function () {
    if (DoRun) {
        led.stopAnimation()
        if (InDrinkMode) {
            soundExpression.giggle.playUntilDone()
        }
    } else {
        basic.showString("" + (text_list[IxInteval]))
    }
})
basic.forever(function () {
    if (DoRun) {
        MillisecondsBetweenDrink = list[IxInteval]
        if (!(InDrinkMode)) {
            MillisecondsSinceLastDrink = control.millis() - StartTime
            led.plotBarGraph(
            MillisecondsBetweenDrink - MillisecondsSinceLastDrink,
            MillisecondsBetweenDrink
            )
            if (MillisecondsSinceLastDrink > MillisecondsBetweenDrink) {
                InDrinkMode = true
                basic.showIcon(IconNames.Happy)
            }
        }
        basic.pause(1000)
    } else {
    	
    }
})
