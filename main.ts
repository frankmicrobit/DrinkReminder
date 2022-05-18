function doSetSoundStyle (Style: number) {
    led.stopAnimation()
    // Silent
    if (Style == 0) {
        SoundLow = 0
        SoundHigh = 0
        basic.showLeds(`
            . . . . .
            . # . # .
            . . # . .
            . # . # .
            . . . . .
            `)
    }
    // Normal
    if (Style == 1) {
        SoundLow = 5
        SoundHigh = 5
        basic.showLeds(`
            . # . . .
            . # # . .
            . # . . .
            # # . . .
            # # . . #
            `)
    }
    // Normal
    if (Style == 2) {
        SoundLow = 20
        SoundHigh = 255
        basic.showLeds(`
            . # . . .
            . # # . .
            . # . . .
            # # . . #
            # # . . #
            `)
    }
    // Loud
    if (Style == 3) {
        SoundLow = 80
        SoundHigh = 255
        basic.showLeds(`
            . # . . .
            . # # . .
            . # . . #
            # # . . #
            # # . . #
            `)
    }
    // Loud
    if (Style == 4) {
        SoundLow = 160
        SoundHigh = 255
        basic.showLeds(`
            . # . . .
            . # # . #
            . # . . #
            # # . . #
            # # . . #
            `)
    }
    // Loud
    if (Style == 5) {
        SoundLow = 255
        SoundHigh = 255
        basic.showLeds(`
            . # . . #
            . # # . #
            . # . . #
            # # . . #
            # # . . #
            `)
    }
}
function doInit () {
    power.fullPowerOn(FullPowerSource.A)
    InStandbyMode = false
    led.setBrightness(10)
    TravelMode = false
    MovementThreshold = 30
    DoRun = false
    SoundStyle = 2
    doSetSoundStyle(SoundStyle)
    StartTime = control.millis()
    InDrinkMode = false
    AlertCount = 0
    list_value = [
    10000,
    60000,
    180000,
    300000,
    600000,
    900000,
    1200000,
    1800000,
    3600000
    ]
    list_text = [
    "T",
    "1",
    "3",
    "5",
    "10",
    "15",
    "20",
    "30",
    "60"
    ]
    DoDisplayIntervalCount = 0
    IxInteval = 4
    MillisecondsBetweenDrink = list_value[IxInteval]
}
function doAlarm () {
    if (SoundStyle > 1) {
        // Set alarm volume based on mode and ambisound
        SoundLevel = Math.constrain(input.soundLevel() * 4, SoundLow, SoundHigh)
        music.setVolume(SoundLevel)
    } else {
        // Set alarm volume to lw value
        SoundLevel = SoundLow
        music.setVolume(SoundLevel)
    }
    soundExpression.giggle.play()
    basic.pause(1000)
}
input.onButtonPressed(Button.A, function () {
    led.stopAnimation()
    basic.clearScreen()
    if (!(InStandbyMode)) {
        if (!(DoRun)) {
            if (IxInteval < list_value.length - 1) {
                IxInteval += 1
            } else {
                IxInteval = 0
            }
            DoDisplayIntervalCount = 0
        } else {
            TravelMode = !(TravelMode)
            if (TravelMode) {
                basic.showIcon(IconNames.Rollerskate)
            } else {
                basic.showIcon(IconNames.Snake)
            }
        }
        StartTime = control.millis()
    } else {
        InStandbyMode = false
        StopAlert()
    }
})
function doSleepMode () {
    basic.pause(2000)
    StopAlert()
    InStandbyMode = true
    power.lowPowerRequest(LowPowerMode.Continue)
}
input.onGesture(Gesture.ScreenUp, function () {
    if (TravelMode) {
        StopAlert()
    }
})
function StopAlert () {
    music.stopAllSounds()
    AlertCount = 0
    StartTime = control.millis()
    InDrinkMode = false
    if (MillisecondsSinceLastDrink > 2000) {
        basic.showIcon(IconNames.Heart)
    }
}
input.onGesture(Gesture.ScreenDown, function () {
    if (TravelMode) {
        StopAlert()
    }
})
input.onButtonPressed(Button.AB, function () {
    if (!(InStandbyMode)) {
        led.stopAnimation()
        if (DoRun) {
            basic.showIcon(IconNames.No)
        } else {
            StopAlert()
        }
        DoRun = !(DoRun)
        DoDisplayIntervalCount = 0
    } else {
        InStandbyMode = false
        StopAlert()
    }
})
input.onButtonPressed(Button.B, function () {
    led.stopAnimation()
    basic.clearScreen()
    StartTime = control.millis()
    if (!(DoRun)) {
    	
    } else {
        SoundStyle += 1
        if (SoundStyle > 5) {
            SoundStyle = 0
        }
    }
    doSetSoundStyle(SoundStyle)
})
let MillisecondsSinceLastDrink = 0
let SoundLevel = 0
let MillisecondsBetweenDrink = 0
let IxInteval = 0
let DoDisplayIntervalCount = 0
let list_text: string[] = []
let list_value: number[] = []
let AlertCount = 0
let InDrinkMode = false
let StartTime = 0
let SoundStyle = 0
let DoRun = false
let MovementThreshold = 0
let TravelMode = false
let InStandbyMode = false
let SoundHigh = 0
let SoundLow = 0
doInit()
power.lowPowerEnable(LowPowerEnable.Allow)
basic.showIcon(IconNames.No)
loops.everyInterval(500, function () {
    if (DoRun) {
        if (InDrinkMode) {
            // Sound alarms a number of time
            if (AlertCount < 2) {
                doAlarm()
                basic.showIcon(IconNames.Happy)
            } else {
                // Repeat alarm every minute, if the first alarms are not responded to
                if (AlertCount < 1000 && AlertCount % 200 == 0) {
                    doAlarm()
                }
                if (AlertCount < 1000) {
                    basic.showIcon(IconNames.Happy)
                } else {
                    basic.showLeds(`
                        . . . . .
                        . # . # .
                        . . . . .
                        # # # # #
                        . . . . .
                        `)
                    if (AlertCount > 14000) {
                        doSleepMode()
                    }
                }
                basic.pause(200)
                basic.clearScreen()
            }
            AlertCount += 1
        }
        if (!(TravelMode)) {
            if (Math.abs(1024 - input.acceleration(Dimension.Strength)) > MovementThreshold) {
                basic.pause(100)
                if (Math.abs(1024 - input.acceleration(Dimension.Strength)) > MovementThreshold) {
                    StopAlert()
                }
            }
        }
    } else {
        if (DoDisplayIntervalCount < 3) {
            DoDisplayIntervalCount += 1
            basic.showString("" + (list_text[IxInteval]))
        } else {
            basic.clearScreen()
        }
    }
})
basic.forever(function () {
    led.setBrightness(Math.max(input.lightLevel(), 10))
    if (DoRun) {
        MillisecondsBetweenDrink = list_value[IxInteval]
        if (!(InDrinkMode)) {
            MillisecondsSinceLastDrink = control.millis() - StartTime
            if (MillisecondsSinceLastDrink > 2000) {
                led.plotBarGraph(
                MillisecondsBetweenDrink - MillisecondsSinceLastDrink,
                MillisecondsBetweenDrink
                )
                MovementThreshold = 100
            } else {
                basic.showIcon(IconNames.Heart)
            }
            if (MillisecondsSinceLastDrink > MillisecondsBetweenDrink) {
                InDrinkMode = true
                MovementThreshold = 30
            }
        }
        basic.pause(1000)
    }
})
