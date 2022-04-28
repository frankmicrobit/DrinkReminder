function doInit () {
    led.setBrightness(10)
    DoRun = false
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
    music.setVolume(Math.constrain(input.soundLevel() * 4, 30, 255))
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
    }
})
function StopAlert () {
    music.stopAllSounds()
    AlertCount = 0
    StartTime = control.millis()
    InDrinkMode = false
    basic.showIcon(IconNames.Heart)
}
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
    }
})
let AksX = 0
let Temperature = 0
let MillisecondsSinceLastDrink = 0
let MillisecondsBetweenDrink = 0
let IxInteval = 0
let text_list: string[] = []
let list: number[] = []
let AlertCount = 0
let ReferenceTemp = 0
let InDrinkMode = false
let StartTime = 0
let DoRun = false
doInit()
basic.showIcon(IconNames.No)
serial.redirectToUSB()
loops.everyInterval(500, function () {
    if (DoRun) {
        if (InDrinkMode) {
            if (AlertCount < 2) {
                doAlarm()
                basic.showIcon(IconNames.Happy)
            } else {
                if (AlertCount < 1000 && AlertCount % 200 == 0) {
                    doAlarm()
                }
                basic.showIcon(IconNames.Happy)
                basic.pause(200)
                basic.clearScreen()
            }
            AlertCount += 1
        }
        if (Math.abs(1024 - input.acceleration(Dimension.Strength)) > 30) {
            basic.pause(100)
            if (Math.abs(1024 - input.acceleration(Dimension.Strength)) > 30) {
                StopAlert()
            }
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
        Temperature = input.temperature()
        serial.writeValue("Temp", Temperature)
        AksX = input.acceleration(Dimension.Strength)
        serial.writeValue("AksX", AksX)
    }
})
