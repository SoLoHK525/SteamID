const BigInt = require('big-integer');

const Regex = {
    SteamID32: /STEAM_[0-5]:[0-10]:\d+$/,
    SteamID64: /\d{17}/
}

module.exports = class SteamID {
    constructor(steamid){
        if(steamid == undefined || steamid == ''){
            throw new Error("Invalid SteamID");
        }
        steamid = steamid.toString();
        console.log(steamid);
        if(Regex.SteamID32.test(steamid)){
            this.type = 'SteamID32'
        }else if(Regex.SteamID64.test(steamid)){
            this.type = 'SteamID64'
        }else{
            throw new Error("Invalid SteamID");
        }
        this.steamid = steamid.toString();
    }

    toSteamID32(){
        if(this.type !== 'SteamID64'){
            return this.steamid;
        }

        let steamid = this.steamid;
        let subid = steamid.substr(4);
        let SteamY = parseInt(subid);
        SteamY -= 1197960265728;
        let SteamX;
        if(SteamY % 2 == 1){
            SteamX = 1;
        }else{
            SteamX = 0;
        }
        SteamY = (SteamY - SteamX) / 2;
        let steam = "STEAM_1:" + SteamX + ":" + SteamY;
        return steam;
    }

    toSteamID64(){
        if(this.type !== 'SteamID32'){
            return this.steamid;
        }

        let steamid = this.steamid;
        let parts = steamid.split(":");
        if(parts.length == 3){
            let v = BigInt('76561197960265728');
            let z = parts[2];
            let y = parts[1];
            let steam = v.plus(z*2).plus(y).toString();
            return steam;
        }else{
            throw new Error("Failed to convert");
        }
    }
}
