/*global document, createSystem, window */
/*jslint es6: true */
/*jslint browser: true */
/*jshint esversion: 6 */
var back;
var front = {};
front.CORRECT = "Usuario creado creectamente";
front.CORRECT_OTHER_SERVER = "Se movio correctamente el usuario al servidor:  ";
front.ERROR_SIN_USUARIO = "No hay usuarios en el sistema";
var system = back.createSystem();
function $(id) {
    "use strict";
    return document.getElementById(id);
}
front.setStyles = function (checked) {
    "use strict";
    var browser = navigator.userAgent;
    if (browser.includes("Firefox")) {
        checked.style.marginLeft = "22em";
        checked.style.marginTop = "-0.75em";
    } else {
        checked.style.marginLeft = "28em";
        checked.style.marginTop = "-0.5em";
    }
};
front.generateDate = function () {
    "use strict";
    $("accDate").value = back.getDate();
};
front.encuentraIndex = function (toDelete, index) {
    "use strict";
    return back.deletedUsers.findIndex((value) => value.nombreCuenta === toDelete[index]);
};
front.encuentraServidor = function (server) {
    "use strict";
    return system.system.findIndex((value) => value.nombreServidor === server);
};
/*
front.compruebaTiempo = function (tiempo) {
    "use strict";
    if (tiempo) {
    tiempo = (back.setConexionTime(back.isValidTime(tiempo)));
    } else {
    tiempo = "0:00";
    }
    return tiempo;
}
*/
front.recuperaCuentas = function () {
    "use strict";
    var id = "delete2";
    var toDelete = front.compruebaCheck(id);
    var posUser;
    var index;
    var server;
    var posServer;
    while (toDelete.length > 0) {
        index = toDelete.length - 1;
        posUser = front.encuentraIndex(toDelete, index);
        server = back.deletedUsers[posUser].server;
        posServer = front.encuentraServidor(server);
        system.system[posServer].users.push(back.deletedUsers[posUser]);
        back.deletedUsers.splice(posUser, 1);
        toDelete.pop();
    }
    front.fillData();
};

