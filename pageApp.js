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
        loadData: function() {
            this.$http.jsonp('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/d2be2c53-20ae-4ac4-b92d-42f516260c32.json').then(function(response){
                this.langdata7 = {
                    loaded: true,
                    data: response.body.data,
                };
            });
            this.$http.jsonp('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/d39c662f-e8d9-4726-bbb4-55538a3f0b69.json').then(function(response){
                this.langdata30 = {
                    loaded: true,
                    data: response.body.data,
                };
            });
            this.$http.jsonp('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/616c84af-bd80-4666-8b90-2ee0ebfd6f29.json').then(function(response){
                this.langdataYear = {
                    loaded: true,
                    data: response.body.data,
                };
            });
            this.$http.jsonp('https://api.github.com/users/hbbq/events').then(function(response){
                this.githubdata = {
                    loaded: true,
                    data: response.body.data,
                };
            });            
        },
    },
    computed: {
        languagesLoaded: function() {
            return this.langdata7.loaded && this.langdata30.loaded && this.langdataYear.loaded
        },
        languagesMerged: function() {
            l30 = this.langdata30;
            l7 = this.langdata7;
            return _(this.langdataYear.data).map(function(o) {
                py = o.percent;
                d30 = _(l30.data).find({ name: o.name });
                d7 = _(l7.data).find({ name: o.name });
                p30 = d30 ? d30.percent : 0;
                p7 = d7 ? d7.percent : 0;
                return {
                    name: o.name,
                    percent: p7,
                    percent30: p30,
                    percentYear: py
                };
            }).value();
        },
        orderedLanguages: function() {
            return _(this.languagesMerged).orderBy('percent', 'desc').value();
        },
        githubCommits: function() {
            return _(this.githubdata.data).filter(function(e) {return e.type == 'PushEvent';}).orderBy('created_at', 'desc').value();
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
