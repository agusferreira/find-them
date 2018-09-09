from django.core.management.base import BaseCommand
from core.services import contract_service
from core.models import RequestForFind


class Command(BaseCommand):
    help = ""

    def handle(self, *args, **options):
        print('--- Process started ---')
        #contract_service.check_contract_status()
        contract_service.send_near_addreses_to_factory(RequestForFind.objects.filter(finished=False).order_by('-id').first())
        print('--- Process finished ---')
