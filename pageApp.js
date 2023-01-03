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

const routes = {
    '#/': 'main',
    '#/basics': 'basics',
    '#/brief': 'brief',
    '#/notsobrief': 'notsobrief',
    '#/casestudied': 'casestudies',
    '#/timeline': 'timeline',
    '#/techniques': 'techniques',
    '#/wakatime': 'wakatime',
    '#/github': 'github',
}

var langApp = new Vue({
    el: '#page-app',
    data: {
        currentPath: window.location.hash,
        medata: null,
        githubdata: null,
        wakadata: {
            types: [
                WakaType('languages',   'language', 'd2be2c53-20ae-4ac4-b92d-42f516260c32', 'd39c662f-e8d9-4726-bbb4-55538a3f0b69', '616c84af-bd80-4666-8b90-2ee0ebfd6f29'),
                WakaType('editors',     'editor',   '0eeeae5e-2d4d-40a1-83f9-b62e85d20aad', '45db243c-4650-4f12-aebc-7bb74139c33d', '59307ec0-8afb-4687-8e9f-cb6643e7296a'),
                WakaType('categories',  'category', '1478093c-19af-4a24-8821-65c7a53bfb95', '71cff214-1869-4e0f-97ce-3de2232e773f', '3e83a4b1-8bd0-436d-b716-43184dcf19fb'),
                WakaType('oses',        'os',       '679b8b0f-4e6b-45e6-88dd-b7a0231b2996', 'e22fefc3-3002-4fe6-91d0-52146aae0aff', '6eed343a-23c6-4707-887f-65ac9afb1260'),
            ],
            isLoaded: function () {return _(this.types).every(x => x.isLoaded());},
        },
        visibleIds: [-1],        
    },
    methods: {
        downloadData: function(url, callback) {this.$http.jsonp(url).then(response => callback(response.body.data));},
        loadData: function() {
            this.wakadata.types.forEach(cat => {
                cat.datas.forEach(datapoint => {
                    this.downloadData('https://wakatime.com/share/@74d4c724-26da-438d-baa7-06026a9391c9/' + datapoint.key + '.json', data => datapoint.data = data);
                });
            });
            this.downloadData('https://api.github.com/users/hbbq/events', data => this.githubdata = {data:data});
            this.$http.get('me.yaml').then(response => this.medata = jsyaml.load(response.body));
        },
        objectToArray: (o) => _(Object.getOwnPropertyNames(o)).filter(x => Object.getOwnPropertyDescriptor(o, x).get).map(x => ({name: x, value: Object.getOwnPropertyDescriptor(o, x).get()})).value(),
        toggleVisible: function (o) {
            var id = o.__ob__.dep.id;
            if(_(this.visibleIds).some(x => x == id)){
                this.visibleIds = _(this.visibleIds).filter(x => x != id).value();
            } else {
                this.visibleIds.push(id);
            }
        },
        isVisible: function(o) {
            var id = o.__ob__.dep.id;
            return _(this.visibleIds).some(x => x == id);
        }, 
        keywordDescriptionsAsArray: function() {return this.objectToArray(this.medata.keywords);},
        enrichKeywords: function(kws) {
            return _(kws).map(x => {
                var data = _(this.keywordDescriptionsAsArray()).find({name: x})?.value;
                return {
                    keyword: x,
                    description: data?.name,
                    type: data?.type,
                };
            }).orderBy('keyword', 'asc').value();
        },
    },
    computed: {
        routes: () => routes,
        currentView: function () {return routes[this.currentPath || '#/'];},
        loadedWakaTypes: function() {return _(this.wakadata.types).filter(x => x.isLoaded()).value();},
        githubCommits: function() {return _(this.githubdata.data).filter(e => e.type == 'PushEvent').orderBy('created_at', 'desc').value();},
        experience: function() {return _(this.medata.experience).orderBy(['end', 'start'], ['desc', 'desc']).value();},
        techniques: function() {return _(this.medata.techniques).orderBy('name', 'asc').value();},
        aboutMeAsArray: function() {return this.objectToArray(this.medata.about);},
        linksAsArray: function() {return this.objectToArray(this.medata.links);},
        years: () => [1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
    },
    created: function() {
        this.loadData();
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            this.currentPath = window.location.hash;
        });
    },
    filters: {
        fixed: (value, decimals) => value.toFixed(decimals),
        cleanDate: (value) => value.replace('T', ' ').replace('Z', ''),
        shortYear: (value) => (value + '').substring(2, 4),
    }
});
