var i18n = {
    languages: ["en-US", "sv-SE"],
    texts: {
        Language: ["Language", "Språk"],
        Percentage: ["Percentage", "Procent"],
        LanguagesTitle: ["Programming languages used during the last 7 days", "Programmeringsspråk jag använt de senaste 7 dagarna"],
    },
    getText: function(text, lang) {
        if(!this.languages || !this.texts || this.texts[text] == null) return text;
        var langPos = _.indexOf(this.languages, lang);
        if(langPos < 0 || this.texts[text].length < langPos + 1) langPos = 0;
        return this.texts[text][langPos];
    },
};