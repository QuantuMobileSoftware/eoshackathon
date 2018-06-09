add to .bashrc
alias cleos='docker-compose exec eosio /opt/eosio/bin/cleos --wallet-url http://localhost:8888'

$ cleos wallet create
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5K1J3hDXDZZZvgt1p5td5MNa3qB8kdPd95rM1psWNq81f2FJyKZ"

$ cleos wallet unlock --password PW5K1J3hDXDZZZvgt1p5td5MNa3qB8kdPd95rM1psWNq81f2FJyKZ
Unlocked: default

$ cleos create key
Private key: 5Ht9SziuuAFjNLs21acJPaT2Zgowjb6LodhGpCkUVHC5yYmzXWE
Public key: EOS6NUYkhPvdTRG22Vzcd9AyA9anuke4LE7GZprXqAsm7aN1H3q5a

$ cleos wallet import 5Ht9SziuuAFjNLs21acJPaT2Zgowjb6LodhGpCkUVHC5yYmzXWE
imported private key for: EOS7AwTphaRqMUDXcowWwxvrqxtwAppinTAwdLcWFTDNu3zvJjcxv

$ cleos wallet keys
[
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  "EOS6NUYkhPvdTRG22Vzcd9AyA9anuke4LE7GZprXqAsm7aN1H3q5a"
]

$ cleos create account eosio test EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6NUYkhPvdTRG22Vzcd9AyA9anuke4LE7GZprXqAsm7aN1H3q5a
executed transaction: d3744a19147c2d0d293612ceb16fe793c1210b552912e8dab3bfc979d8e005df  200 bytes  194 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"test","owner":{"threshold":1,"keys":[{"key":"EOS6MRyAjQq8ud7hVNYcfnVPJqcV...
warning: transaction executed locally, but may not be confirmed by the network yet

$ cleos get accounts EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
{
  "account_names": [
    "test"
  ]
}

$ cleos create account eosio decidex EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6NUYkhPvdTRG22Vzcd9AyA9anuke4LE7GZprXqAsm7aN1H3q5a

$ docker-compose exec eosio bash
# cd /contracts/decidex/
# eosiocpp -o decidex.wast decidex.cpp
# eosiocpp -g decidex.abi decidex.cpp

$ cleos set contract decidex /contracts/decidex -p decidex
$ cleos set abi decidex /contracts/decidex/decidex.abi

$ cleos push action decidex placebid '["test", 0, 15, 11]' -p test
$ cleos get table decidex decidex bid
{
  "rows": [{
      "pkey": 0,
      "bidder": "test",
      "bidType": 0,
      "amount": 15,
      "price": 11
    }
  ],
  "more": false
}

$ cleos push action decidex match '["test"]' -p test
$ cleos get table decidex decidex order
{
  "rows": [{
      "pkey": 0,
      "seller": "decidex",
      "buyer": "test",
      "amount": 15,
      "price": 11
    }
  ],
  "more": false
}
