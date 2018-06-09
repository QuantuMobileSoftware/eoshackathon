add to .bashrc
alias cleos='docker-compose exec eosio /opt/eosio/bin/cleos --wallet-url http://localhost:8888'

$ cleos wallet create
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5Kegr1FFdfsyHqs9u5rbgKCJQRfz8Wxnm2M9PYXz5jviXbdF5T6"

$ cleos wallet unlock --password PW5Kegr1FFdfsyHqs9u5rbgKCJQRfz8Wxnm2M9PYXz5jviXbdF5T6
Unlocked: default

$ cleos create key
Private key: 5JaUdG1QKXP1Tw6UEC6dkGpkrtHBRhsZ2rFusf7FhVGGpWnQQV2
Public key: EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG

$ cleos wallet import 5JaUdG1QKXP1Tw6UEC6dkGpkrtHBRhsZ2rFusf7FhVGGpWnQQV2
imported private key for: EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG

$ cleos wallet keys
[
  "EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG",
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
]

$ cleos create account eosio test EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
executed transaction: d3744a19147c2d0d293612ceb16fe793c1210b552912e8dab3bfc979d8e005df  200 bytes  194 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"test","owner":{"threshold":1,"keys":[{"key":"EOS6MRyAjQq8ud7hVNYcfnVPJqcV...
warning: transaction executed locally, but may not be confirmed by the network yet

$ cleos create account eosio test34 EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

$ cleos get accounts EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG
{
  "account_names": [
    "test"
  ]
}

$ cleos create account eosio decidex EOS5tiJEjt3ykdFm9Vn9ygfW8ZnyvExEYw7d7uhJVmbJg91tKB2HG EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

$ docker-compose exec eosio bash
# cd /contracts/decidex/
# eosiocpp -o decidex.wast decidex.cpp
# eosiocpp -g decidex.abi decidex.cpp

$ cleos set contract decidex /contracts/decidex -p decidex
$ cleos set abi decidex /contracts/decidex/decidex.abi

$ cleos push action decidex placebid '["test", 0, 15, 11]' -p test
$ cleos push action decidex placebid '["test34", 1, 15, 11]' -p test34
$ cleos push action decidex placebid '["test34", 1, 9, 9]' -p test34
$ cleos push action decidex marketsell '["test34", 20]' -p test34
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

$ cleos push action decidex clear '["test"]' -p test
