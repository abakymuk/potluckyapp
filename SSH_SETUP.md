# Настройка SSH для GitHub

## Шаг 1: SSH ключ уже создан

SSH ключ уже был создан в процессе настройки:
- Приватный ключ: `~/.ssh/id_ed25519`
- Публичный ключ: `~/.ssh/id_ed25519.pub`

## Шаг 2: Добавьте публичный ключ в GitHub

1. Скопируйте публичный ключ:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Перейдите в GitHub Settings → SSH and GPG keys
3. Нажмите "New SSH key"
4. Вставьте публичный ключ
5. Дайте ключу название (например, "MacBook Pro")
6. Нажмите "Add SSH key"

## Шаг 3: Проверьте соединение

```bash
ssh -T git@github.com
```

Вы должны увидеть сообщение:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

## Шаг 4: Переключитесь на SSH

После успешной настройки SSH:

```bash
git remote set-url origin git@github.com:abakymuk/potluckyapp.git
```

## Проверка

```bash
git remote -v
```

Должно показать SSH URL вместо HTTPS.

## Troubleshooting

Если SSH не работает:

1. Проверьте, что ключ добавлен в агент:
```bash
ssh-add -l
```

2. Если ключ не найден, добавьте его:
```bash
ssh-add ~/.ssh/id_ed25519
```

3. Проверьте права доступа к файлам:
```bash
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```
