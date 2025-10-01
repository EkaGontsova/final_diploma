# Документация проекта «Облачное хранилище My Cloud»
Оглавление

1. [Описание проекта](#1-описание-проекта)  
2. [Требования](#2-требования)  
3. [Локальная установка и запуск](#3-локальная-установка-и-запуск)  
   - [3.1 Клонирование репозитория](#31-клонирование-репозитория)  
   - [3.2 Backend](#32-backend)  
   - [3.3 Frontend](#33-frontend)  
4. [Развертывание на сервере reg.ru](#4-развертывание-на-сервере-regru)
   - [4.1 Генерация SSH-ключа (на локальной машине)](#41-генерация-ssh-ключа-на-локальной-машине)
   - [4.2 Копирование публичного SSH-ключа](#42-копирование-публичного-ssh-ключа)
   - [4.3 Создание облачного сервера на reg.ru](#43-создание-облачного-сервера-на-regru)
   - [4.4 Получение данных для подключения](#44-получение-данных-для-подключения)
   - [4.5 Подключение к серверу через SSH](#45-подключение-к-серверу-через-ssh)
   - [4.6 Создание нового пользователя](#46-создание-нового-пользователя)
   - [4.7 Обновление системы и установка пакетов](#47-обновление-системы-и-установка-пакетов)
   - [4.8 Клонирование проекта и подготовка окружения](#48-клонирование-проекта-и-подготовка-окружения)
   - [4.9 Сборка и размещение React фронтенда](#49-сборка-и-размещение-react-фронтенда)
   - [4.10 Запуск Gunicorn](#410-запуск-gunicorn)
   - [4.11 Настройка nginx](#411-настройка-nginx)
   - [4.12 Генерация самоподписанного SSL-сертификата (для HTTPS)](#412-генерация-самоподписанного-ssl-сертификата-для-https)
   - [4.13 Проверка работы](#413-проверка-работы)

## 1. Описание проекта
Проект «Облачное хранилище My Cloud» — веб-приложение для загрузки, хранения и управления файлами с возможностью обмена и администрирования пользователей.

**Backend**: Django REST API с PostgreSQL  
**Frontend**: React + Vite + Redux + Ant Design  
**Аутентификация**: Knox Token Authentication  
**Особенности**: управление файлами, ссылки для скачивания, админ-панель

## 2. Требования
- Python 3.10+
- Node.js 18+ и npm
- PostgreSQL 14+
- Git
- Сервер с Ubuntu 22.04 LTS (рекомендуется для стабильности и поддержки) 

## 3. Локальная установка и запуск
### 3.1 Клонирование репозитория
```bash
git clone <URL_репозитория>
cd <папка_проекта>
```
### 3.2 Backend
```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```
Создайте файл .env в папке backend со следующими переменными (пример):
```bash
SECRET_KEY=ваш_секретный_ключ
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_HOST=localhost
DB_PORT=5432
DB_NAME=db_cloud
DB_USER=user
DB_PASSWORD=password

ADMIN_USERNAME=admin
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
```
Примените миграции и создайте суперпользователя:
```bash
python manage.py migrate
python manage.py createsuperuser
```
Запустите сервер разработки:
```bash
python manage.py runserver
```
### 3.3 Frontend
В отдельном терминале:
```bash
cd frontend
npm install
npm run dev
```
Откройте в браузере 
```bash
http://localhost:5173
```
## 4. Развертывание на сервере reg.ru
### 4.1 Генерация SSH-ключа (на локальном ПК)
Если SSH-ключа ещё нет, сгенерируйте его:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
(Нажмите Enter для всех вопросов, чтобы использовать значения по умолчанию. Ключ будет сохранён в 
~/.ssh/id_rsa.)
### 4.2 Копирование публичного SSH-ключа
Скопируйте публичный ключ для добавления на сервер:
```bash
cat ~/.ssh/id_rsa.pub
```
(Скопируйте вывод — это ваш публичный ключ.)
### 4.3 Создание облачного сервера на reg.ru
- **Образ**: Ubuntu 22.04 LTS
- **vCPU и тип диска**: Стандартный
- **Тариф**: Самый простой
- **Регион размещения**: Выберите нужный

Добавьте ваш публичный SSH-ключ, задав ему название (например, "my-ssh-key").  
Укажите название сервера (например, "my-cloud-server").
Нажмите кнопку "Заказать сервер".
### 4.4 Получение данных для подключения
По электронной почте вы получите IP-адрес сервера (например, 89.104.69.195), логин (обычно root) и пароль.
### 4.5 Подключение к серверу через SSH
Подключитесь к серверу:
```bash
ssh root@<ip адрес сервера>
```
Введите пароль из письма.
### 4.6 Создание нового пользователя
Создайте нового пользователя:
```bash
adduser <имя пользователя>
```
Замените <имя пользователя> на желаемое, например, devuser. 
Укажите пароль и подтвердите.

Добавьте пользователя в группу 
```bash
sudo: usermod <имя пользователя> -aG sudo
```
Выйдите из-под пользователя root:
```bash
logout
```
Подключитесь заново под новым пользователем:
```bash
ssh <имя пользователя>@<ip адрес сервера>
```
Теперь вы работаете под новым пользователем с sudo-правами.
### 4.7 Обновление системы и установка пакетов
Обновите систему:
```bash
sudo apt update && sudo apt upgrade -y
```
Установите необходимые пакеты:
```bash
sudo apt install python3 python3-pip python3-venv git postgresql postgresql-contrib nginx gunicorn openssl -y
```
Настройте firewall:
```bash
sudo apt install ufw -y
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```
Проверьте версии (Python 3.10+, Git, PostgreSQL).  
После установки PostgreSQL создайте базу и пользователя:
```bash
sudo -u postgres psql
CREATE DATABASE <your_db_name>;
CREATE USER <your_db_user> WITH PASSWORD '<your_db_password>';
GRANT ALL PRIVILEGES ON DATABASE <your_db_name> TO <your_db_user>;
\q
```
Замените 'your_password' на реальный пароль. Убедитесь, что в Django settings.py указаны правильные данные для подключения к БД.
### 4.8 Клонирование проекта и подготовка окружения
Клонируйте репозиторий:
```bash
git clone <your_repository_url> /home/<your_username>/<your_project_folder>
```
Перейдите в директорию backend и настройте виртуальное окружение:
```bash
cd /home/<your_username>/<your_project_folder>/backend  
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Создайте и настройте файл .env на сервере:
Создайте файл .env в папке /home/<your_username>/<your_project_folder>/backend.  
Обязательно установите DEBUG=False и укажите ALLOWED_HOSTS с IP-адресом сервера для безопасности в продакшене:
```bash
SECRET_KEY=ваш_секретный_ключ_для_продакшена
DEBUG=False
ALLOWED_HOSTS=<IP_сервера>,127.0.0.1

DB_HOST=localhost
DB_PORT=5432
DB_NAME=<your_db_name>
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>

ADMIN_USERNAME=admin
ADMIN_FIRSTNAME=Admin
ADMIN_LASTNAME=User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
```
Выполните миграции и соберите статику:
```bash
python manage.py migrate
python manage.py collectstatic
```
Настройка прав на папки статики и медиа:  
Настройте права доступа для nginx:
```bash
sudo mkdir -p /home/<your_username>/<your_project_folder>/backend/media
sudo chown -R <your_username>:www-data /home/<your_username>/<your_project_folder>/backend/static
sudo chown -R <your_username>:www-data /home/<your_username>/<your_project_folder>/backend/media
sudo chmod -R 755 /home/<your_username>/<your_project_folder>/backend/static
sudo chmod -R 755 /home/<your_username>/<your_project_folder>/backend/media
```
Это позволит nginx отдавать статические и медиа-файлы.
### 4.9 Сборка и размещение React фронтенда
Установите Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Затем:
```bash
cd /home/<your_username>/<your_project_folder>/frontend
npm install
npm run build
cp -r build/* /var/www/html/frontend/
```
Убедитесь, что nginx имеет права: 
```bash
sudo chown -R www-data:www-data /var/www/html/frontend
```
### 4.10 Запуск Gunicorn
Запустите Gunicorn с unix-сокетом:
```bash
gunicorn --workers 3 --bind unix:/run/gunicorn.sock backend.wsgi:application
```
Для автозапуска создайте systemd-сервис (файл /etc/systemd/system/gunicorn.service):
```bash
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=<your_username>
Group=www-data
WorkingDirectory=/home/<your_username>/<your_project_folder>/backend
ExecStart=/home/<your_username>/<your_project_folder>/backend/venv/bin/gunicorn --workers 3 --bind unix:/run/gunicorn.sock backend.wsgi:application

[Install]
WantedBy=multi-user.target
```
Активируйте сервис:
```bash
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```
После обновлений кода перезапускайте Gunicorn:
```bash
sudo systemctl restart gunicorn  
sudo journalctl -u gunicorn -f
```
### 4.11 Настройка nginx
Создайте конфиг nginx:
```bash
sudo nano /etc/nginx/sites-available/<your_nginx_config>
```
Отредактируйте файл:
```bash
server {
    listen 80;
    server_name <IP_сервера>;

    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name <IP_сервера>;

    # SSL-сертификаты (замените на ваши пути)
    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private.key;
    
    # Размер файла
    client_max_body_size 0;

    # Root для React
    root /var/www/html/frontend;
    index index.html;

    # Проксирование API к Gunicorn
    location /api/ {
        proxy_pass http://unix:/run/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Отдача статических файлов Django
    location /static/ {
        alias /home/<your_username>/<your_project_folder>/backend/static/;
    }

    # Отдача React для остальных запросов
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Включите сайт и проверьте конфиг:
```bash
sudo ln -s /etc/nginx/sites-available/<your_nginx_config> /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/error.log
```
### 4.12 Генерация самоподписанного SSL-сертификата (для HTTPS)
Выполните команду для генерации сертификата, в поле Common Name введите <IP_сервера>.
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/ssl/private/selfsigned.key \
-out /etc/ssl/certs/selfsigned.crt
```
**Важное замечание**: Самоподписанный сертификат подойдёт для тестирования, но браузеры будут показывать предупреждение о безопасности (не доверенный сертификат).  
Для продакшена рекомендуется использовать сертификат от доверенного CA (например, через Let's Encrypt) или Cloudflare Tunnel.  
Если используете IP-адрес, добавьте сертификат в доверенные на вашем ПК для избежания предупреждений.
### 4.13 Проверка работы
Откройте в браузере: 
```bash
https://<your_server_ip>
```
Примите предупреждение о безопасности.  
Проверьте работопособность основных функций.  
Если возникают ошибки, проверьте логи: 
```bash
sudo journalctl -u gunicorn  
sudo tail -f /var/log/nginx/error.log
```