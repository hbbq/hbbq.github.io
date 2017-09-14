var i18n = {
    languages: ["en-US", "sv-SE"],
    texts: {
        Language: ["Language", "Språk"],
        Percentage: ["Percentage", "Procent"],
    },
    getText: function(text, lang) {
        if(!this.languages || !this.texts || this.texts[text] == null) return text;
        var langPos = _.indexOf(this.languages, lang);
        if(langPos < 0 || this.texts[text].length < langPos + 1) langPos = 0;
        return this.texts[text][langPos];
    },
};