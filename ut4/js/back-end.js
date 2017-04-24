/*jslint es6: true */
/*jslint this: true */
var back = {};
back.deletedUsers = [];
back.ACC_NAME_ERROR = "Nombre cuenta invalido";
back.USERNAME_ERROR = "Nombre usuario invalido";
back.BALANCE_ERROR = "Saldo invalido";
back.DATE_ERROR = "Fecha invalida";
back.REPEATED_NAME = "La cuenta ya existe";
back.USER_POINTS_ERROR = "Puntos invalidos";
back.ERROR_TIEMPO = "Tiempo invalido";
back.System = function () {
    "use strict";
    this.system = [back.amnexis, back.asterix, back.asuracenturix, back.obelix,
            back.panoramix, back.abraracurcix, back.canarix];
};
back.User = function (userName, nombreCuenta, tipoCuenta, balance, userPts, accDate, tiempo,
        server) {
    "use strict";
    this.userName = userName;
    this.nombreCuenta = nombreCuenta;
    this.tipoCuenta = tipoCuenta;
    this.balance = balance;
    this.userPts = userPts;
    this.accDate = accDate;
    this.tiempo = tiempo;
    this.server = server;
};
back.Server = function (nombreServidor, ip, os, serverDate) {
    "use strict";
    this.nombreServidor = nombreServidor;
    this.ip = ip;
    this.os = os;
    this.serverDate = serverDate;
    this.users = [];
};

