# /c/ content short links — установка на бренд-домены

Пакет: [MM-SMS/orione-content-link](https://github.com/MM-SMS/orione-content-link)  
Ставится с GitHub (без npm registry). Логика `/c/{code}` — Orione SPEC 0328.

Кампании `/g` `/go` `/i` — **не** этот пакет (Cloudflare Worker → redirect-service).

---

## 1. Что нужно заранее

1. **Samples API key** в OrioneCRM → Integrations → Samples API  
   (`content-links:read`, один ключ на весь org — на все бренды одинаковый).
2. Доступ к **репо бренда** (Next.js) и **Vercel** проекта бренда.
3. Для prod: `CAMPAIGNS_MNG_URL=https://orione.io`  
   Для dev/preview: `https://dev.orione.io`

---

## 2. Поставить пакет в репо бренда

В корне Next.js бренда в `package.json`:

```json
{
  "dependencies": {
    "orione-content-link": "github:MM-SMS/orione-content-link#main"
  },
  "scripts": {
    "prebuild": "orione-content-link-ensure",
    "build": "next build"
  }
}
```

```bash
npm install
```

**Почему `prebuild`:** `next build` сам middleware **не создаёт**. Файл пишет
postinstall при `npm install` и/или `orione-content-link-ensure` перед билдом.
Если удалил `middleware.ts` и просто задеплоил — install мог взяться из кэша
без postinstall → файла нет. `prebuild` чинит это на каждом деплое.

После install/ensure появится корневой `middleware.ts`:

```ts
export { middleware } from "orione-content-link"

export const config = {
  matcher: ["/c/:code*"],
}
```

(`config` только inline — Next.js не принимает `export { config } from "…"`.)
- Кастомный/Supabase middleware **сотрётся**, если не поставить skip (см. §5).
- Закоммить: `package.json`, `package-lock.json`, желательно и `middleware.ts`.
- Запушь и задеплой бренд на Vercel.

Закрепить версию (рекомендуется для prod):

```bash
npm install github:MM-SMS/orione-content-link#e517d47
# или тег, когда появится: #v1.1.0
```

---

## 3. Env на Vercel (каждый бренд)

Project → Settings → Environment Variables  
Поставь на **Production** и **Preview** (dev-домены) нужные значения.

| Variable | Обязательно | Пример |
|----------|-------------|--------|
| `ORIONE_CONTENT_LINK_TOKEN` | да | Samples API key (`csk_…`) |
| `CAMPAIGNS_MNG_URL` | да | `https://dev.orione.io` или `https://orione.io` |
| `ORIONE_CONTENT_LINK_FALLBACK_URL` | желательно | полный URL статьи на **этом** бренде, если CRM вернёт чужой host |
| `ORIONE_CONTENT_LINK_NOT_FOUND_PATH` | нет | `/not-found` (default) |
| `ORIONE_CONTENT_LINK_ARTICLE_PATHS` | нет | `/blog/a,/blog/b` — local recompute при 503 |

Redeploy после добавления env.

---

## 4. Проверка на домене

Подставь свой домен и код из CRM (8 символов):

```bash
# headers
curl -sI "https://dev.YOURBRAND.com/c/CODE"

# ожидаемо: 302 + Location на статью (тот же apex-домен)
```

Примеры исходов:

| Ответ | Значение |
|-------|----------|
| `302` → статья | ок |
| `302` → `/not-found` | кода нет в CRM для этого host |
| `401` | неверный Samples key (не brand token) |
| `500` Content link env not configured | нет env на Vercel |

Apex host: `dev.brand.com` / `www.brand.com` → в CRM уходит `brand.com`, prod и dev делят одну запись.

---

## 5. Бренд уже с Supabase middleware

Не даём postinstall затереть файл:

```bash
ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 npm install github:MM-SMS/orione-content-link#main
```

В существующий `middleware.ts` вручную:

```ts
import { updateSession } from "@/lib/supabase/auth/middleware"
import { handleContentLink } from "orione-content-link"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const content = await handleContentLink(request)
  if (content) return content
  return updateSession(request)
}

// matcher — оставь свой широкий (как был для Supabase)
```

Шаблон: `src/templates/middleware.with-supabase.ts` в redirections-lp-setup.

---

## 6. Обновление пакета на доменах

```bash
npm install github:MM-SMS/orione-content-link#main
# закоммить lockfile, задеплой
```

Логика `/c/` обновляется из пакета. Однострочный `middleware.ts` снова перезапишется
postinstall’ом при следующем install.

Чтобы **не** затирать кастомный middleware:

```bash
ORIONE_CONTENT_LINK_SKIP_MIDDLEWARE=1 npm install github:MM-SMS/orione-content-link#main
```
---

## 7. Чеклист на один бренд

- [ ] `npm install github:MM-SMS/orione-content-link#main`
- [ ] есть `middleware.ts` (или ручная связка с Supabase)
- [ ] Vercel: `ORIONE_CONTENT_LINK_TOKEN` + `CAMPAIGNS_MNG_URL`
- [ ] optional fallback URL
- [ ] commit + push + deploy
- [ ] `curl -sI https://dev.brand.com/c/CODE` → 302 на статью

---

## Flow (кратко)

```
GET https://brand.com/c/{code}
  → middleware (пакет)
  → GET {CAMPAIGNS_MNG_URL}/api/public/content-link?code=&host=<apex>
  → Authorization: Bearer <Samples key>
  → 302 long_url | FALLBACK | /not-found
```

## Maintainers

Исходники зеркала также в `packages/orione-content-link` этого репо.  
Публичный install-source: `git@github.com:MM-SMS/orione-content-link.git`.
