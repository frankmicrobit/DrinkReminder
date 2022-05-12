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
        SoundLow = 10
        SoundHigh = 127
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
        SoundLow = 40
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
    led.setBrightness(10)
    TravelMode = false
    MovementThreshold = 30
    DoRun = false
    SoundStyle = 2
    music.setVolume(31)
    StartTime = control.millis()
    InDrinkMode = false
    ReferenceTemp = input.temperature()
    AlertCount = 0
    list = [
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
    text_list = [
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
    IxInteval = 5
    MillisecondsBetweenDrink = list[IxInteval]
}
function doAlarm () {
    SoundLevel = Math.constrain(input.soundLevel() * 4, SoundLow, SoundHigh)
    music.setVolume(SoundLevel)
    soundExpression.giggle.play()
}
input.onButtonPressed(Button.A, function () {
    led.stopAnimation()
    basic.clearScreen()
    if (!(DoRun)) {
        DoRun = false
        if (IxInteval > 0) {
            IxInteval += -1
        }
    } else {
        TravelMode = !(TravelMode)
        if (TravelMode) {
            basic.showIcon(IconNames.Rollerskate)
        } else {
            basic.showIcon(IconNames.Snake)
        }
        StartTime = control.millis()
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
        if (IxInteval < list.length) {
            IxInteval += 1
        }
    } else {
        SoundStyle += 1
        if (SoundStyle > 5) {
            SoundStyle = 0
        }
        StartTime = control.millis()
        doSetSoundStyle(SoundStyle)
    }
})
let MillisecondsSinceLastDrink = 0
let SoundLevel = 0
let MillisecondsBetweenDrink = 0
let IxInteval = 0
let text_list: string[] = []
let list: number[] = []
let AlertCount = 0
let ReferenceTemp = 0
let InDrinkMode = false
let StartTime = 0
let SoundStyle = 0
let DoRun = false
let MovementThreshold = 0
let TravelMode = false
let SoundHigh = 0
let SoundLow = 0
doInit()
basic.showIcon(IconNames.No)
serial.redirectToUSB()
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
                    basic.showIcon(IconNames.Sad)
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
        basic.showString("" + (text_list[IxInteval]))
    }
})
basic.forever(function () {
    led.setBrightness(Math.max(input.lightLevel(), 15))
    if (DoRun) {
        MillisecondsBetweenDrink = list[IxInteval]
        if (!(InDrinkMode)) {
            MillisecondsSinceLastDrink = control.millis() - StartTime
            if (MillisecondsSinceLastDrink > 2000) {
                led.plotBarGraph(
                MillisecondsBetweenDrink - MillisecondsSinceLastDrink,
                MillisecondsBetweenDrink
                )
            }
            if (MillisecondsSinceLastDrink > MillisecondsBetweenDrink) {
                InDrinkMode = true
            }
        }
        basic.pause(1000)
    }
})
