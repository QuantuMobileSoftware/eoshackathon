const Eos = require("eosjs");

const eos = Eos({
    httpEndpoint: 'http://localhost:8888',
    keyProvider: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    debug: true
});

console.log(eos.getTableRows("true", "decidex", "decidex", "value"));

