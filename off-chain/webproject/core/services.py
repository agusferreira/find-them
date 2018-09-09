from web3.middleware import geth_poa_middleware
from core.models import RequestForFind, SystemSettings
from math import sin, cos, sqrt, atan2, radians
from web3 import Web3
import json


STATES = {
    'open': 1,
    'redeeming_incentives': 2,
    'redeeming_balances': 3,
    'close': 4,
}


class ContractService:

    def send_near_addreses_to_factory(self, request_for_find):
        near_contracts = []
        contracts = RequestForFind.objects.filter(finished=False).exclude(id=request_for_find.id)
        for nc in contracts:
            # approximate radius of earth in km
            R = 6373.0

            lat1 = radians(float(request_for_find.location.split(',')[0]))
            lon1 = radians(float(request_for_find.location.split(',')[1]))
            lat2 = radians(float(nc.location.split(',')[0]))
            lon2 = radians(float(nc.location.split(',')[1]))

            dlon = lon2 - lon1
            dlat = lat2 - lat1

            a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))

            distance = R * c

            near_contracts.append({
                'distance': distance,
                'address': nc.contract_deployed_address
            })

        near_contracts = sorted(near_contracts, key=lambda k: k['distance'])

        data = {}
        if len(near_contracts) > 1:
            data['donator'] = request_for_find.contract_deployed_address
            data['beneficiaryA'] = near_contracts[0]['address']
            data['beneficiaryB'] = near_contracts[1]['address']

        return data

    def check_contract_status(self):
        with open("/usr/src/app/contracts/FindRequest.json") as f:
            info_json = json.load(f)
        abi = info_json["abi"]

        w3 = Web3(Web3.HTTPProvider("https://rinkeby.infura.io/v3/6a38bf6089ba43d59418b0ba54c6c5f1"))

        # inject the poa compatibility middleware to the innermost layer
        w3.middleware_stack.inject(geth_poa_middleware, layer=0)

        for rff in RequestForFind.objects.filter(finished=False):
            try:
                contract = w3.eth.contract(address=Web3.toChecksumAddress(rff.contract_deployed_address), abi=abi)
            except Exception as e:
                print(e)
                continue

            current_state = contract.functions.getCurrentState().call()
            if current_state == 4:
                print("address: %s with current status of %s, set finished done." % (rff.contract_deployed_address, current_state))
                rff.finished = True
                self.send_near_addreses_to_factory(rff)

            rff.contract_status = current_state
            rff.save()

    def validate_contract(self, index, request_for_find):
        with open("/usr/src/app/contracts/FindRequestFactory.json") as f:
            info_json = json.load(f)
        abi = info_json["abi"]

        w3 = Web3(Web3.HTTPProvider("https://rinkeby.infura.io/v3/6a38bf6089ba43d59418b0ba54c6c5f1"))

        # inject the poa compatibility middleware to the innermost layer
        w3.middleware_stack.inject(geth_poa_middleware, layer=0)

        config = SystemSettings.get_solo()
        contract = w3.eth.contract(address=Web3.toChecksumAddress(config.factory_address), abi=abi)

        try:
            index_address = contract.functions.getFindRequest(findRequestNumber=index).call()
        except:
            index_address = None

        print(index)
        print(index_address)
        print(request_for_find.contract_deployed_address)
        if not index_address or (index_address != request_for_find.contract_deployed_address):
            request_for_find.finished = True
            request_for_find.save()


# Make single instance of services
contract_service = ContractService()