front.creaUsuario = function () {
    "use strict";
    try {
        var nombreCuenta = $("nombreCuenta").value;
        var userName = $("userName").value;
        var tipoCuenta = $("tipoCuenta").value;
        var balance = $("balance").value;
        var accDate = $("accDate").value;
        var userPts = $("userPts").value;
        var tiempo = $("tiempo").value;
        var server = $("selectedServer").value;
        var targetServer = system.datosServidor($("selectedServer").value)[0];
        back.nombreCuentaCorrecto(nombreCuenta);
        system.nombreUnico(nombreCuenta);
        back.nombreUsuarioCorrecto(userName);
        back.saldoCorrecto(balance);
        userPts = back.puntosCorrectos(userPts, tipoCuenta);
        if (tiempo) {
      tiempo = (back.setConexionTime(back.isValidTime(tiempo)));
  } else {
      tiempo = "0:00";
  }
        back.esFechaCorrecta(accDate);
        var user = new back.User(
            userName,
            nombreCuenta,
            tipoCuenta,
            balance,
            userPts,
            accDate,
            tiempo,
            server
        );
        targetServer.users.push(user);
        if (server === $("filtroServidor").value) {
            front.fillData();
            $("mssg").innerHTML = front.CORRECT;
        } else {
            $("mssg").innerHTML = front.CORRECT_OTHER_SERVER + server +
                    " server";
        }
        window.setTimeout(function fade() {
            $("mssg").innerHTML = "";
        }, 10000);
        return nombreCuenta;
    } catch (e) {
        $("mssg").innerHTML = e.message;
    }
};
front.filtraServidor = function () {
    "use strict";
    var name = system.datosServidor($("filtroServidor").value)[0].nombreServidor;
    var ip = system.datosServidor($("filtroServidor").value)[0].ip;
    var os = system.datosServidor($("filtroServidor").value)[0].os;
    var date = system.datosServidor($("filtroServidor").value)[0].serverDate;
    $("nombreServidor").innerHTML = "Nombre Servidor: " + name;
    $("serverIP").innerHTML = "IP: " + ip;
    $("serverOS").innerHTML = "OS: " + os;
    $("serverDate").innerHTML = "Fecha Alta: " + date;
};
front.cuentasCreadas = function (table, value) {
    "use strict";
    var row = table.insertRow(1);
    var server = $("filtroServidor").value;
    var arrayServers = [
        "",
        "Amnexis",
        "Asterix",
        "Asuracenturix",
        "Obelix",
        "Panoramix",
        "Abraracurcix",
        "Canarix"
    ];
    var pos = arrayServers.findIndex((value) => value === server);
    var sel = document.createElement("select");
    sel.setAttribute("onchange", "front.moverAlServidor()");
    arrayServers.splice(pos, 1);
    row.setAttribute("id", "rowData1");
    row.insertCell(0).innerHTML = value.nombreCuenta;
    row.insertCell(1).innerHTML = value.userName;
    row.insertCell(2).innerHTML = value.accDate;
    row.insertCell(3).innerHTML = value.balance;
    row.insertCell(4).innerHTML = value.userPts;
    row.insertCell(5).innerHTML = value.tiempo;
    row.insertCell(6).innerHTML = value.tipoCuenta;
    arrayServers.map(function (value) {
        var opt = document.createElement("option");
        opt.value = value;
        opt.innerHTML = value;
        sel.appendChild(opt);
    });
    row.insertCell(7).appendChild(sel);
    row.insertCell(8).innerHTML = "<input type='checkbox'" +
            "id='delete1' class='delete1' value='" +
            value.nombreCuenta + "'/>";
    front.setStyles($("delete1"));
};
front.moverAlServidor = function () {
    "use strict";
    var parent = document.activeElement.parentElement.parentElement;
    var nombreCuenta = parent.firstChild.innerHTML;
    var actualServer = $("filtroServidor").value;
    var targetServer = document.activeElement.value;
    var posActualServer = front.encuentraServidor(actualServer);
    var posTargetServer = front.encuentraServidor(targetServer);
    var arrayUser = system.system[posActualServer].users.filter(function (value) {
        return value.nombreCuenta === nombreCuenta;
    });
    var user = arrayUser[0];
    user.server = targetServer;
    system.system[posTargetServer].users.push(user);
    actualServer = system.system[posActualServer];
    var arr = actualServer.users.map(function (value) {
        return value.nombreCuenta;
    });
    var pos = arr.indexOf(nombreCuenta);
    actualServer.users.splice(pos, 1);
    front.fillData();
};
front.cuentasBorradas = function (table, value) {
    "use strict";
    var row = table.insertRow(1);
    row.setAttribute("id", "rowData2");
    row.insertCell(0).innerHTML = value.nombreCuenta;
    row.insertCell(1).innerHTML = value.userName;
    row.insertCell(2).innerHTML = value.accDate;
    row.insertCell(3).innerHTML = value.balance;
    row.insertCell(4).innerHTML = value.userPts;
    row.insertCell(5).innerHTML = value.tiempo;
    row.insertCell(6).innerHTML = value.tipoCuenta;
    row.insertCell(7).innerHTML = value.server;
    row.insertCell(8).innerHTML = "<input type='checkbox'" +
            "id='delete2' class='delete2' value='" +
            value.nombreCuenta + "'/>";
    front.setStyles($("delete2"));
};
front.filtraTablas = function (server) {
    "use strict";
    var filterUsers = [];
    var toDelete = $("rowData1");
    var table = $("accountsTab");
    var filtroServidor = $("accTypeFilter").value;
    while ($("rowData1")) {
        toDelete = $("rowData1");
        toDelete.remove();
    }
    if (filtroServidor === "all") {
        server.users.map(function (value) {
            front.cuentasCreadas(table, value);
        });
    } else {
        filterUsers = server.users.filter(function (value) {
            return value.accType === filtroServidor;
        });
        filterUsers.map(function (value) {
            front.cuentasCreadas(table, value);
        });
    }
};
front.filtraBorradas = function () {
    "use strict";
    var toDelete = $("rowData2");
    var table = $("deletedAccountsTab");
    while ($("rowData2")) {
        toDelete = $("rowData2");
        toDelete.remove();
    }
    back.deletedUsers.map(function (value) {
        front.cuentasBorradas(table, value);
    });
};
front.fillData = function () {
    "use strict";
    var server = system.datosServidor($("filtroServidor").value)[0];
    front.filtraServidor();
    front.filtraTablas(server);
    front.filtraBorradas();
};
front.usuariosAborrar = function (id) {
    "use strict";
    var index = 0;
    var toDelete = front.compruebaCheck(id);
    var server;
    var name;
    while (toDelete.length > 0) {
        server = system.datosServidor($("filtroServidor").value)[0];
        index = toDelete.length - 1;
        name = toDelete[index];
        system.borraUsuario(name, server);
        toDelete.pop();
    }
    front.fillData();
};
front.borraUsuario = function () {
    "use strict";
    var id = "delete1";
    front.usuariosAborrar(id);
};
front.compruebaCheck = function (id) {
    "use strict";
    var list = document.getElementsByClassName(id);
    var index = 0;
    var toDelete = [];
    while (list[index]) {
        if (list[index].checked === true) {
            toDelete.push(list[index].value);
            index += 1;
        } else {
            index += 1;
        }
    }
    return toDelete;
};
front.borraCompletamente = function () {
    "use strict";
    var id = "delete2";
    var index = 0;
    var toDelete = front.compruebaCheck(id);
    var pos;
    while (toDelete.length > 0) {
        pos = front.encuentraIndex(toDelete, index);
        index = toDelete.length - 1;
        back.deletedUsers.splice(pos, 1);
        toDelete.pop();
    }
    front.fillData();
};
front.generaSaldo = function () {
    "use strict";
    var balance = system.totalSaldo();
    var users = system.totalUsuarios();
    if (users === 0) {
        $("avgBalance").value = front.ERROR_SIN_USUARIO;
    } else {
        $("avgBalance").value = Math.round(balance / users);
    }
};
front.comparaCuentas = function (a, b) {
    "use strict";
    if (a.tipoCuenta < b.tipoCuenta) {
        return -1;
    }
    if (a.tipoCuenta > b.tipoCuenta) {
        return 1;
    }
    return 0;
};

