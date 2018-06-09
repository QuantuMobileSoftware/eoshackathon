const Eos = require("eosjs");

const eos = Eos({
    httpEndpoint: 'http://localhost:8888',
    keyProvider: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    debug: true
});

(eos.getTableRows("true", "decidex", "decidex", "bid"));

function getBids() {
    (eos.getTableRows("true", "decidex", "decidex", "bid"));
}

