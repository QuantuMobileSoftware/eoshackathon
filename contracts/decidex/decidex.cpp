#include <eosiolib/eosio.hpp>

using namespace eosio;

static const account_name decidex_account = N(decidex);
const uint8_t BUY = 0;
const uint8_t SELL = 1;

class decidex : public eosio::contract {
public:
	using contract::contract;

	decidex(account_name self)
	: eosio::contract(self),
	bids(_self, _self),
	orders(_self, _self) {
	}

	/// @abi action

	void placebid(account_name bidder, uint8_t bidType, uint32_t amount, uint32_t price) {
		uint64_t pkey = bids.available_primary_key();
		uint64_t now = current_time();
		bids.emplace(decidex_account, [&pkey, &bidder, &bidType, &amount, &price, &now](auto& g) {
			g.pkey = pkey++;
			g.bidder = bidder;
			g.bidType = bidType;
			g.amount = amount;
			g.price = price;
			g.createdat = now;
		});
	}

	/// @abi action

	void match(account_name caller) {
		require_auth(caller);
		uint64_t now = current_time();
		while (true) {
			// Find sell with min price
			// Find buy bid with max price
			auto buySide = bids.end();
			auto sellSide = bids.end();
			for (auto itr = bids.begin(); itr != bids.end(); itr++) {
				if (itr->bidType == BUY && (buySide == bids.end() || buySide->price < itr->price)) {
					buySide = itr;
				} else if (itr->bidType == SELL && (sellSide == bids.end() || sellSide->price > itr->price)) {
					sellSide = itr;
				}
			}
			if (buySide != bids.end() && sellSide != bids.end() && buySide->price >= sellSide->price) {
				// Match
				uint64_t pkey = orders.available_primary_key();
				orders.emplace(decidex_account, [&pkey, &buySide, &sellSide, &now](auto& g) {
					g.pkey = pkey;
					g.seller = sellSide->bidder;
					g.buyer = buySide->bidder;
					g.amount = buySide->amount < sellSide->amount ? buySide->amount : sellSide->amount;
					g.price = sellSide->price;
					g.createdat = now;
				});
				if (buySide->amount == sellSide->amount) {
					bids.erase(buySide);
					bids.erase(sellSide);
				} else if (buySide->amount < sellSide->amount) {
					bids.modify(sellSide, decidex_account, [&buySide](auto& g) {
						g.amount -= buySide->amount;
					});
					bids.erase(buySide);
				} else {
					bids.modify(buySide, decidex_account, [&sellSide](auto& g) {
						g.amount -= sellSide->amount;
					});
					bids.erase(sellSide);
				}
			} else {
				break;
			}
		}
	}

	/// @abi action

	void clear(account_name caller) {
		for (auto itr = bids.begin(); itr != bids.end(); itr = bids.begin()) {
			bids.erase(itr);
		}
		for (auto itr = orders.begin(); itr != orders.end(); itr = orders.begin()) {
			orders.erase(itr);
		}
	}

	/// @abi action

	void marketbuy(account_name bidder, uint32_t amount) {
		uint64_t now = current_time();
		while (amount > 0) {
			// Find sell with min price
			auto sellSide = bids.end();
			for (auto itr = bids.begin(); itr != bids.end(); itr++) {
				if (itr->bidType == SELL && (sellSide == bids.end() || sellSide->price > itr->price)) {
					sellSide = itr;
				}
			}
			if (sellSide != bids.end()) {
				// Match
				uint64_t pkey = orders.available_primary_key();
				orders.emplace(decidex_account, [&pkey, &sellSide, &bidder, &amount, &now](auto& g) {
					g.pkey = pkey;
					g.seller = sellSide->bidder;
					g.buyer = bidder;
					g.amount = amount < sellSide->amount ? amount : sellSide->amount;
					g.price = sellSide->price;
					g.createdat = now;
				});
				if (amount >= sellSide->amount) {
					amount -= sellSide->amount;
					bids.erase(sellSide);
				} else {
					bids.modify(sellSide, decidex_account, [&amount](auto& g) {
						g.amount -= amount;
					});
					amount = 0;
				}
			} else {
				break;
			}
		}
	}
	
	void marketsell(account_name bidder, uint32_t amount) {
		uint64_t now = current_time();
		while (amount > 0) {
			// Find sell with min price
			auto buySide = bids.end();
			for (auto itr = bids.begin(); itr != bids.end(); itr++) {
				if (itr->bidType == BUY && (buySide == bids.end() || buySide->price < itr->price)) {
					buySide = itr;
				}
			}
			if (buySide != bids.end()) {
				// Match
				uint64_t pkey = orders.available_primary_key();
				orders.emplace(decidex_account, [&pkey, &buySide, &bidder, &amount, &now](auto& g) {
					g.pkey = pkey;
					g.seller = bidder;
					g.buyer = buySide->bidder;
					g.amount = amount < buySide->amount ? amount : buySide->amount;
					g.price = buySide->price;
					g.createdat = now;
				});
				if (amount >= buySide->amount) {
					amount -= buySide->amount;
					bids.erase(buySide);
				} else {
					bids.modify(buySide, decidex_account, [&amount](auto& g) {
						g.amount -= amount;
					});
					amount = 0;
				}
			} else {
				break;
			}
		}
	}


private:
	
	/// @abi table bid i64

	struct bid {
		uint64_t pkey;
		account_name bidder;
		uint8_t bidType;
		uint32_t amount;
		uint32_t price;
		uint64_t createdat;

		uint64_t primary_key()const {
			return pkey;
		}
		EOSLIB_SERIALIZE(bid, (pkey) (bidder) (bidType) (amount) (price) (createdat))
	};
	eosio::multi_index < N(bid), bid> bids;

	/// @abi table order i64

	struct order {
		uint64_t pkey;
		account_name seller;
		account_name buyer;
		uint32_t amount;
		uint32_t price;
		uint64_t createdat;

		uint64_t primary_key()const {
			return pkey;
		}
		EOSLIB_SERIALIZE(order, (pkey) (seller) (buyer) (amount) (price) (createdat))
	};
	eosio::multi_index < N(order), order> orders;

};

EOSIO_ABI(decidex, (placebid) (marketbuy) (marketsell) (match) (clear))
