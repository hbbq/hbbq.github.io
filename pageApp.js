var langApp = new Vue({
    el: '#page-app',
    data: {
        res: i18n,
        lang: "en-US",
        medata: me,
        langdata7: {loaded: false},
        langdata30: {loaded: false},
        langdataYear: {loaded: false},
        editors7: {loaded: false},
        editors30: {loaded: false},
        editorsYear: {loaded: false},
        oses7: {loaded: false},
        oses30: {loaded: false},
        osesYear: {loaded: false},
        category7: {loaded: false},
        category30: {loaded: false},
        categoryYear: {loaded: false},
        githubdata: [],
    },
    methods: {
        t: function(text) {
            return this.res.getText(text, this.lang);
        },
        downloadData: function(url, callback) {
            this.$http.jsonp(url).then(response => {
                callback({loaded: true, data:response.body.data});
            })
        },
        loadData: function() {
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/d2be2c53-20ae-4ac4-b92d-42f516260c32.json', data => this.langdata7 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/d39c662f-e8d9-4726-bbb4-55538a3f0b69.json', data => this.langdata30 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/616c84af-bd80-4666-8b90-2ee0ebfd6f29.json', data => this.langdataYear = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/0eeeae5e-2d4d-40a1-83f9-b62e85d20aad.json', data => this.editors7 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/45db243c-4650-4f12-aebc-7bb74139c33d.json', data => this.editors30 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/59307ec0-8afb-4687-8e9f-cb6643e7296a.json', data => this.editorsYear = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/679b8b0f-4e6b-45e6-88dd-b7a0231b2996.json', data => this.oses7 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/e22fefc3-3002-4fe6-91d0-52146aae0aff.json', data => this.oses30 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/6eed343a-23c6-4707-887f-65ac9afb1260.json', data => this.osesYear = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/1478093c-19af-4a24-8821-65c7a53bfb95.json', data => this.category7 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/71cff214-1869-4e0f-97ce-3de2232e773f.json', data => this.category30 = data);
            this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/3e83a4b1-8bd0-436d-b716-43184dcf19fb.json', data => this.categoryYear = data);
            this.downloadData('https://api.github.com/users/hbbq/events', data => this.githubdata = data);
        },
        mergeWakaStats: function(s7, s30, sYear) {
            return _(sYear).map(oYear => {
                pYear = oYear.percent;
                o30 = _(s30).find({ name: oYear.name });
                o7 = _(s7).find({ name: oYear.name });
                p30 = o30 ? o30.percent : 0;
                p7 = o7 ? o7.percent : 0;
                ratio7_30 = p7 / p30;
                ratio30_Year = p30 / pYear;
                dir7 = ratio7_30 < 0.9 ? "down" : (ratio7_30 > 1.1 ? "up" : "");
                dir30 = ratio30_Year < 0.9 ? "down" : (ratio30_Year > 1.1 ? "up" : "");
                return {
                    name: oYear.name,
                    color: oYear.color,
                    percent7: p7,
                    percent30: p30,
                    percentYear: pYear,
                    direction7: dir7,
                    direction30: dir30,
                };
            }).value();
        },
    },
    computed: {
        languagesLoaded: function() {
            return this.langdata7.loaded && this.langdata30.loaded && this.langdataYear.loaded
        },
        editorsLoaded: function () {
            return this.editors7.loaded && this.editors30.loaded && this.editorsYear.loaded;
        },
        osesLoaded: function () {
            return this.oses7.loaded && this.oses30.loaded && this.osesYear.loaded;
        },
        categoryLoaded: function () {
            return this.category7.loaded && this.category30.loaded && this.categoryYear.loaded;
        },
        languagesMerged: function() {
            return this.mergeWakaStats(this.langdata7.data, this.langdata30.data, this.langdataYear.data);
        },
        editorsMerged: function() {
            return this.mergeWakaStats(this.editors7.data, this.editors30.data, this.editorsYear.data);
        },
        osesMerged: function() {
            return this.mergeWakaStats(this.oses7.data, this.oses30.data, this.osesYear.data);
        },
        categoryMerged: function() {
            return this.mergeWakaStats(this.category7.data, this.category30.data, this.categoryYear.data);
        },
        orderedLanguages: function() {
            return _(this.languagesMerged).orderBy('percent7', 'desc').value();
        },
        orderedEditors: function() {
            return _(this.editorsMerged).orderBy('percent7', 'desc').value();
        },
        orderedOses: function() {
            return _(this.osesMerged).orderBy('percent7', 'desc').value();
        },
        orderedCategory: function() {
            return _(this.categoryMerged).orderBy('percent7', 'desc').value();
        },
        githubCommits: function() {
            return _(this.githubdata.data).filter(e => e.type == 'PushEvent').orderBy('created_at', 'desc').value();
        },
        experience: function() {
            return _(this.medata.experience).orderBy('end', 'desc').value();
        },
        techniques: function() {
            return _(this.medata.techniques).orderBy('name', 'asc').value();
        },
        years: function() {
            return [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
        },
    },
    created: function() {
        this.loadData();
    },
    filters: {
        fixed: function (value, decimals) {
            return value.toFixed(decimals);
        },
        cleanDate: function(value) {
            return value.replace('T', ' ').replace('Z', '');
        },
        shortYear: function(value) {
            return (value + '').substring(2, 4);
        },
    }
});
