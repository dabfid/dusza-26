# Világok API

## GET `/worlds/`

```json
{
  "worlds": [
    {
      "id": 1,
      "name": "My World",
      "collection_cards": "...",
      "world_cards": "...",
      "challenges": "..."
    }
  ]
}
```

---

## POST `/worlds/`

Create a new world.

```json
{
  "name": "My World",
  "collection_cards": "...",
  "world_cards": "...",
  "challenges": "..."
}
```

```json
{
  "id": 1
}
```

---

## GET `/worlds/<id>/`

Get a single world by ID.

```json
{
  "id": 1,
  "name": "My World",
  "collection_cards": "...",
  "world_cards": "...",
  "challenges": "..."
}
```

---

## PUT/PATCH `/worlds/update/<id>`

Update an existing world.

```json
{
  "id": 1,
  "name": "Updated Name",
  "collection_cards": "...",
  "world_cards": "...",
  "challenges": "..."
}
```

```json
{
  "success": true
}
```

---

## DELETE `/worlds/delete/<id>`

Delete a world.

```json
{
  "id": 1
}
```

```json
{
  "success": true
}
```