back.createSystem = function () {
    "use strict";
    return new back.System();
};
back.amnexis = new back.Server("Amnexis", "192.16.0.1", "Linux", "01/01/1990");
back.asterix = new back.Server("Asterix", "192.16.4.1", "Linux", "01/01/1990");
back.asuracenturix = new back.Server("Asuracenturix", "192.16.8.1", "Linux", "01/01/1990");
back.obelix = new back.Server("Obelix", "172.21.1.1", "Windows Server", "01/01/1990");
back.panoramix = new back.Server("Panoramix", "172.25.1.1", "Windows Server", "01/01/1990");
back.abraracurcix = new back.Server("Abraracurcix", "1.2.3.4", "NetBSD", "01/01/1990");
back.canarix = new back.Server("Canarix", "2.4.6.8", "OpenBSD", "08/03/2017");
back.System.prototype.datosServidor = function (server) {
    "use strict";
    return this.system.filter(function (value) {
        return value.nombreServidor === server;
    });
};
back.filtraTipoCuenta = function (type) {
    "use strict";
    return this.users.filter(function (value) {
        return value.tipoCuenta === type;
    });
};
back.getDate = function () {
    "use strict";
    var myDate = new Date();
    var year = String(myDate.getFullYear()).substring(2, 4);
    var day = ("0" + myDate.getDate()).slice(-2);
    var todayDate = day + "/" + (myDate.getMonth()  + 1) + "/" + year;
    return todayDate;
};
back.nombreCuentaCorrecto = function (nombreCuenta) {
    "use strict";
    var regExp = new RegExp("^[a-z\\.\\_\\-]+$");
    nombreCuenta = nombreCuenta.trim();
    if (!regExp.test(nombreCuenta)) {
        throw new Error(back.ACC_NAME_ERROR);
    }
};
back.nombreUsuarioCorrecto = function (name) {
    "use strict";
    name = name.trim();
    if (name.split(" ").length !== 2) {
        throw new Error(back.USERNAME_ERROR);
    }
};
back.saldoCorrecto = function (balance) {
    "use strict";
    var index = 0;
    if (balance !== "") {
        while (balance[index]) {
            if (Number.isNaN(parseInt(balance[index]))) {
                index = undefined;
                throw new Error(back.BALANCE_ERROR);
            }
            index += 1;
        }
    } else {
        back.BALANCE_ERROR;
    }
};
back.System.prototype.getServerPoints = function () {
    "use strict";
    return this.system.map(function (value) {
        return value.users.map(function (user) {
            return user.userPts;
        });
    });
};
back.System.prototype.getStages = function () {
    "use strict";
    var x = 0;
    var serverPtos;
    while (this.getServerPoints()[x]) {
        if (this.getServerPoints()[x].length !== 0) {
            serverPtos = this.getServerPoints(this.getServerPoints()[x]);
        } else {
            serverPtos = serverPtos;
        }
        x += 1;
    }
    return serverPtos;
};
back.System.prototype.getAllPoints = function () {
    "use strict";
    var allPoints;
    var arrayPtos = [];
    allPoints = this.getStages();
    for (var x = 0; x < allPoints.length; x += 1) {
        for (var y = 0; y < allPoints[x].length; y += 1) {
            if (allPoints[x][y] !== undefined) {
                arrayPtos.push(allPoints[x][y]);
            } else {
                arrayPtos = arrayPtos;
            }
        }
    }
    return arrayPtos;
};
back.System.prototype.separaSecciones = function () {
    "use strict";
    var less = 0;
    var middle = 0;
    var countLess = 0;
    var countMiddle = 0;
    var countGreater = 0;
    var counter = [];
    var ptos;
    ptos = this.getAllPoints().sort(function (a, b) {
        return a - b;
    });
    less = parseInt(ptos[ptos.length - 1] / 3);
    middle = parseInt(less * 2);
    ptos.map(function (val) {
        if (val < less) {
            countLess = countLess + 1;
        } else {
            if (val < middle) {
                countMiddle = countMiddle + 1;
            } else {
                countGreater = countGreater + 1;
            }
        }
    });
    counter = [countLess, countMiddle, countGreater];
    return counter;
};
back.puntosCorrectos = function (userPts, tipoCuenta) {
    "use strict";
    var index = 0;
    if (userPts !== "") {
        while (userPts[index]) {
            if (Number.isNaN(parseInt(userPts[index]))) {
                index = undefined;
                throw new Error(back.USER_POINTS_ERROR);
            }
            index += 1;
        }
    } else {
        switch (tipoCuenta) {
        case "user":
            userPts = 50;
            break;
        case "premium":
            userPts = 100;
            break;
        default:
            userPts = 10;
        }
    }
    return userPts;
};
back.esFechaCorrecta = function (accDate) {
    "use strict";
    var isRight = true;
    var usaFormatDate = accDate.substr(3, 2) + "/" + accDate.substr(0, 2) + "/" +
            accDate.substr(6, 2);
    var lengthDate = usaFormatDate.split("/").join("");
    var currentYear = new Date();
    var day = new Date(usaFormatDate);
    var year = parseInt(accDate.substr(6, 2), 10);
    currentYear = parseInt(currentYear.getYear().toString().substr(1, 2), 10) + 2000;
    if (year < 0 || year > 16) {
        year = 1900 + year;
    } else {
        year = 2000 + year;
    }
    day = day.getDate();
    if (new Date(usaFormatDate).toString() === "Invalid Date" ||
            day !== parseInt(accDate.substr(0, 2), 10) || lengthDate.length !== 6) {
        throw new Error(back.DATE_ERROR);
    }
    return isRight;
};
back.isValidTime = function (tiempo) {
    "use strict";
    var minutes = parseInt((tiempo.split(":"))[0]);
    var seconds = parseInt((tiempo.split(":"))[1]);
    var result = `${(minutes && seconds < 60 ? tiempo : "")}`;
    return result;
};
back.setConexionTime = function (tiempo) {
    "use strict";
    var minutes;
    var seconds;
    var time;
    try {
        minutes = (tiempo.split(":"))[0];
        seconds = (tiempo.split(":"))[1];
        time = minutes + seconds;
        if (!tiempo || isNaN(time) || seconds.length !== 2) {
            throw new Error(back.ERROR_TIEMPO);
        }
        return tiempo;
    } catch (e) {
        throw new Error(back.ERROR_TIEMPO);
    }
};
back.System.prototype.nombreUnico = function (name) {
    "use strict";
    return this.system.some(function (value) {
        return value.users.some(function (valor) {
            if (valor.nombreCuenta === name) {
                throw new Error(back.REPEATED_NAME);
            }
        });
    });
};
back.incluyeUsuariosBorrados = function (user) {
    "use strict";
    back.deletedUsers.push(user);
};
back.System.prototype.borraUsuario = function (name, server) {
    "use strict";
    var deleted = [];
    var arr = server.users.map(function (value) {
        return value.nombreCuenta;
    });
    var pos = arr.indexOf(name);
    deleted = server.users.splice(pos, 1);
    deleted.forEach(back.incluyeUsuariosBorrados);
};
back.add = function (a, b) {
    "use strict";
    return a + b;
};
back.System.prototype.totalSaldo = function () {
    "use strict";
    var totalBalance = this.system.map(function (value) {
        return value.users.map(function (valor) {
            var balance;
            if (!Number.isNaN(parseInt(valor.balance))) {
                balance = parseInt(valor.balance);
            } else {
                balance = 0;
            }
            return balance;
        });
    });
    totalBalance = totalBalance.map(function (value) {
        var balance = value[0];
        if (balance) {
            balance = value.reduce(back.add);
        } else {
            balance = 0;
        }
        return balance;
    });
    return totalBalance.reduce(back.add);
};
back.System.prototype.totalUsuarios = function () {
    "use strict";
    var totalUsers = this.system.map(function (value) {
        return value.users.length;
    });
    return totalUsers.reduce(back.add);
};

back.System.prototype.getTotalTime = function (tiempo, server) {
    "use strict";
    var minutes = back.System.prototype.getTotalMinutes(tiempo, server);
    var seconds = back.System.prototype.getTotalSeconds(tiempo, server);
    minutes = minutes + Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes}:${seconds}`;
};
back.System.prototype.getTotalMinutes = function (tiempo, server) {
    "use strict";
    var totalMinutes = server.users.map(function (value) {
            var minutes = parseInt((value.tiempo.split(":"))[0]);
            return (!Number.isNaN(minutes)) ? parseInt(minutes) : 0;
    });
    return totalMinutes.reduce(back.add);
};
back.System.prototype.getTotalSeconds = function (tiempo, server) {
    "use strict";
    var totalSeconds = server.users.map(function (value) {
            var seconds = parseInt((value.tiempo.split(":"))[1]);
            return (!Number.isNaN(seconds)) ? parseInt(seconds) : 0;
    });
    return totalSeconds.reduce(back.add);
};
