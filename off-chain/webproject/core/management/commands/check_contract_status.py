from django.core.management.base import BaseCommand
from core.services import contract_service


class Command(BaseCommand):
    help = ""

    def handle(self, *args, **options):
        print('--- Process started ---')
        contract_service.check_contract_status()
        print('--- Process finished ---')
