var i18n = {
    languages: ["en-US", "sv-SE"],
    texts: {
        positionheader: ["#"],
        nameheader: ["Name", "Namn"],
        roundsheader: ["Rounds", "Rundor"],
        best5header: ["Best 5 rounds", "5 bästa rundor"],
        best5avgheader: ["Avg.", "Medel"],
        best5totalheader: ["Total", "Totalt"],
        month01: ["January", "Januari"],
        month02: ["February", "Februari"],
        month03: ["March", "Mars"],
        month04: ["April", "April"],
        month05: ["May", "Maj"],
        month06: ["June", "Juni"],
        month07: ["July", "Juli"],
        month08: ["August", "Augusti"],
        month09: ["September", "September"],
        month10: ["October", "Oktober"],
        month11: ["November", "November"],
        month12: ["December", "December"],
        login: ["Log in", "Logga in"],
        enterpassword: ["Enter password", "Ange lösenord"],
        ok: ["OK", "OK"],
        cancel: ["Cancel", "Avbryt"],
        loginfailed: ["Log in failed", "Inloggning misslyckades"],
        invalidpassword: ["Invalid password", "Felaktigt lösenord"],
    },
    getText: function(text, lang) {
        if(!this.languages || !this.texts || this.texts[text] == null) return text;
        var langPos = _.indexOf(this.languages, lang);
        if(langPos < 0 || this.texts[text].length < langPos + 1) langPos = 0;
        return this.texts[text][langPos];
    },
};