var langApp = new Vue({
    el: '#page-app',
    data: {
        res: i18n,
        lang: "en-US",
        medata: me,
        langdata7: {loaded: false},
        langdata30: {loaded: false},
        langdataYear: {loaded: false},
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
            this.downloadData('https://api.github.com/users/hbbq/events', data => this.githubdata = data);
        },
    },
    computed: {
        languagesLoaded: function() {
            return this.langdata7.loaded && this.langdata30.loaded && this.langdataYear.loaded
        },
        languagesMerged: function() {
            return _(this.langdataYear.data).map(o => {
                py = o.percent;
                d30 = _(this.langdata30.data).find({ name: o.name });
                d7 = _(this.langdata7.data).find({ name: o.name });
                p30 = d30 ? d30.percent : 0;
                p7 = d7 ? d7.percent : 0;
                ratio730 = p7 / p30;
                ratio30y = p30 /py;
                dir7 = ratio730 < 0.9 ? "down" : (ratio730 > 1.1 ? "up" : "");
                dir30 = ratio30y < 0.9 ? "down" : (ratio30y > 1.1 ? "up" : "");
                return {
                    name: o.name,
                    percent: p7,
                    percent30: p30,
                    percentYear: py,
                    direction7: dir7,
                    direction30: dir30,
                };
            }).value();
        },
        orderedLanguages: function() {
            return _(this.languagesMerged).orderBy('percent', 'desc').value();
        },
        githubCommits: function() {
            return _(this.githubdata.data).filter(e => e.type == 'PushEvent').orderBy('created_at', 'desc').value();
        },
        experience: function() {
            return _(this.medata.experience).orderBy('end', 'desc').value();
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
    }
});
