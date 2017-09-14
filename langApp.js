var langApp = new Vue({
    el: '#lang-app',
    data: {
        res: i18n,
        lang: "en-US",
        langdata: {
            loaded: false,
            data: [],
        },
    },
    methods: {
        t: function(text) {
            return this.res.getText(text, this.lang);
        },
        loadData: function() {
            this.$http.jsonp('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/d2be2c53-20ae-4ac4-b92d-42f516260c32.json').then(response => {
                var name = response.body.name;
                var locked = response.body.locked;
                var data = response.body.data;
                this.langdata = {
                    loaded: true,
                    data: data,
                };
            });
        },
    },
    computed: {
        orderedLanguages: function() {
            return _.orderBy(this.langdata.data, 'percent', 'desc');
        }
    },
    created: function() {
        this.loadData();
    },
    filters: {
        fixed: function (value, decimals) {
            return value.toFixed(decimals);
        }
    }
});
