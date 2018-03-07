const Functions = {
  cookies: {
    get: (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    set: (cname, cvalue, exdays=1) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    clear: (cname)=> {
      var d = new Date();
      d.setTime(d.getTime() - (1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=;" + expires + ";path=/";
    }
  },
};

export default Functions;