front.estadisticas = function () {
    "use strict";
    var sections = system.separaSecciones();
    document.getElementById("tramo1").innerHTML = sections[0];
    document.getElementById("tramo2").innerHTML = sections[1];
    document.getElementById("tramo3").innerHTML = sections[2];
};
front.compareAccounts = function (a, b) {
    "use strict";
    if (a.tipoCuenta < b.tipoCuenta) {
        return -1;
    }
    if (a.tipoCuenta > b.tipoCuenta) {
        return 1;
    }
    return 0;
};
front.compareAccountsAsc = function (a, b) {
    "use strict";
    if (a.tipoCuenta < b.tipoCuenta) {
        return 1;
    }
    if (a.tipoCuenta > b.tipoCuenta) {
        return -1;
    }
    return 0;
};
front.sortAccounts = function () {
    "use strict";
    var server = system.datosServidor($("filtroServidor").value)[0];
    server.users.sort(front.compareAccounts);
    front.filtraTablas(server);
};
front.sortAccountsAsc = function () {
    "use strict";
    var server = system.datosServidor($("filtroServidor").value)[0];
    server.users.sort(front.compareAccountsAsc);
    front.filtraTablas(server);
};
front.calculateSystemTime = function () {
    "use strict";
    var users = system.totalUsuarios();
    var server = system.datosServidor($("filtroServidor").value)[0];
    if (users === 0) {
        $("tiempoTotal").value = front.ERROR_SIN_USUARIO;
    } else {
        $("tiempoTotal").value = system.getTotalTime("tiempo", server);
    }
};



/*

front.calculateSystemTime = function () {
    "use strict";
    var users = system.totalUsuarios();
    var server = system.datosServidor($("filtroServidor").value)[0];
    if (users === 0) {
        $("tiempoTotal").value = front.ERROR_MEDIA_SALDO;
    } else {
        $("tiempoTotal").value = system.getTotalTime("tiempo", server);
    }
};
*/
