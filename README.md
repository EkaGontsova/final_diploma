# Документация проекта «Облачное хранилище My Cloud»
Оглавление

1. [Описание проекта](#1-описание-проекта)  
2. [Требования](#2-требования)  
3. [Локальная установка и запуск](#3-локальная-установка-и-запуск)  
   - [3.1 Клонирование репозитория](#31-клонирование-репозитория)  
   - [3.2 Backend](#32-backend)  
   - [3.3 Frontend](#33-frontend)  
4. [Развертывание на сервере reg.ru](#4-развертывание-на-сервере-regru)  

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
python manage.py create_admin
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