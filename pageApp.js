const WakaDataPart = (key) => ({
    key: key,
    data: null,
    isLoaded: function() {return this.data != null;},
});

const WakaType = (type, header, key7, key30, keyYear) => ({
    type: type,
    header: header,
    datas: [
        WakaDataPart(key7),
        WakaDataPart(key30),
        WakaDataPart(keyYear)
    ],
    isLoaded: function() {return _(this.datas).every(x => x.isLoaded());},
    mergedData: function() {
        const upDown = (t, n) => t < n * 0.9 ? "down" : (t > n * 1.1 ? "up" : "");
        return _(this.datas[2].data).map(oYear => {
            p7 = _(this.datas[0].data).find({ name: oYear.name })?.percent ?? 0;
            p30 = _(this.datas[1].data).find({ name: oYear.name })?.percent ?? 0;
            return {
                name: oYear.name,
                color: oYear.color,
                percent7: p7,
                percent30: p30,
                percentYear: oYear.percent,
                direction7: upDown(p7, p30),
                direction30: upDown(p30, oYear.percent),
            };
        }).value();
    },
    sortedData: function () {return _(this.mergedData()).orderBy('percent7', 'desc').value();},
});

var langApp = new Vue({
    el: '#page-app',
    data: {
        res: i18n,
        lang: "en-US",
        medata: me,
        githubdata: null,
        wakadata: {
            types: [
                WakaType('languages',   'Language', 'd2be2c53-20ae-4ac4-b92d-42f516260c32', 'd39c662f-e8d9-4726-bbb4-55538a3f0b69', '616c84af-bd80-4666-8b90-2ee0ebfd6f29'),
                WakaType('editors',     'Editor',   '0eeeae5e-2d4d-40a1-83f9-b62e85d20aad', '45db243c-4650-4f12-aebc-7bb74139c33d', '59307ec0-8afb-4687-8e9f-cb6643e7296a'),
                WakaType('categories',  'Category', '1478093c-19af-4a24-8821-65c7a53bfb95', '71cff214-1869-4e0f-97ce-3de2232e773f', '3e83a4b1-8bd0-436d-b716-43184dcf19fb'),
                WakaType('oses',        'OS',       '679b8b0f-4e6b-45e6-88dd-b7a0231b2996', 'e22fefc3-3002-4fe6-91d0-52146aae0aff', '6eed343a-23c6-4707-887f-65ac9afb1260'),
            ],
            isLoaded: function () {return _(this.types).every(x => x.isLoaded());},
        },
    },
    methods: {
        t: function(text) {return this.res.getText(text, this.lang);},
        downloadData: function(url, callback) {this.$http.jsonp(url).then(response => callback(response.body.data));},
        loadData: function() {
            this.wakadata.types.forEach(cat => {
                cat.datas.forEach(datapoint => {
                    this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/' + datapoint.key + '.json', data => datapoint.data = data);
                });
            });
            this.downloadData('https://api.github.com/users/hbbq/events', data => this.githubdata = {data:data});
        },
        objectToArray: (o) => _(Object.getOwnPropertyNames(o)).filter(x => Object.getOwnPropertyDescriptor(o, x).get).map(x => ({name: x, value: Object.getOwnPropertyDescriptor(o, x).get()})).value(),
    },
    computed: {
        loadedWakaTypes: function() {return _(this.wakadata.types).filter(x => x.isLoaded()).value();},
        githubCommits: function() {return _(this.githubdata.data).filter(e => e.type == 'PushEvent').orderBy('created_at', 'desc').value();},
        experience: function() {return _(this.medata.experience).orderBy('end', 'desc').value();},
        techniques: function() {return _(this.medata.techniques).orderBy('name', 'asc').value();},
        aboutMeAsArray: function() {return this.objectToArray(this.medata.about);},
        years: () => [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    },
    created: function() {this.loadData();},
    filters: {
        fixed: (value, decimals) => value.toFixed(decimals),
        cleanDate: (value) => value.replace('T', ' ').replace('Z', ''),
        shortYear: (value) => (value + '').substring(2, 4),
    }
});
