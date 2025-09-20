import os
from django.core.management import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Создаёт суперпользователя из переменных окружения, если его ещё нет. Используйте --force для перезаписи.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Перезаписать существующего пользователя.',
        )

    def handle(self, *args, **options):
        # Обязательные переменные
        username = os.getenv('ADMIN_USERNAME')
        email = os.getenv('ADMIN_EMAIL')
        password = os.getenv('ADMIN_PASSWORD')
        
        if not all([username, email, password]):
            self.stdout.write(
                self.style.ERROR(
                    'Ошибка: Не заданы обязательные переменные окружения. '
                    'Убедитесь, что установлены ADMIN_USERNAME, ADMIN_EMAIL и ADMIN_PASSWORD.'
                )
            )
            return
        
        first_name = os.getenv('ADMIN_FIRSTNAME', '')
        last_name = os.getenv('ADMIN_LASTNAME', '')
        
        try:
            user_exists = User.objects.filter(username=username).exists()
            
            if user_exists and not options['force']:
                self.stdout.write(
                    self.style.WARNING(
                        f'Суперпользователь "{username}" уже существует. '
                        'Используйте --force для перезаписи.'
                    )
                )
                return
            
            if user_exists and options['force']:
                User.objects.filter(username=username).delete()
                self.stdout.write(
                    self.style.WARNING(f'Существующий пользователь "{username}" удалён.')
                )
            
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Суперпользователь "{username}" успешно создан/обновлён.'
                )
            )
        
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Ошибка при создании пользователя: {e}')
            )

