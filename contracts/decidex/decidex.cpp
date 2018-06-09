#include <eosiolib/eosio.hpp>

using namespace eosio;

static const account_name decidex_account = N(decidex);

class counter : public eosio::contract {
public:
	using contract::contract;

	/// @abi action 

	void add(uint32_t val) {
		modify(val);
	}

	/// @abi action 

	void subtract(uint32_t val) {
		modify(-val);
	}

	/// @abi action 

	void set(uint32_t val) {
		values existing_values(decidex_account, decidex_account);
		auto itr = existing_values.begin();
		if (itr == existing_values.end()) {
			existing_values.emplace(decidex_account, [&val, &existing_values](auto& g) {
				g.pkey = existing_values.available_primary_key();
				g.val = val;
				print(g.pkey, " ", g.val);
			});
		} else {
			existing_values.modify(itr, itr->pkey, [&val](auto& g) {
				g.val = val;
				print(g.pkey, " ", g.val);
			});
		}
	}
private:

	void modify(int32_t val) {
		values existing_values(decidex_account, decidex_account);
		auto itr = existing_values.begin();
		if (itr == existing_values.end()) {
			existing_values.emplace(decidex_account, [&val, &existing_values](auto& g) {
				g.pkey = existing_values.available_primary_key();
				g.val = val;
				print(g.pkey, " ", g.val);
			});
			print(val);
		} else {
			existing_values.modify(itr, itr->pkey, [&val](auto& g) {
				g.val = g.val + val;
				print(g.pkey, " ", g.val);
			});
		}
	}

	/// @abi table

	struct value {
		uint64_t pkey;
		int64_t val;

		uint64_t primary_key()const {
			return pkey;
		}
		EOSLIB_SERIALIZE(value, (pkey) (val))
	};

	typedef eosio::multi_index< decidex_account, value> values;
};

EOSIO_ABI(counter, (add) (subtract) (set))
