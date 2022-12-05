var langApp = new Vue({
    el: '#page-app',
    data: {
        res: i18n,
        lang: "en-US",
        medata: me,
        langdata: [],
        githubdata: [],
    },
    methods: {
        t: function(text) {
            return this.res.getText(text, this.lang);
        },
        loadData: function() {
            //this.$http.jsonp('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/d2be2c53-20ae-4ac4-b92d-42f516260c32.json').then(function(response){
            this.$http.jsonp('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/616c84af-bd80-4666-8b90-2ee0ebfd6f29.json').then(function(response){
                this.langdata = {
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
        orderedLanguages: function() {
            return _(this.langdata.data).orderBy('percent', 'desc').value();
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
