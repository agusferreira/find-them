from django.core.management.base import BaseCommand
from core.services import contract_service


STATES = {
    'open': 1,
    'redeeming_incentives': 2,
    'redeeming_balances': 3,
    'close': 4,
}


class Command(BaseCommand):
    help = ""

    def handle(self, *args, **options):
        print('--- Process started ---')
        contract_service.check_contract_status()
        print('--- Process finished ---')
