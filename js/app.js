let chuck = new Vue({
    // the element on the main page to be replaced with our vue app
    el: '#chuck',

    // The data that will bind to our template
    data: {
        appName: 'Chuck Norris Facts',
        currentFact: '',
        categories: [],
        currentCategory: '',
        previousSearches: [],
        searchFacts: [],
        searchFactsString: '',
        searchQuery: '',
        isSearch: false,
        isCategory: false
    },
    filters: {
        highlight(sentence){
            let viewModel = this
            return sentence.replace(viewModel.searchQuery, '<mark>' + viewModel.searchQuery + '</mark>')
        }
    },

    methods:{
        getCategories: function(){
            let viewModel = this

            axios.get('https://api.chucknorris.io/jokes/categories', {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then(function(response){
                viewModel.categories = response.data
                viewModel.categories.push('all')
            })
            .catch(function(err){
                alert(err)
            })
        },
        searchCategory: function(category){
            let viewModel = this
            viewModel.isSearch = false
            viewModel.isCategory = true
            viewModel.currentFact = ''
            let url = 'https://api.chucknorris.io/jokes/random'
            if(category != 'all'){
                url += '?' + category
            }
            axios.get(url,{
                headers: {
                    Accept: 'application/json'
                }
            })
            .then(function(response){
                viewModel.currentFact = response.data.value
            })
            .catch(function(err){
                alert(err)
            })
        },
        searchBar: function(query){
            let viewModel = this
            if(query != ''){
                viewModel.searchQuery = query
                viewModel.searchFacts = []
                viewModel.isCategory = false
                viewModel.isSearch = true
                viewModel.searchFactsString = ''
                axios.get('https://api.chucknorris.io/jokes/search?query=' + query,{
                    headers: {
                        Accept: 'application/json'
                    }
                })
                .then(function(response){
                    if(viewModel.searchFactsString == ''){
                        for(let i = 0; i < response.data.result.length; i++){
                            viewModel.searchFacts.push(response.data.result[i].value.split(" "))
                        }
                        for(let i = 0; i < viewModel.searchFacts.length; i++){
                            viewModel.searchFactsString += '<li>'
                            for (let j = 0; j < viewModel.searchFacts[i].length; j++){
                                let word = viewModel.searchFacts[i][j].toLowerCase()
                                if (word.includes(viewModel.searchQuery.toLowerCase())){
                                    let index = word.indexOf(viewModel.searchQuery.toLowerCase())
                                    let phrase = viewModel.searchFacts[i][j].slice(index, index+viewModel.searchQuery.length)
                                    viewModel.searchFactsString += viewModel.searchFacts[i][j].replace(phrase, "<mark>" + phrase + "</mark>") + ' '
                                }
                                else{
                                    viewModel.searchFactsString += viewModel.searchFacts[i][j] + ' '
                                }
                            }
                            viewModel.searchFactsString += '</li>'
                        }
                        if(!viewModel.previousSearches.includes(query)){
                            viewModel.previousSearches.push(query)
                        }
                    }
                    
                })
        }
        }
    },
    beforeMount(){
        this.getCategories()
    }
})